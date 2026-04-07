use crate::app_state::AppState;
use crate::controllers::{home_controller, posts_controller};
use axum::{Router, routing::get};

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/", get(home_controller::index))
        .route("/posts", get(posts_controller::index))
        .route("/posts/{id}", get(posts_controller::show))
}
