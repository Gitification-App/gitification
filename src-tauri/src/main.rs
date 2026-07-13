#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod commands;

use commands::{
    go_to_notification_settings, play_notification_sound, set_icon_template,
};
use tauri::{
    tray::{MouseButton, MouseButtonState, TrayIconEvent},
    App, Emitter, Manager, PhysicalPosition, WindowEvent,
};
use tauri_plugin_autostart::MacosLauncher;

fn handle_setup(app: &mut App) -> Result<(), Box<dyn std::error::Error>> {
    let window = app.get_webview_window("main").expect("window not found");
    window.set_always_on_top(true)?;

    #[cfg(target_os = "macos")]
    {
        use tauri::ActivationPolicy;
        app.set_activation_policy(ActivationPolicy::Accessory);
    }

    app.tray_by_id("main")
        .expect("tray 'main' not found")
        .on_tray_icon_event(|tray, event| {
            if let TrayIconEvent::Click {
                button: MouseButton::Left,
                button_state: MouseButtonState::Up,
                position,
                ..
            } = event
            {
                let app = tray.app_handle();
                let Some(window) = app.get_webview_window("main") else {
                    return;
                };
                let outer_size = window.outer_size().unwrap();

                if window.is_visible().unwrap() {
                    window.hide().unwrap();
                    window.emit("window:hidden", false).unwrap();
                } else {
                    window.show().unwrap();
                    window.set_focus().unwrap();
                }

                let monitor = window.current_monitor().unwrap().unwrap();
                let screen_size = monitor.size();
                let screen_position = monitor.position();
                let y = if position.y > screen_size.height as f64 / 2.0 {
                    position.y - outer_size.height as f64
                } else {
                    position.y
                };

                window
                    .set_position(PhysicalPosition {
                        x: f64::min(
                            position.x - outer_size.width as f64 / 2.0,
                            screen_position.x as f64 + screen_size.width as f64
                                - outer_size.width as f64,
                        ),
                        y,
                    })
                    .unwrap();
            }
        });

    Ok(())
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_single_instance::init(|_app, _argv, _cwd| {}))
        .plugin(tauri_plugin_deep_link::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_autostart::init(MacosLauncher::LaunchAgent, None))
        .invoke_handler(tauri::generate_handler![
            play_notification_sound,
            set_icon_template,
            go_to_notification_settings
        ])
        .setup(handle_setup)
        .on_window_event(|window, event| {
            if let WindowEvent::Focused(false) = event {
                if let Ok(command) = std::env::var("npm_lifecycle_script") {
                    if command.contains("dev") {
                        return;
                    }
                }
                window.hide().unwrap();
                window.emit("window:hidden", true).unwrap();
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
