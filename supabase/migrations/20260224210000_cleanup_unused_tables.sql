-- Cleanup: Remove unused tables from old landing page
-- newsletter_subscribers: Was used by old landing page newsletter form.
-- Now replaced by contact_messages table (ContactForm section).
-- blog_posts: Never had a migration, CRUD, or API routes. Orphaned table.

-- Drop newsletter_subscribers
DROP TABLE IF EXISTS newsletter_subscribers CASCADE;

-- Drop blog_posts
DROP TABLE IF EXISTS blog_posts CASCADE;
