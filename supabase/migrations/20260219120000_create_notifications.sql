-- Notifications for agency clients (admin panel)
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid references clientes(id) on delete cascade not null,
  type text not null,
  title text not null,
  description text,
  href text,
  read boolean default false,
  created_at timestamptz default now()
);

alter table notifications enable row level security;

create policy "Service role full access on notifications"
  on notifications for all
  using (true)
  with check (true);

create index idx_notifications_unread
  on notifications (cliente_id, read, created_at desc);

-- Notifications for platform owner (owner panel)
create table if not exists owner_notifications (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  title text not null,
  description text,
  href text,
  read boolean default false,
  created_at timestamptz default now()
);

alter table owner_notifications enable row level security;

create policy "Service role full access on owner_notifications"
  on owner_notifications for all
  using (true)
  with check (true);

create index idx_owner_notifications_unread
  on owner_notifications (read, created_at desc);
