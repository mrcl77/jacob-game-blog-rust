/// All UI-facing strings for the admin panel.
/// Kept in one place so translations are easy to swap.
pub struct Translations {
    // Navigation
    pub nav_posts: &'static str,

    // Posts list
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
    nav_posts: "Posts",

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
