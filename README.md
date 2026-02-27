# Hello Axum Blog

A small blog app built while learning Rust.

It uses:
- `axum` for HTTP routing
- `askama` for HTML templates
- `tokio-postgres` for PostgreSQL
- `pulldown-cmark` to render Markdown post content

## Features

- Home page with latest posts
- PostgreSQL integration
- Markdown support in post content
- Simple dark blog-like UI
- Basic code organization (`models` module)

## Tech Stack

- Rust (Edition 2024)
- Axum
- Tokio
- Askama
- PostgreSQL

## Project Structure

```text
.
├── src
│   ├── main.rs
│   └── models
│       ├── mod.rs
│       └── post.rs
├── templates
│   └── index.html
└── static
    └── style.css
```

## Getting Started

### 1. Prerequisites

- Rust + Cargo installed
- PostgreSQL running locally
- `psql` CLI available

### 2. Create database

```bash
createdb hello_axum
```

### 3. Create posts table

```bash
psql -U postgres -d hello_axum -c "CREATE TABLE IF NOT EXISTS posts (id SERIAL PRIMARY KEY, title TEXT NOT NULL, content TEXT NOT NULL DEFAULT '');"
```

### 4. Add sample posts

```bash
psql -U postgres -d hello_axum -c "INSERT INTO posts (title, content) VALUES ('First post', '# Hello\nThis is **Markdown**.'), ('Second post', '## Rust + Axum\n- fast\n- simple\n- fun');"
```

### 5. Run the app

```bash
cargo run
```

Open: `http://127.0.0.1:3000`

## Database Configuration

Right now the app uses a hardcoded database URL in `src/main.rs`:

```rust
const DATABASE_URL: &str = "postgres://postgres:postgres@localhost:5432/hello_axum";
```

If your local PostgreSQL setup is different, edit this value.

## Notes

- Markdown is rendered to HTML on the server side.
- `content_html` is displayed in template with `|safe`, so for public user input you should add HTML sanitization in a next step.
