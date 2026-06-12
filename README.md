# Jacob Game Blog

A blog application with an admin panel for the Jacob game, built with Rust and Axum.

## Features

**Public blog** (`/`)
- Displays the latest 20 posts with rendered Markdown content
- Dark, minimal read-only interface

**Admin panel** (`/admin`)
- Full CRUD for blog posts (create, edit, delete)
- Live Markdown preview in the editor
- Protected with HTTP Basic Authentication
- Responsive dark theme styled with Tailwind CSS
- UI strings extracted into a translation module (`src/i18n.rs`)

## Tech Stack

| Component    | Crate                                        |
|--------------|----------------------------------------------|
| HTTP server  | [axum](https://crates.io/crates/axum) 0.8    |
| Runtime      | [tokio](https://crates.io/crates/tokio)      |
| Templates    | [askama](https://crates.io/crates/askama)     |
| Database     | [tokio-postgres](https://crates.io/crates/tokio-postgres) |
| Markdown     | [pulldown-cmark](https://crates.io/crates/pulldown-cmark) |
| CSS          | [Tailwind CSS v4](https://tailwindcss.com)   |

Rust Edition 2024.

## Project Structure

```
package.json                       # Tailwind configuration & scripts
src/
  main.rs                          # Entry point, binds to 127.0.0.1:3000
  lib.rs                           # Router, middleware, DB connection
  app_state.rs                     # Shared application state (DB client)
  i18n.rs                          # UI translations (English)
  models/
    post.rs                        # Post model with CRUD queries
  controllers/
    posts_controller.rs            # Public blog handler
    admin/
      posts_controller.rs          # Admin CRUD handlers
  routes/
    posts_routes.rs                # GET / and /posts
    admin_routes.rs                # All /admin/* routes
templates/
  index.html                       # Public blog template
  admin/
    layout.html                    # Admin base layout
    posts/
      index.html                   # Posts list
      new.html                     # New post form
      edit.html                    # Edit post form
static/
  style.css                        # Public blog styles
  admin.css                        # Admin panel styles
  input.css                        # Tailwind configuration & sources
  tailwind.css                     # Compiled CSS from Tailwind
tests/
  index_and_seed.rs                # Integration tests
```

## Getting Started

### Prerequisites

- [Rust](https://rustup.rs/) (stable)
- [Node.js](https://nodejs.org/) & npm (for Tailwind CSS)
- PostgreSQL running locally

### 1. Create the database

```bash
createdb hello_axum
```

### 2. Create the posts table

```bash
psql -U postgres -d hello_axum -c \
  "CREATE TABLE IF NOT EXISTS posts (
     id      SERIAL PRIMARY KEY,
     title   TEXT NOT NULL,
     content TEXT NOT NULL DEFAULT ''
   );"
```

### 3. Configure environment variables

Create a `.env` file in the project root (or export the variables):

```
ADMIN_USER=admin
ADMIN_PASS=your_password
```

These credentials protect the admin panel via HTTP Basic Auth.

### 4. Setup styling (Tailwind CSS)

Install the necessary development dependencies:

```bash
npm install
```

Start the Tailwind compiler in watch mode:

```bash
npm run dev:css
```
Leave this process running in the background.

> **Note**: For production environments, compile the optimized production CSS using `npm run build:css`.

### 5. Run the application

In a separate terminal, start the Rust server:

```bash
cargo run
```

The server starts at **http://127.0.0.1:3000**.

### 6. Open in browser

| URL               | Description                     |
|--------------------|---------------------------------|
| `/`                | Public blog (latest 20 posts)   |
| `/posts`           | Same as `/`                     |
| `/admin`           | Redirects to `/admin/posts`     |
| `/admin/posts`     | List all posts                  |
| `/admin/posts/new` | Create a new post               |
| `/admin/posts/:id/edit` | Edit an existing post      |

## Database

The connection string is defined in `src/lib.rs`:

```
postgres://postgres:postgres@localhost:5432/hello_axum
```

Adjust it if your local PostgreSQL uses different credentials or port.

### Seed sample data

```bash
psql -U postgres -d hello_axum -c \
  "INSERT INTO posts (title, content) VALUES
     ('First post',  '# Hello\nThis is **Markdown**.'),
     ('Second post', '## Rust + Axum\n- fast\n- simple\n- fun');"
```

## Running Tests

Tests require a running PostgreSQL instance with the `hello_axum` database:

```bash
cargo test
```

The test suite seeds its own data, runs assertions, and cleans up after itself.

## CI

The project includes a GitHub Actions workflow (`.github/workflows/tests.yml`) that runs on every push to `main` and on pull requests:

1. **Lint** -- `cargo fmt --check` and `cargo clippy`
2. **Test** -- `cargo test` against a PostgreSQL 16 service container

## Translations

All admin panel UI strings live in `src/i18n.rs`. The default language is English. To add a new language, define a new `Translations` constant and pass it to the templates in the controller.

## Security Notes

- The admin panel is protected by HTTP Basic Authentication. Credentials are read from `ADMIN_USER` and `ADMIN_PASS` environment variables at startup.
- Markdown is rendered to HTML server-side and output with `|safe` in templates. For public user-submitted content, add HTML sanitization.
