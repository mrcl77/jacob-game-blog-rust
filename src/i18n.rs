/// All UI-facing strings.
/// Kept in one place so translations are easy to swap.
pub struct Translations {
    // Public site
    pub site_name: &'static str,
    pub site_tagline: &'static str,
    pub site_footer: &'static str,
    pub nav_posts: &'static str,
    pub back_all_posts: &'static str,
    pub no_posts: &'static str,

    // Posts list (admin)
    pub posts_title: &'static str,
    pub posts_new: &'static str,
    pub posts_col_title: &'static str,
    pub posts_col_actions: &'static str,
    pub posts_edit: &'static str,
    pub posts_delete: &'static str,
    pub posts_delete_confirm: &'static str,
    pub posts_empty: &'static str,

    // Post form
    pub form_title: &'static str,
    pub form_content: &'static str,
    pub form_preview: &'static str,
    pub form_preview_placeholder: &'static str,
    pub form_cancel: &'static str,
    pub form_save: &'static str,
    pub form_save_changes: &'static str,

    // Page titles
    pub page_new_post: &'static str,
    pub page_edit_post: &'static str,
}

pub const EN: Translations = Translations {
    site_name: "blog",
    site_tagline: "thoughts, code & other things",
    site_footer: "powered by axum + rust",
    nav_posts: "Posts",
    back_all_posts: "All posts",
    no_posts: "No posts yet.",

    posts_title: "Posts",
    posts_new: "New Post",
    posts_col_title: "Title",
    posts_col_actions: "Actions",
    posts_edit: "Edit",
    posts_delete: "Delete",
    posts_delete_confirm: "Delete this post?",
    posts_empty: "No posts yet",

    form_title: "Title",
    form_content: "Content (Markdown)",
    form_preview: "Preview",
    form_preview_placeholder: "Markdown preview will appear here...",
    form_cancel: "Cancel",
    form_save: "Save",
    form_save_changes: "Save Changes",

    page_new_post: "New Post",
    page_edit_post: "Edit Post",
};
