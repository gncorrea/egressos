/*
  # Create Egresso Management System Tables

  1. New Tables
    - `profiles` - User profiles with roles
    - `egressos` - Graduate information
    - `questionarios` - Questionnaire definitions
    - `perguntas` - Questions within questionnaires
    - `respostas` - Answers to questions
    - `eventos` - Events for graduates
    - `evento_participantes` - Event participation tracking

  2. Security
    - Enable RLS on all tables
    - Add policies for different user roles
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('egresso', 'coordenacao', 'secretaria', 'professor', 'administracao')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create egressos table
CREATE TABLE IF NOT EXISTS egressos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  curso text NOT NULL,
  ano_conclusao integer NOT NULL,
  telefone text,
  endereco text,
  status_profissional text,
  empresa_atual text,
  cargo_atual text,
  formacao_continuada text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE egressos ENABLE ROW LEVEL SECURITY;

-- Egressos policies
CREATE POLICY "Egressos can manage own data"
  ON egressos
  FOR ALL
  TO authenticated
  USING (
    auth.uid() = profile_id OR 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('coordenacao', 'secretaria', 'administracao')
    )
  );

-- Create questionarios table
CREATE TABLE IF NOT EXISTS questionarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  descricao text,
  data_aplicacao timestamptz NOT NULL,
  data_fim timestamptz,
  ativo boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE questionarios ENABLE ROW LEVEL SECURITY;

-- Questionarios policies
CREATE POLICY "All authenticated users can read active questionnaires"
  ON questionarios
  FOR SELECT
  TO authenticated
  USING (ativo = true);

CREATE POLICY "Admin roles can manage questionnaires"
  ON questionarios
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('coordenacao', 'secretaria', 'administracao')
    )
  );

-- Create perguntas table
CREATE TABLE IF NOT EXISTS perguntas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  questionario_id uuid REFERENCES questionarios(id) ON DELETE CASCADE NOT NULL,
  pergunta text NOT NULL,
  tipo text NOT NULL CHECK (tipo IN ('multipla_escolha', 'texto', 'escala', 'checkbox')),
  opcoes text[],
  obrigatoria boolean DEFAULT false,
  ordem integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE perguntas ENABLE ROW LEVEL SECURITY;

-- Perguntas policies
CREATE POLICY "All authenticated users can read questions"
  ON perguntas
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin roles can manage questions"
  ON perguntas
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('coordenacao', 'secretaria', 'administracao')
    )
  );

-- Create respostas table
CREATE TABLE IF NOT EXISTS respostas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  egresso_id uuid REFERENCES egressos(id) ON DELETE CASCADE NOT NULL,
  questionario_id uuid REFERENCES questionarios(id) ON DELETE CASCADE NOT NULL,
  pergunta_id uuid REFERENCES perguntas(id) ON DELETE CASCADE NOT NULL,
  resposta text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE respostas ENABLE ROW LEVEL SECURITY;

-- Respostas policies
CREATE POLICY "Egressos can manage own answers"
  ON respostas
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM egressos 
      WHERE id = egresso_id 
      AND profile_id = auth.uid()
    )
  );

CREATE POLICY "Admin roles can read all answers"
  ON respostas
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('coordenacao', 'secretaria', 'administracao', 'professor')
    )
  );

-- Create eventos table
CREATE TABLE IF NOT EXISTS eventos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  descricao text,
  data_evento timestamptz NOT NULL,
  local text,
  vagas integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE eventos ENABLE ROW LEVEL SECURITY;

-- Eventos policies
CREATE POLICY "All authenticated users can read events"
  ON eventos
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin roles can manage events"
  ON eventos
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('coordenacao', 'secretaria', 'administracao')
    )
  );

-- Create evento_participantes table
CREATE TABLE IF NOT EXISTS evento_participantes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  evento_id uuid REFERENCES eventos(id) ON DELETE CASCADE NOT NULL,
  egresso_id uuid REFERENCES egressos(id) ON DELETE CASCADE NOT NULL,
  status text DEFAULT 'inscrito' CHECK (status IN ('inscrito', 'presente', 'ausente')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(evento_id, egresso_id)
);

ALTER TABLE evento_participantes ENABLE ROW LEVEL SECURITY;

-- Evento participantes policies
CREATE POLICY "Egressos can manage own event participation"
  ON evento_participantes
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM egressos 
      WHERE id = egresso_id 
      AND profile_id = auth.uid()
    )
  );

CREATE POLICY "Admin roles can manage all event participation"
  ON evento_participantes
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('coordenacao', 'secretaria', 'administracao')
    )
  );

-- Insert sample data
INSERT INTO profiles (id, email, full_name, role) VALUES
  ('11111111-1111-1111-1111-111111111111', 'egresso@demo.com', 'João Silva', 'egresso'),
  ('22222222-2222-2222-2222-222222222222', 'coord@demo.com', 'Maria Santos', 'coordenacao'),
  ('33333333-3333-3333-3333-333333333333', 'sec@demo.com', 'Ana Costa', 'secretaria');

-- Insert sample egresso data
INSERT INTO egressos (profile_id, curso, ano_conclusao, telefone, status_profissional, empresa_atual, cargo_atual) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Ciência da Computação', 2020, '(11) 99999-9999', 'Empregado', 'Tech Corp', 'Desenvolvedor Sênior');

-- Insert sample questionnaire
INSERT INTO questionarios (titulo, descricao, data_aplicacao, data_fim) VALUES
  ('Pesquisa de Empregabilidade 2024', 'Pesquisa sobre a situação profissional dos egressos', now(), now() + interval '30 days');

-- Insert sample event
INSERT INTO eventos (titulo, descricao, data_evento, local) VALUES
  ('Encontro de Egressos 2024', 'Evento anual de networking entre egressos', now() + interval '15 days', 'Auditório Central');