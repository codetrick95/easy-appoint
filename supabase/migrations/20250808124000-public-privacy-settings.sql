-- Permitir acesso público às configurações de privacidade para links públicos
CREATE POLICY IF NOT EXISTS "public can select privacy settings for public profiles"
ON public.user_settings
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = user_settings.user_id 
    AND profiles.link_publico IS NOT NULL
  )
);

-- Comentário explicativo
COMMENT ON POLICY "public can select privacy settings for public profiles" ON public.user_settings IS 
'Permite acesso público às configurações de privacidade para perfis que têm link público configurado';
