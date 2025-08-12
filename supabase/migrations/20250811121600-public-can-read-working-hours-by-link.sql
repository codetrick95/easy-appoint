-- Política: público pode ler working_hours via user_settings quando houver link_publico
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE polname = 'public can read working hours by link'
  ) THEN
    CREATE POLICY "public can read working hours by link"
    ON public.user_settings
    FOR SELECT USING (
      EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.user_id = user_settings.user_id 
        AND profiles.link_publico IS NOT NULL
      )
    );
  END IF;
END $$;


