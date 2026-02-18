-- AI Chatbot Configuration (one per client)
create table if not exists ai_chatbot_config (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid references clientes(id) on delete cascade not null,
  nombre_bot text default 'Asistente de Viajes',
  personalidad text default 'cercano',
  info_agencia text,
  faqs jsonb default '[]'::jsonb,
  idiomas jsonb default '["es"]'::jsonb,
  activo boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint ai_chatbot_config_cliente_id_key unique (cliente_id)
);

alter table ai_chatbot_config enable row level security;

create policy "Service role full access on ai_chatbot_config"
  on ai_chatbot_config for all
  using (true)
  with check (true);

-- AI Generated Itineraries
create table if not exists ai_itinerarios (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid references clientes(id) on delete cascade not null,
  pais text not null,
  duracion integer,
  estilo text,
  intereses jsonb,
  presupuesto text,
  tipo_grupo text,
  num_viajeros integer,
  itinerario jsonb not null,
  precio_estimado text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table ai_itinerarios enable row level security;

create policy "Service role full access on ai_itinerarios"
  on ai_itinerarios for all
  using (true)
  with check (true);

-- Updated at triggers
create trigger update_ai_chatbot_config_updated_at
  before update on ai_chatbot_config
  for each row execute function update_updated_at_column();

create trigger update_ai_itinerarios_updated_at
  before update on ai_itinerarios
  for each row execute function update_updated_at_column();
