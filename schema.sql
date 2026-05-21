DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.analytics CASCADE;
DROP TABLE IF EXISTS public.subscribers CASCADE;
DROP TABLE IF EXISTS public.notification_logs CASCADE;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  phone text NOT NULL,
  city text NOT NULL,
  address text NOT NULL,
  product_id text NOT NULL,
  product_name text NOT NULL,
  price numeric(10, 2) NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  onesignal_user_id text,
  session_id text,
  image_url text,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  CONSTRAINT orders_status_check CHECK (status IN ('new','pending','confirmed','processing','shipped','delivered','cancelled'))
);

CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_name text NOT NULL,
  phone text,
  city text NOT NULL,
  rating integer NOT NULL,
  review_text text NOT NULL,
  is_published boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  CONSTRAINT reviews_rating_check CHECK (rating BETWEEN 1 AND 5),
  CONSTRAINT reviews_status_check CHECK (status IN ('pending','approved','rejected'))
);

CREATE TABLE public.analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id text NOT NULL UNIQUE,
  session_id text,
  ip_address text,
  city text,
  page_url text,
  activity_history jsonb NOT NULL DEFAULT '[]'::jsonb,
  form_draft jsonb DEFAULT '{}'::jsonb,
  onesignal_user_id text,
  time_spent_seconds integer NOT NULL DEFAULT 0,
  last_seen timestamptz NOT NULL DEFAULT timezone('utc', now()),
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  CONSTRAINT analytics_time_spent_seconds_check CHECK (time_spent_seconds >= 0)
);

CREATE TABLE public.subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  onesignal_player_id text NOT NULL UNIQUE,
  visitor_id text,
  city text,
  device_info jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE public.notification_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  message text NOT NULL,
  target_segment text,
  sent_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX orders_created_at_idx ON public.orders (created_at DESC);
CREATE INDEX orders_status_idx ON public.orders (status);
CREATE INDEX orders_session_id_idx ON public.orders (session_id);
CREATE INDEX orders_onesignal_user_id_idx ON public.orders (onesignal_user_id);
CREATE INDEX reviews_created_at_idx ON public.reviews (created_at DESC);
CREATE INDEX reviews_is_published_idx ON public.reviews (is_published);
CREATE INDEX reviews_status_idx ON public.reviews (status);
CREATE INDEX analytics_visitor_id_idx ON public.analytics (visitor_id);
CREATE INDEX analytics_last_seen_idx ON public.analytics (last_seen DESC);
CREATE INDEX subscribers_onesignal_player_id_idx ON public.subscribers (onesignal_player_id);
CREATE INDEX notification_logs_sent_at_idx ON public.notification_logs (sent_at DESC);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert orders" ON public.orders FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow public insert reviews" ON public.reviews FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow public insert analytics" ON public.analytics FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow public update analytics" ON public.analytics FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow public select own analytics for upsert" ON public.analytics FOR SELECT TO anon USING (true);
CREATE POLICY "Allow public insert subscribers" ON public.subscribers FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow public select published reviews" ON public.reviews FOR SELECT TO anon USING (is_published = true OR status = 'approved');

CREATE POLICY "Allow authenticated all orders" ON public.orders FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated all reviews" ON public.reviews FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated all analytics" ON public.analytics FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated all subscribers" ON public.subscribers FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated all notification logs" ON public.notification_logs FOR ALL TO authenticated USING (true) WITH CHECK (true);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reviews TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.analytics TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.subscribers TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notification_logs TO authenticated;
