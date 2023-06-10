#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod commands;
mod server;
mod utils;

use std::sync::Mutex;

use commands::{
    go_to_notification_settings, play_notification_sound, set_icon_template, start_server,
    stop_server,
};
use server::AuthServer;

use tauri::{
    App, AppHandle, GlobalWindowEvent, Manager, PhysicalPosition, SystemTray, SystemTrayEvent,
    WindowEvent,
};

fn handle_system_tray_event(app: &AppHandle, event: SystemTrayEvent) {
    let window = app.get_window("main").unwrap();

    if let SystemTrayEvent::LeftClick { position, .. } = event {
        let win_outer_size = window.outer_size().unwrap();

        if window.is_visible().unwrap() {
            window.hide().unwrap();
            window.emit("window:hidden", false).unwrap();
        } else {
            window.show().unwrap();
            window.set_focus().unwrap();
        }

        window
            .set_position(PhysicalPosition {
                x: position.x,
                y: position.y,
            })
            .unwrap();

        let current_monitor = window.current_monitor().unwrap().unwrap();
        let screen_size = current_monitor.size();
        let screen_position = current_monitor.position();

        let y = if position.y > screen_size.height as f64 / 2.0 {
            position.y - win_outer_size.height as f64
        } else {
            position.y as f64
        };

        window
            .set_position(PhysicalPosition {
                x: f64::min(
                    position.x - win_outer_size.width as f64 / 2.0,
                    (screen_position.x as f64 + screen_size.width as f64)
                        - win_outer_size.width as f64,
                ),
                y,
            })
            .unwrap()
    }
}

fn handle_setup(app: &mut App) -> Result<(), Box<dyn std::error::Error>> {
    let win = app.get_window("main").expect("window not found");

    let _ = win.set_always_on_top(true);

    #[cfg(target_os = "macos")]
    {
        use tauri::ActivationPolicy;
        app.set_activation_policy(ActivationPolicy::Accessory);

        use window_vibrancy::{apply_vibrancy, NSVisualEffectMaterial, NSVisualEffectState};

        apply_vibrancy(
            &win,
            NSVisualEffectMaterial::HudWindow,
            Some(NSVisualEffectState::Active),
            Some(8.0),
        )
        .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");
    }

    Ok(())
}

fn handle_window_event(event: GlobalWindowEvent) {
    let event_type = event.event();

    if let WindowEvent::Focused(false) = event_type {
        let command = std::env::var("npm_lifecycle_script");
        if let Ok(command) = command {
            if command.contains("dev") {
                return;
            };
        }

        event.window().hide().unwrap();
        event.window().emit("window:hidden", true).unwrap();
    }
}

use tauri_plugin_autostart::MacosLauncher;

fn main() {
    let tray = SystemTray::new();

    tauri::Builder::default()
        .manage(Mutex::new(AuthServer::new()))
        .invoke_handler(tauri::generate_handler![
            play_notification_sound,
            set_icon_template,
            start_server,
            stop_server,
            go_to_notification_settings
        ])
        .plugin(tauri_plugin_autostart::init(
            MacosLauncher::LaunchAgent,
            None,
        ))
        .plugin(tauri_plugin_store::Builder::default().build())
        .system_tray(tray)
        .on_system_tray_event(handle_system_tray_event)
        .setup(handle_setup)
        .on_window_event(handle_window_event)
        .run(tauri::generate_context!())
        .expect("error while running tauri application")
}
