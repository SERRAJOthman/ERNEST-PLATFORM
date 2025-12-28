-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- 1. Profiles (Users with Roles)
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text not null,
  full_name text,
  role text check (role in ('admin', 'office_manager', 'field_technician', 'client')) default 'field_technician',
  created_at timestamptz default now()
);

-- 2. Projects (The high-level container)
create table public.projects (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  status text check (status in ('draft', 'active', 'completed', 'archived')) default 'draft',
  client_id uuid references public.profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Chrono-Threads (The atomic unit of history)
-- A Chrono-Thread represents a single tracked entity's timeline.
create table public.chrono_threads (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) not null,
  entity_type text not null, -- e.g., 'task', 'asset', 'material', 'document'
  entity_id uuid, -- Link to the specific entity table if needed, or keeping it loose for flexibility
  title text not null,
  current_state jsonb, -- Snapshot of the current state (Procedural + Commercial)
  created_at timestamptz default now()
);

-- 4. Chrono-Events (The discrete nodes on the thread)
create table public.chrono_events (
  id uuid default uuid_generate_v4() primary key,
  thread_id uuid references public.chrono_threads(id) not null,
  event_type text not null, -- 'creation', 'status_change', 'photo_upload', 'comment'
  payload jsonb not null, -- The actual data (url, text, new_status)
  actor_id uuid references public.profiles(id),
  created_at timestamptz default now()
);

-- RLS Policies (Basic Draft)
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.chrono_threads enable row level security;
alter table public.chrono_events enable row level security;

-- 5. Sites (Geographical Locations)
create table public.sites (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  address text,
  city text,
  latitude double precision,
  longitude double precision,
  status text check (status in ('active', 'on_hold', 'completed')) default 'active',
  manager_id uuid references public.profiles(id),
  created_at timestamptz default now()
);

-- 6. Financials (Budget & Spending)
create table public.financials (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) not null,
  total_budget numeric(15, 2) default 0,
  spent_ytd numeric(15, 2) default 0,
  variance numeric(15, 2) default 0,
  status text check (status in ('on_track', 'over_budget', 'under_budget')) default 'on_track',
  last_updated timestamptz default now()
);

-- Link Projects to Sites
alter table public.projects add column site_id uuid references public.sites(id);

-- Updated RLS Policies
alter table public.sites enable row level security;
alter table public.financials enable row level security;

create policy "Sites are viewable by everyone" on public.sites for select using (true);
create policy "Financials viewable by managers" on public.financials for select using (true);
