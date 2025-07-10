create table public.skills (
  id uuid not null default gen_random_uuid (),
  "createdAt" timestamp with time zone not null default now(),
  skill text not null,
  constraint skills_pkey primary key (id)
) TABLESPACE pg_default;

create table public.user_matches (
  "userAId" text not null,
  "userBId" text not null,
  "matchScore" double precision null default '0'::double precision,
  "createdAt" timestamp with time zone null,
  "personalisedContent" jsonb null,
  constraint user_matches_pkey primary key ("userAId", "userBId"),
  constraint user_matches_userBId_fkey foreign KEY ("userBId") references users (id)
) TABLESPACE pg_default;

create table public.user_skills (
  id uuid not null default gen_random_uuid (),
  "createdAt" timestamp with time zone not null default now(),
  "userId" text not null,
  "skillId" uuid null,
  type text null,
  constraint user_skills_pkey primary key (id),
  constraint user_skills_skillId_fkey foreign KEY ("skillId") references skills (id),
  constraint user_skills_userId_fkey foreign KEY ("userId") references users (id)
) TABLESPACE pg_default;

create table public.users (
  id text not null,
  "createdAt" timestamp with time zone null default now(),
  name text not null default ''::text,
  bio text not null default ''::text,
  "timeCredits" numeric not null default '0'::numeric,
  constraint users_pkey primary key (id)
) TABLESPACE pg_default;