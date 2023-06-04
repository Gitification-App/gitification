use tauri::Window;

use std::{io::Cursor, net::SocketAddr, str::FromStr, sync::Arc};

use ::ascii::AsciiString;
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
    let url = request.url();

    if *request.method() != Method::Get
        || (!request.url().starts_with("/callback?code=") && !request.url().starts_with("/ping"))
    {
        let mut response = Response::from_string(create_html(
            "Not Found - Gitification".to_owned(),
            "NOT FOUND".to_owned(),
        ));

        set_content_type_html(&mut response);
        request.respond(response).unwrap();

        return;
    }

    if url.starts_with("/ping") {
        let mut response = Response::from_string("{\"pong\": true}");

        response.add_header(Header {
            field: HeaderField::from_str("Content-Type").unwrap(),
            value: AsciiString::from_str("application/json").unwrap(),
        });

        request.respond(response).unwrap();
        return;
    }

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

pub struct AuthServer {
    server: Option<Arc<Server>>,
}

impl AuthServer {
    pub fn new() -> AuthServer {
        AuthServer { server: None }
    }

    pub fn listen(&mut self, window: Window, addr: SocketAddr) {
        if self.server.is_some() {
            return;
        }

        let server = Arc::new(Server::http(addr).unwrap());
        std::thread::spawn({
            let server = Arc::clone(&server);
            move || {
                for request in server.incoming_requests() {
                    handle_code_request(request, &window);
                }
            }
        });

        self.server = Some(server);
    }

    pub fn stop(&mut self) {
        if let Some(server) = self.server.take() {
            server.unblock();
        }
    }
}
