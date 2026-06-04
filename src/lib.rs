pub mod app_state;
pub mod controllers;
pub mod i18n;
pub mod models;
pub mod routes;

use crate::app_state::AppState;
use axum::{
    Router,
    extract::Request,
    http::{StatusCode, header},
    middleware::{self, Next},
    response::IntoResponse,
};
use base64::{Engine, engine::general_purpose::STANDARD};
use std::sync::Arc;
use tokio_postgres::NoTls;
use tower_http::services::ServeDir;

pub const DATABASE_URL: &str = "postgres://postgres:postgres@localhost:5432/hello_axum";

pub async fn build_state(database_url: &str) -> Result<AppState, tokio_postgres::Error> {
    let (db_client, db_connection) = tokio_postgres::connect(database_url, NoTls).await?;

    tokio::spawn(async move {
        if let Err(err) = db_connection.await {
            tracing::error!("Database connection error: {}", err);
        }
    });

    db_client
        .batch_execute(
            "CREATE TABLE IF NOT EXISTS posts (
                id SERIAL PRIMARY KEY,
                title TEXT NOT NULL,
                content TEXT NOT NULL DEFAULT '',
                created_at TIMESTAMPTZ NOT NULL DEFAULT now()
            );
            ALTER TABLE posts ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now();",
        )
        .await?;

    Ok(AppState {
        db: Arc::new(db_client),
    })
}

pub fn app_router(state: AppState, admin_user: &str, admin_pass: &str) -> Router {
    let expected = format!(
        "Basic {}",
        STANDARD.encode(format!("{}:{}", admin_user, admin_pass))
    );

    let admin = routes::admin_routes::router().layer(middleware::from_fn(
        move |req: Request, next: Next| {
            let expected = expected.clone();
            async move {
                let authorized = req
                    .headers()
                    .get(header::AUTHORIZATION)
                    .and_then(|v| v.to_str().ok())
                    .map(|auth| auth == expected)
                    .unwrap_or(false);

                if authorized {
                    next.run(req).await
                } else {
                    (
                        StatusCode::UNAUTHORIZED,
                        [(header::WWW_AUTHENTICATE, "Basic realm=\"Admin\"")],
                    )
                        .into_response()
                }
            }
        },
    ));

    Router::new()
        .merge(routes::posts_routes::router())
        .merge(admin)
        .with_state(state)
        .nest_service("/static", ServeDir::new("static"))
}
