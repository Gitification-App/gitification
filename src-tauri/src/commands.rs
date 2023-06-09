use std::{fs::File, io::BufReader, sync::Mutex};

use rodio::{Decoder, OutputStream, Sink};
use tauri::{AppHandle, State, Window};

use crate::{server::AuthServer, utils::get_available_socket_addr};

#[tauri::command]
pub fn play_notification_sound(app: AppHandle) {
    let audio_path = app
        .path_resolver()
        .resolve_resource("resources/mee-too.mp3")
        .expect("failed to load it");

    std::thread::spawn(move || {
        let file = File::open(audio_path).unwrap();
        let buf_reader = BufReader::new(file);
        let source = Decoder::new(buf_reader).unwrap();
        let (_stream, stream_handle) = OutputStream::try_default().unwrap();
        let sink = Sink::try_new(&stream_handle).unwrap();

        sink.append(source);
        sink.set_volume(0.5);
        sink.sleep_until_end();
    });
}

#[cfg(target_os = "macos")]
#[tauri::command]
pub fn set_icon_template(is_template: bool, app: AppHandle) {
    app.tray_handle().set_icon_as_template(is_template).unwrap();

    app.tray_handle()
        .set_icon(tauri::Icon::Raw(
            include_bytes!("../icons/tray/icon.png").to_vec(),
        ))
        .unwrap();
}

#[cfg(any(target_os = "linux", target_os = "windows"))]
#[tauri::command]
pub fn set_icon_template(is_template: bool, app: AppHandle) {
    // In other systems there is no template option for tray icons
    // So we just simulate like it has.

    if is_template {
        app.tray_handle()
            .set_icon(tauri::Icon::Raw(
                include_bytes!("../icons/128x128.png").to_vec(),
            ))
            .unwrap();
    } else {
        app.tray_handle()
            .set_icon(tauri::Icon::Raw(
                include_bytes!("../icons/tray/icon.png").to_vec(),
            ))
            .unwrap();
    }
}

#[tauri::command]
pub fn start_server(window: Window, state: State<'_, Mutex<AuthServer>>) {
    let mut server = state.lock().unwrap();
    let addr = get_available_socket_addr();
    server.listen(window, addr);
}

#[tauri::command]
pub fn stop_server(state: State<'_, Mutex<AuthServer>>) {
    let mut server = state.lock().unwrap();
    server.stop();
}

#[cfg(target_os = "macos")]
#[tauri::command]
pub fn go_to_notification_settings() {
    let _ = std::process::Command::new("open")
        .arg("x-apple.systempreferences:com.apple.preference.notifications")
        .spawn();
}

#[cfg(target_os = "windows")]
#[tauri::command]
pub fn go_to_notification_settings() {
    let _ = std::process::Command::new("start")
        .arg("ms-settings:notifications")
        .spawn();
}
