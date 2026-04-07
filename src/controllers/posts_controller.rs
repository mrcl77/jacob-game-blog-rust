use crate::app_state::AppState;
use crate::i18n::{self, Translations};
use crate::models::post::Post;
use askama::Template;
use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::{Html, IntoResponse, Response},
};

#[derive(Template)]
#[template(path = "index.html")]
struct IndexTemplate {
    posts: Vec<Post>,
    has_posts: bool,
    t: &'static Translations,
}

struct HtmlTemplate<T>(T);

impl<T> IntoResponse for HtmlTemplate<T>
where
    T: Template,
{
    fn into_response(self) -> Response {
        match self.0.render() {
            Ok(html) => Html(html).into_response(),
            Err(err) => {
                tracing::error!("Template render error: {}", err);
                StatusCode::INTERNAL_SERVER_ERROR.into_response()
            }
        }
    }
}

pub async fn index(State(state): State<AppState>) -> Response {
    match Post::all(&state.db).await {
        Ok(posts) => {
            let has_posts = !posts.is_empty();
            HtmlTemplate(IndexTemplate { posts, has_posts, t: &i18n::EN }).into_response()
        }
        Err(err) => {
            tracing::error!("Database query error: {}", err);
            StatusCode::INTERNAL_SERVER_ERROR.into_response()
        }
    }
}

#[derive(Template)]
#[template(path = "post.html")]
struct ShowTemplate {
    post: Post,
    t: &'static Translations,
}

pub async fn show(State(state): State<AppState>, Path(id): Path<i32>) -> Response {
    match Post::find(&state.db, id).await {
        Ok(Some(post)) => HtmlTemplate(ShowTemplate { post, t: &i18n::EN }).into_response(),
        Ok(None) => StatusCode::NOT_FOUND.into_response(),
        Err(err) => {
            tracing::error!("Database query error: {}", err);
            StatusCode::INTERNAL_SERVER_ERROR.into_response()
        }
    }
}
