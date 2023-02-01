use once_cell::sync::OnceCell;
use rocket::{config::Environment, get, http::RawStr, response::content::Html, routes, Config};
use tauri::Window;

static WINDOW: OnceCell<Window> = OnceCell::new();

#[get("/callback?<code>")]
fn code_handler(code: &RawStr) -> Html<&'static str> {
    WINDOW
        .get()
        .unwrap()
        .emit("code", code.as_str())
        .expect("failed to emit");

    Html(
        r#"
        <!DOCTYPE html>
        <html>
            <head>
                <title>Gitification</title>
            </head>
            <body>
                <h2>You can close this window now</h2>
            </body>
        </html>
    "#,
    )
}

pub fn apply_rocket_http(window: Window) {
    let _ = WINDOW.set(window);

    let config = Config::build(Environment::Staging)
        .address("127.0.0.1")
        .port(23846)
        .finalize()
        .expect("couldnt create config");

    tauri::async_runtime::spawn(async move {
        let _rocket = rocket::custom(config)
            .mount("/", routes![code_handler])
            .launch();
    });
}
