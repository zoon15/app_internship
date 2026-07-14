-- Phase 1 starter schema for core entities

create table if not exists profiles (
  id uuid primary key,
  email text unique not null,
  role text not null default 'student',
  full_name text,
  created_at timestamp with time zone default now()
);

create table if not exists companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  verified boolean default false,
  created_at timestamp with time zone default now()
);

create table if not exists internships (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  company_id uuid references companies(id),
  location text,
  internship_type text,
  status text not null default 'draft',
  source_type text default 'manual',
  ai_suggested boolean default false,
  created_at timestamp with time zone default now()
);

create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null,
  internship_id uuid references internships(id),
  cv_url text,
  cover_letter_url text,
  status text not null default 'submitted',
  submitted_at timestamp with time zone default now()
);
