use hello_axum::{DATABASE_URL, app_router, build_state};
use tokio::net::TcpListener;

#[tokio::main]
async fn main() -> Result<(), std::io::Error> {
    dotenvy::dotenv().ok();

    let admin_user = std::env::var("ADMIN_USER").expect("ADMIN_USER not set");
    let admin_pass = std::env::var("ADMIN_PASS").expect("ADMIN_PASS not set");

    let state = build_state(DATABASE_URL)
        .await
        .expect("Cannot connect to PostgreSQL. Make sure DB is running.");
    let app = app_router(state, &admin_user, &admin_pass);

    let listener = TcpListener::bind(("127.0.0.1", 3000)).await?;

    axum::serve(listener, app).await
}
