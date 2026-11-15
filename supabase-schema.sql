-- ====================================================================
-- SUPABASE DATABASE SCHEMA FOR WEDDING INVITATION WEBSITE
-- ====================================================================
-- Run this script in your Supabase SQL Editor (Dashboard -> SQL Editor)

-- 1. Create RSVPs Table
CREATE TABLE IF NOT EXISTS public.rsvps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    attendance TEXT NOT NULL CHECK (attendance IN ('attending', 'declined')),
    guests_count INTEGER DEFAULT 1 CHECK (guests_count >= 1 AND guests_count <= 10),
    dietary_preference TEXT DEFAULT 'none',
    message TEXT,
    ip_hash TEXT -- Optional client hash to prevent spamming
);

-- 2. Create Wishes / Guestbook Table
CREATE TABLE IF NOT EXISTS public.wishes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    guest_name TEXT NOT NULL,
    attendance TEXT DEFAULT 'attending',
    message TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT true
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishes ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for RSVPs
-- Allow anyone with the anon key to submit an RSVP
CREATE POLICY "Allow public RSVP submission"
    ON public.rsvps
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Allow reading RSVPs only for authenticated users (the couple / admin)
CREATE POLICY "Allow authenticated read on RSVPs"
    ON public.rsvps
    FOR SELECT
    TO authenticated
    USING (true);

-- 5. RLS Policies for Wishes / Guestbook
-- Allow anyone to post a wedding wish
CREATE POLICY "Allow public wish submission"
    ON public.wishes
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Allow anyone to view approved wishes on the live guestbook wall
CREATE POLICY "Allow public read on approved wishes"
    ON public.wishes
    FOR SELECT
    TO anon, authenticated
    USING (is_approved = true);

-- 6. Indexes for Fast Queries
CREATE INDEX IF NOT EXISTS idx_rsvps_created_at ON public.rsvps(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wishes_created_at ON public.wishes(created_at DESC);

-- 7. Sample Initial Wishes for the Guestbook Wall
INSERT INTO public.wishes (guest_name, attendance, message, is_approved)
VALUES 
    ('Jonathan & Claire Sterling', 'attending', 'Wishing you both a lifetime of unmeasurable happiness, boundless love, and wonderful adventures together! Can not wait to celebrate with you!', true),
    ('Dr. Marcus Aurelius & Family', 'attending', 'Heartfelt congratulations to Alexander & Sophia. May your union be blessed with deep affection and everlasting peace.', true),
    ('Audrey Dupont', 'attending', 'To the most radiant couple! So thrilled to witness your fairytale wedding in Beverly Hills! Sending all our love.', true),
    ('David & Evelyn Thorne', 'declined', 'Sending you our warmest congratulations and best wishes from London! We will be celebrating you both in spirit.', true)
ON CONFLICT DO NOTHING;
