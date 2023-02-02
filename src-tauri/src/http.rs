use std::str::FromStr;

use ::ascii::AsciiString;
use tauri::Window;
use tiny_http::{Header, HeaderField, Method, Request, Response, Server};
use typed_html::{dom::DOMTree, html};

fn handle_code_request(request: Request, window: &Window) {
    if *request.method() != Method::Get || !request.url().starts_with("/callback?code=") {
        let content: DOMTree<String> = html! {
            <html>
                <head>
                    <title>"Unknown Route - Gitification"</title>
                </head>
                <body>
                    <h2 style="text-align: center;">"NOT FOUND"</h2>
                </body>
            </html>
        };

        let mut response =
            Response::from_string(format!("<!DOCTYPE HTML>\n{}", content.to_string()));

        response.add_header(Header {
            field: HeaderField::from_str("Content-Type").unwrap(),
            value: AsciiString::from_str("text/html").unwrap(),
        });

        let _ = request.respond(response);

        return;
    }

    let url = request.url();
    let code_query = url.split("?code=").collect::<Vec<&str>>()[1];
    let code = code_query.split("&").collect::<Vec<&str>>()[0];

    let _ = window.emit("code", code);

    let content: DOMTree<String> = html! {
        <html>
            <head>
                <title>"Code - Gitification"</title>
            </head>
            <body>
                <h2 style="text-align: center;">"You can close this window now"</h2>
            </body>
        </html>
    };

    let mut response = Response::from_string(format!("<!DOCTYPE HTML>\n{}", content.to_string()));

    response.add_header(Header {
        field: HeaderField::from_str("Content-Type").unwrap(),
        value: AsciiString::from_str("text/html").unwrap(),
    });

    let _ = request.respond(response);
}

pub fn apply_http(window: Window) {
    tauri::async_runtime::spawn(async move {
        let server = Server::http("0.0.0.0:23846").unwrap();

        for request in server.incoming_requests() {
            handle_code_request(request, &window);
        }
    });
}
