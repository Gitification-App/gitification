use std::{io::Cursor, str::FromStr};

use ::ascii::AsciiString;
use tauri::Window;
use tiny_http::{Header, HeaderField, Method, Request, Response, Server};

const STYLE: &str = r#"
    :root {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        line-height: 20px;
        font-synthesis: none;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        -webkit-text-size-adjust: 100%;
    }

    html, body {
        position: fixed;
        left: 0;
        top: 0;
        background-color: rgb(44, 44, 44);
        width: 100%;
        height: 100%;
    }

    body {
        display: flex;
        padding: 15px;
        margin: 0;
    }

    .content {
        margin: auto;
        width: 100%;
        height: 100%;
        max-width: 500px;
        max-height: 400px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        color: rgb(255, 255, 255);
        background-color: rgb(22, 22, 22);
        border-radius: 8px;
    }
"#;

fn create_html(title: String, description: String) -> String {
    format!(
        r#"
        <!DOCTYPE html>
        <html>
            <head>
                <title>{title}</title>
                <style>{STYLE}</style>
            </head>
            <body>
                <div class="content">
                    {description}
                </div>
            </body>
        </html>
    "#
    )
}

fn set_content_type_html(response: &mut Response<Cursor<Vec<u8>>>) {
    response.add_header(Header {
        field: HeaderField::from_str("Content-Type").unwrap(),
        value: AsciiString::from_str("text/html").unwrap(),
    });
}

fn handle_code_request(request: Request, window: &Window) {
    if *request.method() != Method::Get || !request.url().starts_with("/callback?code=") {
        let mut response = Response::from_string(create_html(
            "Not Found - Gitification".to_owned(),
            "NOT FOUND".to_owned(),
        ));

        set_content_type_html(&mut response);
        request.respond(response).unwrap();

        return;
    }

    let url = request.url();
    let code_query = url.split("?code=").collect::<Vec<&str>>()[1];
    let code = code_query.split("&").collect::<Vec<&str>>()[0];

    window.emit("code", code).unwrap();

    let mut response = Response::from_string(create_html(
        "Code - Gitification".to_owned(),
        "You can close this window now.".to_owned(),
    ));

    set_content_type_html(&mut response);
    request.respond(response).unwrap();
}

pub fn apply_http(window: &Window) {
    let win = window.clone();

    tauri::async_runtime::spawn(async move {
        let server = Server::http("0.0.0.0:23846").unwrap();

        for request in server.incoming_requests() {
            handle_code_request(request, &win);
        }
    });
}
