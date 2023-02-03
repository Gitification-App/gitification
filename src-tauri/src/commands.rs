use std::{fs, io::BufReader};

use rodio::{source::Source, Decoder, OutputStream};
use tauri::AppHandle;

#[tauri::command]
pub fn play_notification_sound(app: AppHandle) {
    let audio_path = app
        .path_resolver()
        .resolve_resource("resources/mee-too.mp3")
        .expect("failed to load it");

    let file = fs::File::open(&audio_path).unwrap();

    std::thread::spawn(move || {
        let (_stream, stream_handle) = OutputStream::try_default().unwrap();
        let buf_reader = BufReader::new(file);
        let source = Decoder::new(buf_reader).unwrap();

        stream_handle.play_raw(source.convert_samples()).unwrap();

        std::thread::sleep(std::time::Duration::from_secs(3))
    });
}
