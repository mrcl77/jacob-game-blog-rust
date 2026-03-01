use pulldown_cmark::{Options, Parser, html};
use tokio_postgres::Client;

#[derive(Debug)]
pub struct Post {
    pub id: i32,
    pub title: String,
    pub content: String,
    pub content_html: String,
}

impl Post {
    pub async fn all(db: &Client) -> Result<Vec<Self>, tokio_postgres::Error> {
        let rows = db
            .query(
                "SELECT id, title, content FROM posts ORDER BY id DESC LIMIT 20",
                &[],
            )
            .await?;

        let posts = rows
            .into_iter()
            .map(|row| {
                let content: String = row.get("content");
                Self {
                    id: row.get("id"),
                    title: row.get("title"),
                    content_html: markdown_to_html(&content),
                    content,
                }
            })
            .collect();

        Ok(posts)
    }

    pub async fn find(db: &Client, id: i32) -> Result<Option<Self>, tokio_postgres::Error> {
        let rows = db
            .query("SELECT id, title, content FROM posts WHERE id = $1", &[&id])
            .await?;

        Ok(rows.into_iter().next().map(|row| {
            let content: String = row.get("content");
            Self {
                id: row.get("id"),
                title: row.get("title"),
                content_html: markdown_to_html(&content),
                content,
            }
        }))
    }

    pub async fn create(
        db: &Client,
        title: &str,
        content: &str,
    ) -> Result<(), tokio_postgres::Error> {
        db.execute(
            "INSERT INTO posts (title, content) VALUES ($1, $2)",
            &[&title, &content],
        )
        .await?;
        Ok(())
    }

    pub async fn update(
        db: &Client,
        id: i32,
        title: &str,
        content: &str,
    ) -> Result<(), tokio_postgres::Error> {
        db.execute(
            "UPDATE posts SET title = $1, content = $2 WHERE id = $3",
            &[&title, &content, &id],
        )
        .await?;
        Ok(())
    }

    pub async fn delete(db: &Client, id: i32) -> Result<(), tokio_postgres::Error> {
        db.execute("DELETE FROM posts WHERE id = $1", &[&id])
            .await?;
        Ok(())
    }
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
