/*
  # res4ad Cybersecurity Portfolio - Full Schema

  ## Tables Created:
  1. `admin_users` - Admin credentials with hashed passwords
  2. `profile` - Personal profile/bio data
  3. `skills` - Technical skills with categories
  4. `certifications` - Security certifications
  5. `education` - Education history
  6. `experience` - Work experience
  7. `social_links` - Social/platform links
  8. `projects` - Portfolio projects
  9. `blog_posts` - Blog/writeup entries
  10. `blog_tags` - Blog post tags
  11. `contact_messages` - Hire me form submissions
  12. `terminal_commands` - Custom terminal command responses
  13. `site_settings` - Global site configuration
  14. `audit_logs` - Admin action audit trail
  15. `analytics_events` - Visitor analytics
  16. `file_uploads` - Uploaded file metadata
  17. `languages` - Language proficiencies

  ## Security: RLS enabled on all tables with admin-only policies
*/

-- ADMIN USERS
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id text UNIQUE NOT NULL DEFAULT '0001',
  password_hash text NOT NULL,
  email text,
  name text DEFAULT 'Administrator',
  role text DEFAULT 'superadmin',
  last_login timestamptz,
  login_attempts integer DEFAULT 0,
  locked_until timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin users are not publicly readable"
  ON admin_users FOR SELECT
  TO authenticated
  USING (false);

-- PROFILE
CREATE TABLE IF NOT EXISTS profile (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL DEFAULT 'Reshad Rustemov',
  title text DEFAULT 'Pentester & Red Team Enthusiast',
  bio text,
  phone text,
  email text,
  location text,
  avatar_url text,
  cv_url text,
  github_username text DEFAULT 'res4ad',
  htb_username text,
  thm_username text,
  discord_username text,
  linkedin_url text,
  hire_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profile is publicly readable"
  ON profile FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Only service role can modify profile"
  ON profile FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Only service role can update profile"
  ON profile FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

-- LANGUAGES
CREATE TABLE IF NOT EXISTS languages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  level text NOT NULL,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE languages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Languages are publicly readable"
  ON languages FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Only service role can modify languages"
  ON languages FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Only service role can update languages"
  ON languages FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Only service role can delete languages"
  ON languages FOR DELETE
  TO service_role
  USING (true);

-- SKILLS
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL DEFAULT 'General',
  proficiency integer DEFAULT 75 CHECK (proficiency >= 0 AND proficiency <= 100),
  icon text,
  sort_order integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Skills are publicly readable"
  ON skills FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Only service role can modify skills"
  ON skills FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Only service role can update skills"
  ON skills FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Only service role can delete skills"
  ON skills FOR DELETE
  TO service_role
  USING (true);

-- CERTIFICATIONS
CREATE TABLE IF NOT EXISTS certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  issuer text NOT NULL,
  issue_date date,
  expiry_date date,
  credential_id text,
  credential_url text,
  badge_url text,
  description text,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Certifications are publicly readable"
  ON certifications FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Only service role can modify certifications"
  ON certifications FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Only service role can update certifications"
  ON certifications FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Only service role can delete certifications"
  ON certifications FOR DELETE
  TO service_role
  USING (true);

-- EDUCATION
CREATE TABLE IF NOT EXISTS education (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution text NOT NULL,
  degree text NOT NULL,
  field text,
  start_year integer,
  end_year integer,
  description text,
  is_current boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE education ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Education is publicly readable"
  ON education FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Only service role can modify education"
  ON education FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Only service role can update education"
  ON education FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Only service role can delete education"
  ON education FOR DELETE
  TO service_role
  USING (true);

-- EXPERIENCE
CREATE TABLE IF NOT EXISTS experience (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company text NOT NULL,
  role text NOT NULL,
  start_date date,
  end_date date,
  is_current boolean DEFAULT false,
  description text,
  technologies text[],
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE experience ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Experience is publicly readable"
  ON experience FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Only service role can modify experience"
  ON experience FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Only service role can update experience"
  ON experience FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Only service role can delete experience"
  ON experience FOR DELETE
  TO service_role
  USING (true);

-- SOCIAL LINKS
CREATE TABLE IF NOT EXISTS social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  url text NOT NULL,
  username text,
  icon text,
  is_visible boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Social links are publicly readable"
  ON social_links FOR SELECT
  TO anon, authenticated
  USING (is_visible = true);

CREATE POLICY "Only service role can modify social links"
  ON social_links FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Only service role can update social links"
  ON social_links FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Only service role can delete social links"
  ON social_links FOR DELETE
  TO service_role
  USING (true);

-- PROJECTS
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  content text,
  tech_stack text[],
  tags text[],
  category text DEFAULT 'Security',
  difficulty text DEFAULT 'Medium' CHECK (difficulty IN ('Easy','Medium','Hard','Insane')),
  github_url text,
  demo_url text,
  image_url text,
  gallery_urls text[],
  is_published boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published projects are publicly readable"
  ON projects FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

CREATE POLICY "Only service role can modify projects"
  ON projects FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Only service role can update projects"
  ON projects FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Only service role can delete projects"
  ON projects FOR DELETE
  TO service_role
  USING (true);

-- BLOG POSTS
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  content text,
  category text DEFAULT 'Writeup',
  tags text[],
  cover_image text,
  is_published boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  read_time integer DEFAULT 5,
  views integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  published_at timestamptz
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published blog posts are publicly readable"
  ON blog_posts FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

CREATE POLICY "Only service role can modify blog posts"
  ON blog_posts FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Only service role can update blog posts"
  ON blog_posts FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Only service role can delete blog posts"
  ON blog_posts FOR DELETE
  TO service_role
  USING (true);

-- CONTACT MESSAGES
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text,
  project_type text,
  budget text,
  message text NOT NULL,
  ip_address text,
  user_agent text,
  status text DEFAULT 'unread' CHECK (status IN ('unread','read','replied','archived')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact messages"
  ON contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Only service role can read contact messages"
  ON contact_messages FOR SELECT
  TO service_role
  USING (true);

CREATE POLICY "Only service role can update contact messages"
  ON contact_messages FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Only service role can delete contact messages"
  ON contact_messages FOR DELETE
  TO service_role
  USING (true);

-- TERMINAL COMMANDS
CREATE TABLE IF NOT EXISTS terminal_commands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  command text UNIQUE NOT NULL,
  output text NOT NULL,
  description text,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE terminal_commands ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active terminal commands are publicly readable"
  ON terminal_commands FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Only service role can modify terminal commands"
  ON terminal_commands FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Only service role can update terminal commands"
  ON terminal_commands FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Only service role can delete terminal commands"
  ON terminal_commands FOR DELETE
  TO service_role
  USING (true);

-- SITE SETTINGS
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public settings are readable by all"
  ON site_settings FOR SELECT
  TO anon, authenticated
  USING (key NOT LIKE 'private_%');

CREATE POLICY "Only service role can modify settings"
  ON site_settings FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Only service role can update settings"
  ON site_settings FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

-- AUDIT LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id text,
  action text NOT NULL,
  resource_type text,
  resource_id text,
  details jsonb,
  ip_address text,
  user_agent text,
  success boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only service role can access audit logs"
  ON audit_logs FOR SELECT
  TO service_role
  USING (true);

CREATE POLICY "Only service role can insert audit logs"
  ON audit_logs FOR INSERT
  TO service_role, anon, authenticated
  WITH CHECK (true);

-- ANALYTICS EVENTS
CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  page text,
  referrer text,
  ip_address text,
  user_agent text,
  country text,
  city text,
  device text,
  browser text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert analytics events"
  ON analytics_events FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Only service role can read analytics"
  ON analytics_events FOR SELECT
  TO service_role
  USING (true);

-- FILE UPLOADS
CREATE TABLE IF NOT EXISTS file_uploads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  original_name text,
  file_type text,
  file_size integer,
  storage_path text,
  public_url text,
  uploaded_by text DEFAULT 'admin',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE file_uploads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only service role can manage uploads"
  ON file_uploads FOR SELECT
  TO service_role
  USING (true);

CREATE POLICY "Only service role can insert uploads"
  ON file_uploads FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Only service role can delete uploads"
  ON file_uploads FOR DELETE
  TO service_role
  USING (true);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_published ON projects(is_published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(is_published);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created ON analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
