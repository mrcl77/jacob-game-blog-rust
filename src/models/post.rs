use pulldown_cmark::{Options, Parser, html};
use tokio_postgres::Client;

#[derive(Debug)]
pub struct Post {
    pub id: i32,
    pub title: String,
    pub content: String,
    pub content_html: String,
    pub preview: String,
    pub date: String,
}

impl Post {
    pub async fn all(db: &Client) -> Result<Vec<Self>, tokio_postgres::Error> {
        let rows = db
            .query(
                "SELECT id, title, content, to_char(created_at, 'MON DD, YYYY') AS date \
                 FROM posts ORDER BY created_at DESC, id DESC LIMIT 20",
                &[],
            )
            .await?;

        let posts = rows.into_iter().map(Self::from_row).collect();

        Ok(posts)
    }

    pub async fn find(db: &Client, id: i32) -> Result<Option<Self>, tokio_postgres::Error> {
        let rows = db
            .query(
                "SELECT id, title, content, to_char(created_at, 'MON DD, YYYY') AS date \
                 FROM posts WHERE id = $1",
                &[&id],
            )
            .await?;

        Ok(rows.into_iter().next().map(Self::from_row))
    }

    fn from_row(row: tokio_postgres::Row) -> Self {
        let content: String = row.get("content");
        Self {
            id: row.get("id"),
            title: row.get("title"),
            content_html: markdown_to_html(&content),
            preview: markdown_to_plain_preview(&content, 3),
            date: row.get("date"),
            content,
        }
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

fn markdown_options() -> Options {
    Options::ENABLE_STRIKETHROUGH
        | Options::ENABLE_TABLES
        | Options::ENABLE_TASKLISTS
        | Options::ENABLE_HEADING_ATTRIBUTES
        | Options::ENABLE_FOOTNOTES
}

fn markdown_to_html(markdown: &str) -> String {
    let parser = Parser::new_ext(markdown, markdown_options());
    let mut html_output = String::new();
    html::push_html(&mut html_output, parser);
    html_output
}

fn markdown_to_plain_preview(markdown: &str, max_sentences: usize) -> String {
    use pulldown_cmark::{Event, Tag, TagEnd};

    let parser = Parser::new_ext(markdown, markdown_options());

    let mut plain = String::new();
    let mut skip_depth: usize = 0;
    for event in parser {
        match event {
            Event::Start(Tag::Image { .. }) => skip_depth += 1,
            Event::End(TagEnd::Image) => skip_depth -= 1,
            _ if skip_depth > 0 => continue,
            Event::Text(text) | Event::Code(text) => plain.push_str(&text),
            Event::SoftBreak | Event::HardBreak => plain.push(' '),
            Event::Start(Tag::Paragraph) if !plain.is_empty() => plain.push(' '),
            Event::End(TagEnd::Paragraph) => plain.push(' '),
            _ => {}
        }
    }

    // Collapse multiple spaces
    let mut collapsed = String::with_capacity(plain.len());
    let mut prev_space = false;
    for ch in plain.chars() {
        if ch.is_whitespace() {
            if !prev_space {
                collapsed.push(' ');
            }
            prev_space = true;
        } else {
            collapsed.push(ch);
            prev_space = false;
        }
    }
    let plain = collapsed;

    // Take the first N sentences (split on '. ', '! ', '? ')
    let mut count = 0;
    let mut end = plain.len();
    let chars: Vec<char> = plain.chars().collect();
    for (i, ch) in chars.iter().enumerate() {
        if (*ch == '.' || *ch == '!' || *ch == '?')
            && chars.get(i + 1).is_none_or(|c| c.is_whitespace())
        {
            count += 1;
            if count >= max_sentences {
                end = chars[..=i].iter().collect::<String>().len();
                break;
            }
        }
    }

    plain[..end].trim().to_string()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn preview_strips_markdown() {
        let md = "# Header\n\n**Bold text** and *italic*. [A link](http://example.com). ![image](img.png)\n\n`code` and ~~strikethrough~~.";
        let preview = markdown_to_plain_preview(md, 3);
        assert_eq!(
            preview,
            "Header Bold text and italic. A link. code and strikethrough."
        );
    }
}
