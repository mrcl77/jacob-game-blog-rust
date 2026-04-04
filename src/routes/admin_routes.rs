use crate::app_state::AppState;
use crate::controllers::admin::posts_controller;
use axum::{
    Router,
    routing::{get, post},
};

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/admin", get(posts_controller::admin_root))
        .route(
            "/admin/posts",
            get(posts_controller::index).post(posts_controller::create),
        )
        .route("/admin/posts/new", get(posts_controller::new))
        .route(
            "/admin/posts/{id}/edit",
            get(posts_controller::edit).post(posts_controller::update),
        )
        .route("/admin/posts/{id}/delete", post(posts_controller::delete))
}
