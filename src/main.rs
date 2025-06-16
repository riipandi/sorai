use axum::{Router, routing::get};

async fn index() -> &'static str {
    "Hello, World!!!"
}

#[tokio::main]
async fn main() {
    let app = Router::new().route("/", get(index));

    let address = "0.0.0.0:8080";

    println!("Listening: {address}");

    let listener = tokio::net::TcpListener::bind(&address).await.unwrap();

    axum::serve(listener, app).await.unwrap();
}
