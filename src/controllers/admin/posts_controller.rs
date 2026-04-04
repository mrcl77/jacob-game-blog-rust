use crate::app_state::AppState;
use crate::i18n::{self, Translations};
use crate::models::post::Post;
use askama::Template;
use axum::{
    Form,
    extract::{Path, State},
    http::StatusCode,
    response::{Html, IntoResponse, Redirect, Response},
};
use serde::Deserialize;

#[derive(Template)]
#[template(path = "admin/posts/index.html")]
struct IndexTemplate {
    posts: Vec<Post>,
    t: &'static Translations,
}

#[derive(Template)]
#[template(path = "admin/posts/new.html")]
struct NewTemplate {
    t: &'static Translations,
}

#[derive(Template)]
#[template(path = "admin/posts/edit.html")]
struct EditTemplate {
    post: Post,
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

#[derive(Deserialize)]
pub struct PostForm {
    pub title: String,
    pub content: String,
}

pub async fn index(State(state): State<AppState>) -> Response {
    match Post::all(&state.db).await {
        Ok(posts) => HtmlTemplate(IndexTemplate {
            posts,
            t: &i18n::EN,
        })
        .into_response(),
        Err(err) => {
            tracing::error!("DB error: {}", err);
            StatusCode::INTERNAL_SERVER_ERROR.into_response()
        }
    }
}

pub async fn admin_root() -> impl IntoResponse {
    Redirect::to("/admin/posts")
}

pub async fn new() -> impl IntoResponse {
    HtmlTemplate(NewTemplate { t: &i18n::EN })
}

pub async fn create(State(state): State<AppState>, Form(form): Form<PostForm>) -> Response {
    match Post::create(&state.db, &form.title, &form.content).await {
        Ok(_) => Redirect::to("/admin/posts").into_response(),
        Err(err) => {
            tracing::error!("DB error: {}", err);
            StatusCode::INTERNAL_SERVER_ERROR.into_response()
        }
    }
}

pub async fn edit(State(state): State<AppState>, Path(id): Path<i32>) -> Response {
    match Post::find(&state.db, id).await {
        Ok(Some(post)) => HtmlTemplate(EditTemplate {
            post,
            t: &i18n::EN,
        })
        .into_response(),
        Ok(None) => StatusCode::NOT_FOUND.into_response(),
        Err(err) => {
            tracing::error!("DB error: {}", err);
            StatusCode::INTERNAL_SERVER_ERROR.into_response()
        }
    }
}

pub async fn update(
    State(state): State<AppState>,
    Path(id): Path<i32>,
    Form(form): Form<PostForm>,
) -> Response {
    match Post::update(&state.db, id, &form.title, &form.content).await {
        Ok(_) => Redirect::to("/admin/posts").into_response(),
        Err(err) => {
            tracing::error!("DB error: {}", err);
            StatusCode::INTERNAL_SERVER_ERROR.into_response()
        }
    }
}

pub async fn delete(State(state): State<AppState>, Path(id): Path<i32>) -> Response {
    match Post::delete(&state.db, id).await {
        Ok(_) => Redirect::to("/admin/posts").into_response(),
        Err(err) => {
            tracing::error!("DB error: {}", err);
            StatusCode::INTERNAL_SERVER_ERROR.into_response()
        }
    }
}
