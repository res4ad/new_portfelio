import { createServiceClient } from '@/lib/supabase';
import BlogAdmin from './BlogAdmin';

async function getPosts() {
  const db = createServiceClient();
  const { data } = await db.from('blog_posts').select('*').order('created_at', { ascending: false });
  return data || [];
}

export default async function AdminBlogPage() {
  const posts = await getPosts();
  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: 'white', fontWeight: 800, fontSize: '1.5rem', marginBottom: '0.25rem' }}>Blog Posts</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Manage writeups and blog posts.</p>
      </div>
      <BlogAdmin posts={posts} />
    </div>
  );
}
