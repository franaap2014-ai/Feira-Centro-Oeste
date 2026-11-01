-- Aplicar ao projeto Supabase já criado na organização Free.
-- As 40 perguntas originais permanecem em questions.js; a tabela registra apenas as edições.
create table if not exists public.quiz_question_overrides (
 id text primary key check (id ~ '^[GCTVB][0-9]{2}$'),
 category text not null check (category in ('geografia','culinaria','costumes','vestimentas','brasilia')),
 text text not null check (length(trim(text)) between 8 and 400),
 options jsonb not null check (jsonb_typeof(options) = 'array' and jsonb_array_length(options) = 4),
 correct smallint not null check (correct between 0 and 3),
 fact text not null default '',
 image text,
 updated_at timestamptz not null default now()
);
alter table public.quiz_question_overrides enable row level security;
create policy "public reads question changes" on public.quiz_question_overrides
 for select to anon,authenticated using (true);
create policy "only admin can add question changes" on public.quiz_question_overrides
 for insert to authenticated with check ((select quiz_private.is_quiz_admin()));
create policy "only admin can edit question changes" on public.quiz_question_overrides
 for update to authenticated using ((select quiz_private.is_quiz_admin())) with check ((select quiz_private.is_quiz_admin()));
revoke all on table public.quiz_question_overrides from anon,authenticated;
grant select on table public.quiz_question_overrides to anon,authenticated;
grant insert,update on table public.quiz_question_overrides to authenticated;
-- Snapshot garante gabarito histórico após edições futuras.
alter table public.quiz_attempts add column if not exists question_snapshot jsonb;
create index if not exists quiz_attempts_history_desc on public.quiz_attempts (created_at desc);
