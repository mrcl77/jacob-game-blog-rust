mod models;

use crate::models::post::Post;
use askama::Template;
use axum::{
    Router,
    extract::State,
    http::StatusCode,
    response::{Html, IntoResponse, Response},
    routing::get,
};
use pulldown_cmark::{Options, Parser, html};
use std::sync::Arc;
use tokio::net::TcpListener;
use tokio_postgres::{Client, NoTls};
use tower_http::services::ServeDir;

#[derive(Template)]
#[template(path = "index.html")]
struct IndexTemplate {
    posts: Vec<Post>,
    has_posts: bool,
}

#[derive(Clone)]
struct AppState {
    db: Arc<Client>,
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

async fn root(State(state): State<AppState>) -> Response {
    match fetch_posts(&state.db).await {
        Ok(posts) => {
            let has_posts = !posts.is_empty();
            HtmlTemplate(IndexTemplate {
                posts,
                has_posts,
            })
            .into_response()
        }
        Err(err) => {
            tracing::error!("Database query error: {}", err);
            StatusCode::INTERNAL_SERVER_ERROR.into_response()
        }
    }
}

async fn fetch_posts(db: &Client) -> Result<Vec<Post>, tokio_postgres::Error> {
    let rows = db
        .query(
            "SELECT id, title, content FROM posts ORDER BY id DESC LIMIT 20",
            &[],
        )
        .await?;

    let posts = rows
        .into_iter()
        .map(|row| {
            let markdown_content: String = row.get("content");
            Post {
                id: row.get("id"),
                title: row.get("title"),
                content_html: markdown_to_html(&markdown_content),
            }
        })
        .collect();

    Ok(posts)
}

fn markdown_to_html(markdown: &str) -> String {
    let parser = Parser::new_ext(
        markdown,
        Options::ENABLE_STRIKETHROUGH | Options::ENABLE_TABLES,
    );
    let mut html_output = String::new();
    html::push_html(&mut html_output, parser);
    html_output
}

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
        .route("/", get(root))
        .with_state(state)
        .nest_service("/static", ServeDir::new("static"));

    let listener = TcpListener::bind(("127.0.0.1", 3000)).await?;

    axum::serve(listener, app).await
}
