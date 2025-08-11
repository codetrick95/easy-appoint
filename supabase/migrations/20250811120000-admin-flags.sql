-- Add admin and active flags to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_admin boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS active boolean NOT NULL DEFAULT true;

COMMENT ON COLUMN public.profiles.is_admin IS 'Marca se o usuário é administrador global.';
COMMENT ON COLUMN public.profiles.active IS 'Conta ativa para acesso às funcionalidades.';


