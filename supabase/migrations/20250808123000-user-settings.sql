-- Tabela de configurações por usuário
CREATE TABLE IF NOT EXISTS public.user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  -- Notificações
  notifications_email BOOLEAN NOT NULL DEFAULT true,
  notifications_sms BOOLEAN NOT NULL DEFAULT false,
  notifications_push BOOLEAN NOT NULL DEFAULT true,
  -- Privacidade
  privacy_public_profile BOOLEAN NOT NULL DEFAULT true,
  privacy_show_phone BOOLEAN NOT NULL DEFAULT false,
  privacy_show_email BOOLEAN NOT NULL DEFAULT true,
  privacy_show_social_media BOOLEAN NOT NULL DEFAULT true,
  -- Preferências
  preferences_theme TEXT NOT NULL DEFAULT 'light', -- 'light' | 'dark' | 'auto'
  preferences_language TEXT NOT NULL DEFAULT 'pt-BR',
  preferences_timezone TEXT NOT NULL DEFAULT 'America/Sao_Paulo',
  -- Sistema
  system_auto_backup BOOLEAN NOT NULL DEFAULT true,
  system_data_retention TEXT NOT NULL DEFAULT '1_year',
  system_session_timeout TEXT NOT NULL DEFAULT '8_hours',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Políticas
CREATE POLICY IF NOT EXISTS "users can select own settings"
ON public.user_settings
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "users can insert own settings"
ON public.user_settings
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "users can update own settings"
ON public.user_settings
FOR UPDATE USING (auth.uid() = user_id);

-- Trigger updated_at
CREATE OR REPLACE FUNCTION public.user_settings_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_user_settings_updated_at ON public.user_settings;
CREATE TRIGGER trg_user_settings_updated_at
  BEFORE UPDATE ON public.user_settings
  FOR EACH ROW EXECUTE FUNCTION public.user_settings_set_updated_at();


