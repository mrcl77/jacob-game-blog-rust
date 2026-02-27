use crate::app_state::AppState;
use crate::controllers::posts_controller;
use axum::{Router, routing::get};

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/", get(posts_controller::index))
        .route("/posts", get(posts_controller::index))
}
