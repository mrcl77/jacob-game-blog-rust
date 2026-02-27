use pulldown_cmark::{Options, Parser, html};
use tokio_postgres::Client;

#[derive(Debug)]
pub struct Post {
    pub id: i32,
    pub title: String,
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
                let markdown_content: String = row.get("content");
                Self {
                    id: row.get("id"),
                    title: row.get("title"),
                    content_html: markdown_to_html(&markdown_content),
                }
            })
            .collect();

        Ok(posts)
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
