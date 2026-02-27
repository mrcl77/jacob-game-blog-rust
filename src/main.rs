mod app_state;
mod controllers;
mod models;
mod routes;

use crate::app_state::AppState;
use axum::Router;
use std::sync::Arc;
use tokio::net::TcpListener;
use tokio_postgres::NoTls;
use tower_http::services::ServeDir;

#[tokio::main]
async fn main() -> Result<(), std::io::Error> {
    const DATABASE_URL: &str = "postgres://postgres:postgres@localhost:5432/hello_axum";

    let (db_client, db_connection) = tokio_postgres::connect(DATABASE_URL, NoTls)
        .await
        .expect("Cannot connect to PostgreSQL. Make sure DB is running.");

    tokio::spawn(async move {
        if let Err(err) = db_connection.await {
            tracing::error!("Database connection error: {}", err);
        }
    });

    let state = AppState {
        db: Arc::new(db_client),
    };

    let app = Router::new()
        .merge(routes::posts_routes::router())
        .with_state(state)
        .nest_service("/static", ServeDir::new("static"));

    let listener = TcpListener::bind(("127.0.0.1", 3000)).await?;

    axum::serve(listener, app).await
}
