-- Evitar agendamentos sobrepostos por usuário
-- Requer a extensão btree_gist para suportar comparação de UUID em índices GiST
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Coluna gerada com o intervalo [data_hora, data_hora + duracao)
ALTER TABLE public.agendamentos
ADD COLUMN IF NOT EXISTS time_range tstzrange
GENERATED ALWAYS AS (
  tstzrange(
    data_hora,
    data_hora + make_interval(mins => duracao_minutos),
    '[)'
  )
) STORED;

-- Restrição de exclusão para impedir sobreposição de horários do mesmo usuário
-- Ignora agendamentos com status 'cancelado'
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'agendamentos_no_overlap'
  ) THEN
    ALTER TABLE public.agendamentos
    ADD CONSTRAINT agendamentos_no_overlap
    EXCLUDE USING GIST (
      user_id WITH =,
      time_range WITH &&
    )
    WHERE (status <> 'cancelado');
  END IF;
END $$;


