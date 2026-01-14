# Database Schema for Zootopia Survey App

## Tables

### 1. surveys
Stores survey responses from users.

```sql
CREATE TABLE surveys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Survey Responses
  tasks TEXT[] DEFAULT '{}',           -- Selected tasks: ['手工处理数据', '重复运维']
  feedback TEXT,                       -- Detailed feedback
  ai_tasks TEXT[] DEFAULT '{}',        -- AI tasks: ['撰写报告', '总结会议']
  ai_help TEXT,                        -- AI help details
  mood TEXT DEFAULT '',                -- Mood: '糟透了', '不太好', etc.

  -- Metadata
  user_ip TEXT,                        -- Optional: user IP for basic tracking
  user_agent TEXT,                     -- Optional: browser info
);

-- Indexes for better query performance
CREATE INDEX idx_surveys_created_at ON surveys(created_at DESC);
CREATE INDEX idx_surveys_mood ON surveys(mood);

-- Enable Row Level Security
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read (for statistics)
CREATE POLICY "Allow public read access" ON surveys
  FOR SELECT USING (true);

-- Allow anyone to insert (for survey submissions)
CREATE POLICY "Allow public insert access" ON surveys
  FOR INSERT WITH CHECK (true);
```

### 2. venting_posts
Stores venting wall posts.

```sql
CREATE TABLE venting_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Post Content
  emoji TEXT DEFAULT '',               -- Emoji: '😤', '😑', '🤩', etc.
  content TEXT NOT NULL,               -- Post content
  likes_count INTEGER DEFAULT 0,       -- Total likes count

  -- Ranking (calculated)
  rank INTEGER,                        -- Optional: rank for display

  -- Metadata
  rotation INTEGER DEFAULT 0,          -- Visual rotation effect
  user_ip TEXT,                        -- Optional: user IP
  user_agent TEXT,                     -- Optional: browser info
);

-- Indexes
CREATE INDEX idx_venting_posts_created_at ON venting_posts(created_at DESC);
CREATE INDEX idx_venting_posts_likes ON venting_posts(likes_count DESC);
CREATE INDEX idx_venting_posts_emoji ON venting_posts(emoji);

-- Enable Row Level Security
ALTER TABLE venting_posts ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read posts
CREATE POLICY "Allow public read access" ON venting_posts
  FOR SELECT USING (true);

-- Allow anyone to insert posts
CREATE POLICY "Allow public insert access" ON venting_posts
  FOR INSERT WITH CHECK (true);

-- Allow anyone to update posts (for likes)
CREATE POLICY "Allow public update access" ON venting_posts
  FOR UPDATE USING (true);
```

### 3. venting_likes
Stores likes for venting posts (prevents duplicate likes).

```sql
CREATE TABLE venting_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Relations
  post_id UUID NOT NULL REFERENCES venting_posts(id) ON DELETE CASCADE,
  user_ip TEXT NOT NULL,               -- User IP for basic deduplication

  -- Unique constraint: one like per post per IP
  UNIQUE(post_id, user_ip)
);

-- Indexes
CREATE INDEX idx_venting_likes_post_id ON venting_likes(post_id);
CREATE INDEX idx_venting_likes_user_ip ON venting_likes(user_ip);

-- Enable Row Level Security
ALTER TABLE venting_likes ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read likes
CREATE POLICY "Allow public read access" ON venting_likes
  FOR SELECT USING (true);

-- Allow anyone to insert likes
CREATE POLICY "Allow public insert access" ON venting_likes
  FOR INSERT WITH CHECK (true);

-- Allow anyone to delete their own likes
CREATE POLICY "Allow public delete access" ON venting_likes
  FOR DELETE USING (true);
```

## Functions

### Function to update post likes count

```sql
CREATE OR REPLACE FUNCTION update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE venting_posts
    SET likes_count = likes_count + 1
    WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE venting_posts
    SET likes_count = GREATEST(likes_count - 1, 0)
    WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update likes count
CREATE TRIGGER trigger_update_post_likes
  AFTER INSERT OR DELETE ON venting_likes
  FOR EACH ROW
  EXECUTE FUNCTION update_post_likes_count();
```

## Setup Instructions

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the SQL commands above in order:
   - Create `surveys` table
   - Create `venting_posts` table
   - Create `venting_likes` table
   - Create the `update_post_likes_count()` function
4. Update your `.env` file with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```
