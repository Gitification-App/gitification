#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod http;

use http::apply_http;

use tauri::{
    ActivationPolicy, App, AppHandle, GlobalWindowEvent, Manager, PhysicalPosition, SystemTray,
    SystemTrayEvent, WindowEvent,
};
use window_vibrancy::{apply_vibrancy, NSVisualEffectMaterial, NSVisualEffectState};

#[tauri::command]
fn greet() -> () {
    println!("Hello")
}

fn handle_system_tray_event(app: &AppHandle, event: SystemTrayEvent) {
    let win = app.get_window("main").unwrap();
    let screen_width = *win.current_monitor().unwrap().unwrap().size();

    if let SystemTrayEvent::LeftClick { position, .. } = event {
        if win.is_visible().unwrap() {
            let _ = win.hide();

            return;
        }

        let win_width = win.outer_size().expect("size").width;

        win.set_position(PhysicalPosition {
            x: f64::min(
                position.x - win_width as f64 / 2.0,
                screen_width.width as f64 - win_width as f64,
            ),
            y: position.y,
        })
        .expect("couldn't set position of widow");

        let _ = win.show();
        let _ = win.set_focus();
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
        .invoke_handler(tauri::generate_handler![greet])
        .system_tray(tray)
        .on_system_tray_event(handle_system_tray_event)
        .setup(handle_setup)
        .on_window_event(handle_window_event)
        .run(tauri::generate_context!())
        .expect("error while running tauri application")
}
