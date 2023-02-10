use std::{fs::File, io::BufReader};

use rodio::{Decoder, OutputStream, Sink};
use tauri::AppHandle;

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

#[tauri::command]
pub fn set_icon_template(is_template: bool, app: AppHandle) {
    app.tray_handle().set_icon_as_template(is_template).unwrap();
    app.tray_handle()
        .set_icon(tauri::Icon::Raw(
            include_bytes!("../icons/tray/icon.png").to_vec(),
        ))
        .unwrap();
}
