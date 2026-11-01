-- Feira Cultural CSA 2026 — execute somente em um projeto Supabase dedicado.
-- 1. Crie duas contas em Authentication > Users (uma ADM e uma Operador).
-- 2. Depois de aplicar este SQL, atribua papéis pelo SQL Editor, usando os e-mails dos usuários.
-- 3. Não coloque endereços de e-mail nem senhas no código público.

create table if not exists public.quiz_roles (
 user_id uuid primary key references auth.users(id) on delete cascade,
 role text not null check (role in ('admin','operator')),
 created_at timestamptz not null default now()
);
create table if not exists public.quiz_attempts (
 id uuid primary key default gen_random_uuid(),
 created_at timestamptz not null default now(),
 score smallint not null check (score between 0 and 5),
 question_ids jsonb not null check (jsonb_typeof(question_ids) = 'array' and jsonb_array_length(question_ids) = 5),
 answers jsonb not null check (jsonb_typeof(answers) = 'array' and jsonb_array_length(answers) = 5),
 mode text not null check (mode in ('fair','test')),
 created_by uuid null references auth.users(id) on delete set null
);
create index if not exists quiz_attempts_mode_date_idx on public.quiz_attempts (mode,created_at desc);
alter table public.quiz_roles enable row level security;
alter table public.quiz_attempts enable row level security;

-- Roles can be viewed only by the corresponding logged-in user.
create policy "read own quiz role" on public.quiz_roles for select to authenticated
 using (user_id = (select auth.uid()));

-- Role lookup is server-side; non-admin users cannot promote themselves.
create schema if not exists quiz_private;
create or replace function quiz_private.is_quiz_admin()
returns boolean language sql stable security definer set search_path = ''
as $$ select exists (select 1 from public.quiz_roles r where r.user_id = (select auth.uid()) and r.role = 'admin') $$;
revoke all on function quiz_private.is_quiz_admin() from public,anon;
grant usage on schema quiz_private to authenticated;
grant execute on function quiz_private.is_quiz_admin() to authenticated;

-- Only an ADM can read results; kiosk visitors can ONLY submit a result.
create policy "admin reads quiz results" on public.quiz_attempts for select to authenticated
 using ((select quiz_private.is_quiz_admin()));

-- Public visitor games may only record fair results with no identity.
create policy "visitor creates fair result" on public.quiz_attempts for insert to anon
 with check (mode = 'fair' and created_by is null);
-- Authenticated admin can create test or fair results; operator only fair results.
create policy "authorized user creates result" on public.quiz_attempts for insert to authenticated
 with check (created_by = (select auth.uid()) and
    (mode = 'fair' or (mode = 'test' and (select quiz_private.is_quiz_admin()))));

revoke all on table public.quiz_roles from anon,authenticated;
revoke all on table public.quiz_attempts from anon,authenticated;
grant select on public.quiz_roles to authenticated;
grant insert on public.quiz_attempts to anon,authenticated;
grant select on public.quiz_attempts to authenticated;

-- PROMOTE ACCOUNTS ONLY THROUGH SUPABASE SQL EDITOR, NEVER IN CLIENT CODE:
-- insert into public.quiz_roles(user_id,role)
-- select id,'admin' from auth.users where email = 'SUBSTITUA_PELO_EMAIL_ADM'
-- on conflict (user_id) do update set role = excluded.role;
-- insert into public.quiz_roles(user_id,role)
-- select id,'operator' from auth.users where email = 'SUBSTITUA_PELO_EMAIL_DA_FEIRA'
-- on conflict (user_id) do update set role = excluded.role;
