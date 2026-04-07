use crate::i18n::{self, Translations};
use askama::Template;
use axum::{
    http::StatusCode,
    response::{Html, IntoResponse, Response},
};

#[derive(Template)]
#[template(path = "home.html")]
struct HomeTemplate {
    t: &'static Translations,
}

pub async fn index() -> Response {
    match (HomeTemplate { t: &i18n::EN }).render() {
        Ok(html) => Html(html).into_response(),
        Err(err) => {
            tracing::error!("Template render error: {}", err);
            StatusCode::INTERNAL_SERVER_ERROR.into_response()
        }
    }
}
