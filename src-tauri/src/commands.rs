use std::{fs::File, io::BufReader, sync::Mutex};

use rodio::{Decoder, OutputStream, Sink};
use tauri::{image::Image, path::BaseDirectory, AppHandle, Manager, State, Window};

use crate::{server::AuthServer, utils::get_available_socket_addr};

#[tauri::command]
pub fn play_notification_sound(app: AppHandle) {
    let audio_path = app
        .path()
        .resolve("resources/mee-too.mp3", BaseDirectory::Resource)
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
    let tray = app.tray_by_id("main").expect("tray 'main' not found");
    tray.set_icon_as_template(is_template).unwrap();

    tray.set_icon(Some(
        Image::from_bytes(include_bytes!("../icons/tray/icon.png")).unwrap(),
    ))
    .unwrap();
}

#[cfg(any(target_os = "linux", target_os = "windows"))]
#[tauri::command]
pub fn set_icon_template(is_template: bool, app: AppHandle) {
    // In other systems there is no template option for tray icons
    // So we just simulate like it has.

    let tray = app.tray_by_id("main").expect("tray 'main' not found");

    if is_template {
        tray.set_icon(Some(
            Image::from_bytes(include_bytes!("../icons/128x128.png")).unwrap(),
        ))
        .unwrap();
    } else {
        tray.set_icon(Some(
            Image::from_bytes(include_bytes!("../icons/tray/icon.png")).unwrap(),
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

#[cfg(target_os = "linux")]
#[tauri::command]
pub fn go_to_notification_settings() {}

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
