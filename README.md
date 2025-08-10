# TrickTime - Sistema de Agendamentos

Sistema completo de agendamentos para profissionais da saúde e outros serviços.

## Sobre o Projeto

O TrickTime é uma plataforma moderna e intuitiva para gerenciamento de agendamentos, desenvolvida com as melhores tecnologias:

- **Framework**: React 18 com TypeScript
- **Estilização**: Tailwind CSS com componentes shadcn/ui
- **Build Tool**: Vite
- **Banco de Dados**: Supabase (PostgreSQL)
- **Autenticação**: Supabase Auth
- **Deploy**: Preparado para Vercel

## Funcionalidades

- 📅 **Agendamento Inteligente**: Sistema de agendamentos com verificação de conflitos
- 👥 **Gestão de Pacientes**: Cadastro completo de pacientes com histórico
- 🔗 **Link Público**: Compartilhamento de link para agendamentos públicos
- ⚙️ **Configurações de Privacidade**: Controle total sobre informações exibidas
- 📊 **Dashboard**: Visão geral dos agendamentos e estatísticas
- 🎨 **Interface Moderna**: Design responsivo e intuitivo

## Tecnologias Utilizadas

- React 18 + TypeScript
- Tailwind CSS + shadcn/ui
- Supabase (PostgreSQL + Auth)
- Vite
- React Router DOM
- Lucide React (Ícones)

## Como Executar Localmente

```sh
# Clone o repositório
git clone <URL_DO_REPOSITORIO>

# Navegue para o diretório do projeto
cd easy-appoint

# Instale as dependências
npm install

# Configure as variáveis de ambiente do Supabase
# Copie o arquivo .env.example para .env e preencha as credenciais

# Inicie o servidor de desenvolvimento
npm run dev
```

## Deploy

O projeto está configurado para deploy na Vercel com as seguintes configurações:

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## Configuração do Banco de Dados

1. Crie uma conta no [Supabase](https://supabase.com)
2. Crie um novo projeto
3. Execute as migrações SQL na pasta `supabase/migrations/`
4. Configure as variáveis de ambiente com as credenciais do Supabase
