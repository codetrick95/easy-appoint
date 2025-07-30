-- Criar tabela de perfis para profissionais
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  nome TEXT NOT NULL,
  especialidade TEXT,
  telefone TEXT,
  email TEXT,
  link_publico TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de pacientes
CREATE TABLE public.pacientes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  telefone TEXT,
  email TEXT,
  data_nascimento DATE,
  convenio TEXT,
  numero_carteirinha TEXT,
  cpf TEXT,
  profissao TEXT,
  endereco_cep TEXT,
  endereco_rua TEXT,
  endereco_numero TEXT,
  endereco_bairro TEXT,
  endereco_cidade TEXT,
  endereco_estado TEXT,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar enum para status dos agendamentos
CREATE TYPE status_agendamento AS ENUM ('agendado', 'confirmado', 'cancelado', 'concluido');

-- Criar tabela de agendamentos
CREATE TABLE public.agendamentos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  paciente_id UUID REFERENCES public.pacientes(id) ON DELETE SET NULL,
  nome_paciente TEXT NOT NULL,
  telefone_paciente TEXT,
  email_paciente TEXT,
  data_hora TIMESTAMP WITH TIME ZONE NOT NULL,
  duracao_minutos INTEGER NOT NULL DEFAULT 60,
  status status_agendamento NOT NULL DEFAULT 'agendado',
  observacoes TEXT,
  agendamento_publico BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pacientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agendamentos ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para profiles
CREATE POLICY "Usuários podem ver seus próprios perfis" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar seus próprios perfis" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios perfis" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Políticas RLS para pacientes
CREATE POLICY "Usuários podem ver seus próprios pacientes" 
ON public.pacientes 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar seus próprios pacientes" 
ON public.pacientes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios pacientes" 
ON public.pacientes 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios pacientes" 
ON public.pacientes 
FOR DELETE 
USING (auth.uid() = user_id);

-- Políticas RLS para agendamentos
CREATE POLICY "Usuários podem ver seus próprios agendamentos" 
ON public.agendamentos 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Agendamentos públicos podem ser vistos por todos" 
ON public.agendamentos 
FOR SELECT 
USING (agendamento_publico = true);

CREATE POLICY "Usuários podem criar seus próprios agendamentos" 
ON public.agendamentos 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Qualquer um pode criar agendamentos públicos" 
ON public.agendamentos 
FOR INSERT 
WITH CHECK (agendamento_publico = true);

CREATE POLICY "Usuários podem atualizar seus próprios agendamentos" 
ON public.agendamentos 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios agendamentos" 
ON public.agendamentos 
FOR DELETE 
USING (auth.uid() = user_id);

-- Função para atualizar timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar timestamps
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pacientes_updated_at
  BEFORE UPDATE ON public.pacientes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_agendamentos_updated_at
  BEFORE UPDATE ON public.agendamentos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Função para criar perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, nome, email, link_publico)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'nome', NEW.email), 
    NEW.email,
    NEW.id::text
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Índices para performance
CREATE INDEX idx_pacientes_user_id ON public.pacientes(user_id);
CREATE INDEX idx_agendamentos_user_id ON public.agendamentos(user_id);
CREATE INDEX idx_agendamentos_data_hora ON public.agendamentos(data_hora);
CREATE INDEX idx_agendamentos_paciente_id ON public.pacientes(id);
CREATE INDEX idx_profiles_link_publico ON public.profiles(link_publico);