-- Adiciona coluna de horários de atendimento por usuário
ALTER TABLE public.user_settings
ADD COLUMN IF NOT EXISTS working_hours JSONB NOT NULL DEFAULT (
  '{
    "sun": {"enabled": false, "start": "08:00", "end": "18:00"},
    "mon": {"enabled": true,  "start": "08:00", "end": "18:00"},
    "tue": {"enabled": true,  "start": "08:00", "end": "18:00"},
    "wed": {"enabled": true,  "start": "08:00", "end": "18:00"},
    "thu": {"enabled": true,  "start": "08:00", "end": "18:00"},
    "fri": {"enabled": true,  "start": "08:00", "end": "18:00"},
    "sat": {"enabled": false, "start": "08:00", "end": "12:00"}
  }'::jsonb
);

COMMENT ON COLUMN public.user_settings.working_hours IS 'Horários de atendimento por dia da semana: { sun..sat: { enabled, start, end } }';
