-- Enable required extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

--------------------------------------------------
-- USERS TABLE
--------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  fullName TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'user')) DEFAULT 'user',
  isActive BOOLEAN NOT NULL DEFAULT true,
  canWriteTestimonial BOOLEAN NOT NULL DEFAULT false,
  createdAt TIMESTAMPTZ NOT NULL DEFAULT now(),
  updatedAt TIMESTAMPTZ NOT NULL DEFAULT now()
);

--------------------------------------------------
-- TESTIMONIALS TABLE
--------------------------------------------------
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  location TEXT NOT NULL,
  trip TEXT NOT NULL,
  quote TEXT NOT NULL,
  highlight TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  isPublished BOOLEAN NOT NULL DEFAULT false,
  createdAt TIMESTAMPTZ NOT NULL DEFAULT now(),
  updatedAt TIMESTAMPTZ NOT NULL DEFAULT now()
);

--------------------------------------------------
-- INDEXES
--------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_testimonials_userId ON testimonials(userId);
CREATE INDEX IF NOT EXISTS idx_testimonials_isPublished ON testimonials(isPublished);

--------------------------------------------------
-- ENABLE ROW LEVEL SECURITY
--------------------------------------------------
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

--------------------------------------------------
-- USERS POLICIES
--------------------------------------------------

-- User can view own profile
CREATE POLICY "User can view own profile"
ON users
FOR SELECT
USING (auth.uid() = id);

-- Admin can view all users
CREATE POLICY "Admin can view all users"
ON users
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
      AND role = 'admin'
  )
);

-- User can update only their own profile
CREATE POLICY "User can update own profile"
ON users
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Admin can update any user
CREATE POLICY "Admin can update users"
ON users
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
      AND role = 'admin'
  )
);

-- Admin can delete users
CREATE POLICY "Admin can delete users"
ON users
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
      AND role = 'admin'
  )
);

--------------------------------------------------
-- TESTIMONIALS POLICIES
--------------------------------------------------

-- Anyone can view published testimonials
CREATE POLICY "View published testimonials"
ON testimonials
FOR SELECT
USING (isPublished = true);

-- User can view own testimonials
CREATE POLICY "User can view own testimonials"
ON testimonials
FOR SELECT
USING (userId = auth.uid());

-- Admin can view all testimonials
CREATE POLICY "Admin can view all testimonials"
ON testimonials
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
      AND role = 'admin'
  )
);

-- User can insert testimonial only if allowed
CREATE POLICY "User can insert testimonial"
ON testimonials
FOR INSERT
WITH CHECK (
  userId = auth.uid()
  AND EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
      AND canWriteTestimonial = true
      AND isActive = true
  )
);

-- User can update own testimonial
CREATE POLICY "User can update own testimonial"
ON testimonials
FOR UPDATE
USING (userId = auth.uid())
WITH CHECK (userId = auth.uid());

-- Admin can update any testimonial
CREATE POLICY "Admin can update testimonials"
ON testimonials
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
      AND role = 'admin'
  )
);

-- Admin can delete testimonials
CREATE POLICY "Admin can delete testimonials"
ON testimonials
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
      AND role = 'admin'
  )
);

--------------------------------------------------
-- UPDATED_AT TRIGGERS
--------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updatedAt = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER testimonials_updated_at
BEFORE UPDATE ON testimonials
FOR EACH ROW EXECUTE FUNCTION update_updated_at();
