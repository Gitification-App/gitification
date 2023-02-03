#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod commands;
mod http;

use commands::play_notification_sound;
use http::apply_http;

use tauri::{
    ActivationPolicy, App, AppHandle, GlobalWindowEvent, Manager, PhysicalPosition, SystemTray,
    SystemTrayEvent, WindowEvent,
};
use window_vibrancy::{apply_vibrancy, NSVisualEffectMaterial, NSVisualEffectState};

fn handle_system_tray_event(app: &AppHandle, event: SystemTrayEvent) {
    let window = app.get_window("main").unwrap();

    if let SystemTrayEvent::LeftClick { position, .. } = event {
        let win_width = window.outer_size().expect("size").width;

        window
            .set_position(PhysicalPosition {
                x: position.x - win_width as f64 / 2.0,
                y: position.y,
            })
            .expect("couldn't set position of widow");

        if window.is_visible().unwrap() {
            window.hide().unwrap();
        } else {
            window.show().unwrap();
            window.set_focus().unwrap();
        }

        let current_monitor = window.current_monitor().unwrap().unwrap();
        let screen_size = current_monitor.size();
        let screen_position = current_monitor.position();

        window
            .set_position(PhysicalPosition {
                x: f64::min(
                    position.x - win_width as f64 / 2.0,
                    (screen_position.x as f64 + screen_size.width as f64) - win_width as f64,
                ),
                y: position.y,
            })
            .unwrap()
    }
}

fn handle_setup(app: &mut App) -> Result<(), Box<dyn std::error::Error>> {
    let win = app.get_window("main").expect("window not found");

    let _ = win.set_always_on_top(true);
    app.set_activation_policy(ActivationPolicy::Accessory);

    apply_vibrancy(
        &win,
        NSVisualEffectMaterial::HudWindow,
        Some(NSVisualEffectState::Active),
        Some(8.0),
    )
    .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");

    apply_http(win);

    Ok(())
}

fn handle_window_event(event: GlobalWindowEvent) {
    let event_type = event.event();

    if let WindowEvent::Focused(false) = event_type {
        event.window().hide().unwrap();
    }
}

fn main() {
    let tray = SystemTray::new();

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![play_notification_sound])
        .system_tray(tray)
        .on_system_tray_event(handle_system_tray_event)
        .setup(handle_setup)
        .on_window_event(handle_window_event)
        .run(tauri::generate_context!())
        .expect("error while running tauri application")
}
