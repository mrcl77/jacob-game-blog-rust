use crate::app_state::AppState;
use crate::i18n::{self, Translations};
use crate::models::post::Post;
use askama::Template;
use axum::{
    extract::State,
    http::StatusCode,
    response::{Html, IntoResponse, Response},
};

#[derive(Template)]
#[template(path = "home.html")]
struct HomeTemplate<'a> {
    posts: Vec<Post>,
    has_posts: bool,
    t: &'a Translations,
}

pub async fn index(State(state): State<AppState>) -> Response {
    let mut posts = match Post::all(&state.db).await {
        Ok(posts) => posts,
        Err(err) => {
            tracing::error!("Database query error: {}", err);
            return StatusCode::INTERNAL_SERVER_ERROR.into_response();
        }
    };

    // Home only shows the most recent featured post plus three in the side stack.
    posts.truncate(4);
    let has_posts = !posts.is_empty();

    match (HomeTemplate {
        posts,
        has_posts,
        t: &i18n::en(),
    })
    .render()
    {
        Ok(html) => Html(html).into_response(),
        Err(err) => {
            tracing::error!("Template render error: {}", err);
            StatusCode::INTERNAL_SERVER_ERROR.into_response()
        }
    }
}
