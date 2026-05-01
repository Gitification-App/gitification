use std::{
    io::Cursor,
    sync::{
        mpsc::{self, Sender},
        Mutex, OnceLock,
    },
};

use rodio::{Decoder, OutputStream, Sink};
use tauri::{AppHandle, State, Window};

use crate::{server::AuthServer, utils::get_available_socket_addr};

static NOTIFICATION_SOUND_BYTES: &[u8] = include_bytes!("../resources/mee-too.mp3");
static AUDIO_THREAD: OnceLock<Sender<()>> = OnceLock::new();

fn audio_sender() -> &'static Sender<()> {
    AUDIO_THREAD.get_or_init(|| {
        let (tx, rx) = mpsc::channel::<()>();
        std::thread::spawn(move || {
            let (_stream, stream_handle) = match OutputStream::try_default() {
                Ok(p) => p,
                Err(e) => {
                    eprintln!("audio thread: no default output stream: {}", e);
                    return;
                }
            };
            while rx.recv().is_ok() {
                let source = match Decoder::new(Cursor::new(NOTIFICATION_SOUND_BYTES)) {
                    Ok(s) => s,
                    Err(e) => {
                        eprintln!("audio thread: decode failed: {}", e);
                        continue;
                    }
                };
                let sink = match Sink::try_new(&stream_handle) {
                    Ok(s) => s,
                    Err(e) => {
                        eprintln!("audio thread: sink creation failed: {}", e);
                        continue;
                    }
                };
                sink.set_volume(0.5);
                sink.append(source);
                sink.sleep_until_end();
            }
        });
        tx
    })
}

#[tauri::command]
pub fn play_notification_sound() {
    if let Err(e) = audio_sender().send(()) {
        eprintln!("play_notification_sound: audio thread channel closed: {}", e);
    }
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
