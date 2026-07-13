use std::{fs::File, io::BufReader};

use rodio::{Decoder, OutputStream, Sink};
use tauri::{image::Image, path::BaseDirectory, AppHandle, Manager};

#[tauri::command]
pub fn play_notification_sound(app: AppHandle) {
    let audio_path = app
        .path()
        .resolve("resources/mee-too.mp3", BaseDirectory::Resource)
        .expect("failed to resolve notification sound");

    std::thread::spawn(move || {
        let file = File::open(audio_path).unwrap();
        let source = Decoder::new(BufReader::new(file)).unwrap();
        let (_stream, stream_handle) = OutputStream::try_default().unwrap();
        let sink = Sink::try_new(&stream_handle).unwrap();
        sink.set_volume(0.5);
        sink.append(source);
        sink.sleep_until_end();
    });
}

#[cfg(target_os = "macos")]
#[tauri::command]
pub fn set_icon_template(is_template: bool, app: AppHandle) {
    let tray = app.tray_by_id("main").expect("tray 'main' not found");
    tray.set_icon_as_template(is_template).unwrap();
    tray.set_icon(Some(Image::from_bytes(include_bytes!("../icons/tray/icon.png")).unwrap()))
        .unwrap();
}

#[cfg(any(target_os = "linux", target_os = "windows"))]
#[tauri::command]
pub fn set_icon_template(is_template: bool, app: AppHandle) {
    // In other systems there is no template option for tray icons
    // So we just simulate like it has.

    let tray = app.tray_by_id("main").expect("tray 'main' not found");
    let icon = if is_template {
        include_bytes!("../icons/128x128.png")
    } else {
        include_bytes!("../icons/tray/icon.png")
    };
    tray.set_icon(Some(Image::from_bytes(icon).unwrap())).unwrap();
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
