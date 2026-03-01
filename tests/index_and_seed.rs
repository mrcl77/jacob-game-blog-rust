use axum::{
    body::{Body, to_bytes},
    http::{Request, StatusCode},
};
use hello_axum::{DATABASE_URL, app_router, build_state};
use std::time::{SystemTime, UNIX_EPOCH};
use tokio_postgres::Client;
use tower::util::ServiceExt;

async fn ensure_schema(db: &Client) -> Result<(), tokio_postgres::Error> {
    db.batch_execute(
        "CREATE TABLE IF NOT EXISTS posts (
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            content TEXT NOT NULL DEFAULT ''
        );",
    )
    .await
}

fn unique_tag(prefix: &str) -> String {
    let nanos = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .expect("clock is before UNIX_EPOCH")
        .as_nanos();
    format!("{prefix}_{nanos}")
}

async fn seed_posts(db: &Client, tag: &str) -> Result<(String, String), tokio_postgres::Error> {
    let title_1 = format!("seed_{tag}_first");
    let title_2 = format!("seed_{tag}_second");
    let content_1 = "# Seed One\nSimple **markdown** content.";
    let content_2 = "## Seed Two\n- item 1\n- item 2";

    db.execute(
        "INSERT INTO posts (title, content) VALUES ($1, $2), ($3, $4)",
        &[&title_1, &content_1, &title_2, &content_2],
    )
    .await?;

    Ok((title_1, title_2))
}

async fn cleanup_seed(db: &Client, tag: &str) -> Result<(), tokio_postgres::Error> {
    let pattern = format!("seed_{tag}_%");
    db.execute("DELETE FROM posts WHERE title LIKE $1", &[&pattern])
        .await?;
    Ok(())
}

#[tokio::test]
async fn seed_inserts_posts() {
    let state = build_state(DATABASE_URL)
        .await
        .expect("db should connect for tests");
    let tag = unique_tag("insert");

    ensure_schema(&state.db)
        .await
        .expect("posts table should exist");
    cleanup_seed(&state.db, &tag)
        .await
        .expect("cleanup before test should work");

    let (title_1, title_2) = seed_posts(&state.db, &tag)
        .await
        .expect("seed should insert rows");

    let rows = state
        .db
        .query(
            "SELECT title FROM posts WHERE title = $1 OR title = $2",
            &[&title_1, &title_2],
        )
        .await
        .expect("query after seed should work");

    assert_eq!(rows.len(), 2);

    cleanup_seed(&state.db, &tag)
        .await
        .expect("cleanup after test should work");
}

#[tokio::test]
async fn index_renders_seeded_posts() {
    let state = build_state(DATABASE_URL)
        .await
        .expect("db should connect for tests");
    let db = state.db.clone();
    let tag = unique_tag("index");

    ensure_schema(&db).await.expect("posts table should exist");
    cleanup_seed(&db, &tag)
        .await
        .expect("cleanup before test should work");
    let (title_1, title_2) = seed_posts(&db, &tag)
        .await
        .expect("seed should insert rows");

    let app = app_router(state, "admin", "test");
    let response = app
        .oneshot(
            Request::builder()
                .uri("/")
                .method("GET")
                .body(Body::empty())
                .expect("request should build"),
        )
        .await
        .expect("request should succeed");

    assert_eq!(response.status(), StatusCode::OK);

    let body_bytes = to_bytes(response.into_body(), usize::MAX)
        .await
        .expect("body should read");
    let body = String::from_utf8(body_bytes.to_vec()).expect("body should be utf8");

    assert!(body.contains(&title_1));
    assert!(body.contains(&title_2));

    cleanup_seed(&db, &tag)
        .await
        .expect("cleanup after test should work");
}
