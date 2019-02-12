
use nickel::{Nickel, StaticFilesHandler, HttpRouter, Request, Response, MiddlewareResult};
use std::collections::HashMap;

extern crate ws;

use std::thread;

use ws::{listen, CloseCode, Sender, Handler, Message, Result};

// struct Websocket {
//     out: Sender,
// }

// impl Handler for Websocket {
//     fn on_message(&mut self, msg: Message) -> Result<()> {
//         println!("Server got message '{}'. ", msg);
//         self.out.send(msg)
//     }
//
//     fn on_close(&mut self, code: CloseCode, reason: &str) {
//         println!("WebSocket closing for ({:?}) {}", code, reason);
//         println!("Shutting down server after first connection closes.");
//         self.out.shutdown().unwrap();
//     }
// }


fn handle_request<'mw, 'conn>(_req: &mut Request<'mw, 'conn>, res: Response<'mw>) -> MiddlewareResult<'mw> {
    let mut data = HashMap::<&str, &str>::new();
    data.insert("files", "stadtschloss_BIM.tar");
    data.insert("session_key", "50806c25cf76e8921c5ce6f70f4f4f15"); // @todo: session key to be generated
    return res.render("resources/index.html", &data);
}

fn main() {
    // let server = thread::spawn(move || {
    //     listen("127.0.0.1:6768", |out| {
    //         Server { out: out }
    //     }).unwrap()
    // });

    let mut server = Nickel::new();
    server.get("/", handle_request);
    server.utilize(StaticFilesHandler::new("resources/"));
    server.listen("127.0.0.1:6767").unwrap();
}
