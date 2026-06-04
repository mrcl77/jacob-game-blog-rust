//! All UI-facing strings.
//!
//! Translations live in `locales/<lang>.yaml`. In release builds they are
//! loaded once and cached for the lifetime of the process. In debug builds
//! the YAML is re-read on every access, so edits show up without a restart.
//! Adding a new language is a matter of dropping in another YAML file and
//! wiring up a matching accessor below.

use serde::Deserialize;
use std::ops::Deref;

#[derive(Deserialize)]
pub struct Translations {
    // Public site chrome
    pub site_name: String,
    pub site_tagline: String,
    pub site_footer: String,
    pub nav_posts: String,
    pub back_all_posts: String,
    pub no_posts: String,

    // Home: hero
    pub home_hero_badge: String,
    pub home_hero_title: String,
    pub home_hero_title_accent: String,
    pub home_hero_cta_blog: String,
    pub home_hero_cta_progress: String,

    // Home: feature highlights
    pub home_feature1_title: String,
    pub home_feature1_body: String,
    pub home_feature2_title: String,
    pub home_feature2_body: String,
    pub home_feature3_title: String,
    pub home_feature3_body: String,

    // Home: recent devlog
    pub home_devlog_eyebrow: String,
    pub home_devlog_heading: String,
    pub home_devlog_see_all: String,
    pub home_featured_tag: String,
    pub home_featured_date: String,
    pub home_featured_author: String,
    pub home_featured_title: String,
    pub home_featured_excerpt: String,
    pub home_post2_date: String,
    pub home_post2_title: String,
    pub home_post3_date: String,
    pub home_post3_title: String,
    pub home_post4_date: String,
    pub home_post4_title: String,

    // Home: newsletter
    pub home_newsletter_heading: String,
    pub home_newsletter_body: String,
    pub home_newsletter_placeholder: String,
    pub home_newsletter_button: String,

    // Post page chrome
    pub post_toc_label: String,
    pub post_comments_heading: String,
    pub post_comments_action_secondary: String,
    pub post_comments_action_primary: String,
    pub post_comment_placeholder: String,
    pub post_comment_submit: String,

    // Posts index (public)
    pub posts_index_eyebrow: String,
    pub posts_index_heading: String,
    pub posts_index_read_more: String,
    pub posts_index_load_more: String,

    // Posts list (admin)
    pub posts_title: String,
    pub posts_new: String,
    pub posts_col_title: String,
    pub posts_col_actions: String,
    pub posts_edit: String,
    pub posts_delete: String,
    pub posts_delete_confirm: String,
    pub posts_empty: String,

    // Post form
    pub form_title: String,
    pub form_content: String,
    pub form_preview: String,
    pub form_preview_placeholder: String,
    pub form_cancel: String,
    pub form_save: String,
    pub form_save_changes: String,

    // Page titles
    pub page_new_post: String,
    pub page_edit_post: String,
}

impl Translations {
    fn load(path: &str) -> Translations {
        let raw = std::fs::read_to_string(path)
            .unwrap_or_else(|e| panic!("failed to read translations file `{path}`: {e}"));
        serde_norway::from_str(&raw)
            .unwrap_or_else(|e| panic!("failed to parse translations file `{path}`: {e}"))
    }
}

/// A handle to a set of translations, dereferencing to [`Translations`].
///
/// It wraps either the process-wide cached copy (release) or a freshly read
/// one (debug), so call sites can borrow it uniformly with `&*i18n::en()`.
pub enum Localized {
    Static(&'static Translations),
    #[allow(dead_code)] // only constructed in debug builds
    Owned(Box<Translations>),
}

impl Deref for Localized {
    type Target = Translations;

    fn deref(&self) -> &Translations {
        match self {
            Localized::Static(t) => t,
            Localized::Owned(t) => t,
        }
    }
}

/// Returns the English translations.
///
/// In release builds this is loaded once and cached for the lifetime of the
/// process. In debug builds the YAML file is re-read on every call, so edits
/// show up without a restart.
#[cfg(not(debug_assertions))]
pub fn en() -> Localized {
    use std::sync::LazyLock;
    static EN: LazyLock<Translations> = LazyLock::new(|| Translations::load("locales/en.yaml"));
    Localized::Static(&EN)
}

#[cfg(debug_assertions)]
pub fn en() -> Localized {
    Localized::Owned(Box::new(Translations::load("locales/en.yaml")))
}
