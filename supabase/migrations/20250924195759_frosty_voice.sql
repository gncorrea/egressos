/*
  # Sistema de Questionários para Alunos e Eventos - UEMG

  1. New Tables
    - `questionarios_alunos` - Questionários específicos para alunos ativos
    - `respostas_alunos` - Respostas dos alunos aos questionários
    - `eventos_detalhados` - Eventos com mais informações
    - `inscricoes_eventos` - Inscrições em eventos
    - `avaliacoes_eventos` - Avaliações pós-evento
    - `categorias_eventos` - Categorias de eventos

  2. Security
    - Enable RLS on all new tables
    - Add policies for different user roles

  3. Data
    - Insert sample questionnaires for students
    - Create event categories and sample events
    - Sample evaluation questions for events
*/

-- Create categorias_eventos table
CREATE TABLE IF NOT EXISTS categorias_eventos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  descricao text,
  cor text DEFAULT '#3b82f6',
  icone text DEFAULT 'calendar',
  ativo boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categorias_eventos ENABLE ROW LEVEL SECURITY;

-- Create eventos_detalhados table (enhanced events)
CREATE TABLE IF NOT EXISTS eventos_detalhados (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  descricao text,
  categoria_id uuid REFERENCES categorias_eventos(id),
  data_inicio timestamptz NOT NULL,
  data_fim timestamptz,
  local text,
  endereco text,
  modalidade text CHECK (modalidade IN ('presencial', 'online', 'hibrido')) DEFAULT 'presencial',
  link_online text,
  vagas_total integer,
  vagas_ocupadas integer DEFAULT 0,
  valor decimal DEFAULT 0,
  gratuito boolean DEFAULT true,
  certificado boolean DEFAULT false,
  carga_horaria integer,
  palestrantes text[],
  organizador text,
  contato_organizador text,
  material_apoio text[],
  requisitos text,
  publico_alvo text,
  objetivos text,
  programacao text,
  status text CHECK (status IN ('rascunho', 'publicado', 'cancelado', 'finalizado')) DEFAULT 'rascunho',
  imagem_url text,
  tags text[],
  unidade_id uuid REFERENCES unidades(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE eventos_detalhados ENABLE ROW LEVEL SECURITY;

-- Create inscricoes_eventos table
CREATE TABLE IF NOT EXISTS inscricoes_eventos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  evento_id uuid REFERENCES eventos_detalhados(id) ON DELETE CASCADE NOT NULL,
  egresso_id uuid REFERENCES egressos(id) ON DELETE CASCADE,
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  nome_completo text NOT NULL,
  email text NOT NULL,
  telefone text,
  curso text,
  ano_conclusao integer,
  status text CHECK (status IN ('inscrito', 'confirmado', 'presente', 'ausente', 'cancelado')) DEFAULT 'inscrito',
  data_inscricao timestamptz DEFAULT now(),
  data_confirmacao timestamptz,
  observacoes text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(evento_id, email)
);

ALTER TABLE inscricoes_eventos ENABLE ROW LEVEL SECURITY;

-- Create avaliacoes_eventos table
CREATE TABLE IF NOT EXISTS avaliacoes_eventos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  evento_id uuid REFERENCES eventos_detalhados(id) ON DELETE CASCADE NOT NULL,
  inscricao_id uuid REFERENCES inscricoes_eventos(id) ON DELETE CASCADE NOT NULL,
  avaliacao_geral integer CHECK (avaliacao_geral >= 1 AND avaliacao_geral <= 5) NOT NULL,
  organizacao integer CHECK (organizacao >= 1 AND organizacao <= 5),
  conteudo integer CHECK (conteudo >= 1 AND conteudo <= 5),
  palestrantes integer CHECK (palestrantes >= 1 AND palestrantes <= 5),
  infraestrutura integer CHECK (infraestrutura >= 1 AND infraestrutura <= 5),
  recomendaria boolean,
  pontos_positivos text,
  sugestoes_melhoria text,
  outros_eventos_interesse text,
  comentarios_adicionais text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(evento_id, inscricao_id)
);

ALTER TABLE avaliacoes_eventos ENABLE ROW LEVEL SECURITY;

-- Create questionarios_alunos table
CREATE TABLE IF NOT EXISTS questionarios_alunos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  descricao text,
  categoria text CHECK (categoria IN ('satisfacao_academica', 'infraestrutura', 'servicos_estudantis', 'biblioteca', 'laboratorios', 'cantina', 'coordenacao', 'secretaria', 'vida_academica', 'extensao', 'pesquisa')) NOT NULL,
  publico_alvo text CHECK (publico_alvo IN ('todos', 'calouros', 'veteranos', 'formandos', 'pos_graduacao')) DEFAULT 'todos',
  semestre_aplicacao text,
  data_inicio timestamptz NOT NULL,
  data_fim timestamptz,
  ativo boolean DEFAULT true,
  obrigatorio boolean DEFAULT false,
  anonimo boolean DEFAULT true,
  unidade_id uuid REFERENCES unidades(id),
  curso_id uuid REFERENCES cursos(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE questionarios_alunos ENABLE ROW LEVEL SECURITY;

-- Create perguntas_alunos table
CREATE TABLE IF NOT EXISTS perguntas_alunos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  questionario_id uuid REFERENCES questionarios_alunos(id) ON DELETE CASCADE NOT NULL,
  pergunta text NOT NULL,
  tipo text NOT NULL CHECK (tipo IN ('multipla_escolha', 'texto', 'escala_likert', 'checkbox', 'escala_numerica', 'sim_nao')),
  opcoes text[],
  obrigatoria boolean DEFAULT false,
  ordem integer NOT NULL DEFAULT 0,
  categoria_resposta text,
  peso integer DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE perguntas_alunos ENABLE ROW LEVEL SECURITY;

-- Create respostas_alunos table
CREATE TABLE IF NOT EXISTS respostas_alunos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  questionario_id uuid REFERENCES questionarios_alunos(id) ON DELETE CASCADE NOT NULL,
  pergunta_id uuid REFERENCES perguntas_alunos(id) ON DELETE CASCADE NOT NULL,
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  resposta text NOT NULL,
  valor_numerico decimal,
  categoria_resposta text,
  semestre text,
  curso text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE respostas_alunos ENABLE ROW LEVEL SECURITY;

-- Policies for categorias_eventos
CREATE POLICY "All authenticated users can read event categories"
  ON categorias_eventos
  FOR SELECT
  TO authenticated
  USING (ativo = true);

CREATE POLICY "Admin roles can manage event categories"
  ON categorias_eventos
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('coordenacao', 'secretaria', 'administracao')
    )
  );

-- Policies for eventos_detalhados
CREATE POLICY "All authenticated users can read published events"
  ON eventos_detalhados
  FOR SELECT
  TO authenticated
  USING (status = 'publicado');

CREATE POLICY "Admin roles can manage events"
  ON eventos_detalhados
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('coordenacao', 'secretaria', 'administracao')
    )
  );

-- Policies for inscricoes_eventos
CREATE POLICY "Users can manage own event registrations"
  ON inscricoes_eventos
  FOR ALL
  TO authenticated
  USING (
    profile_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM egressos 
      WHERE id = egresso_id 
      AND profile_id = auth.uid()
    )
  );

CREATE POLICY "Admin roles can read all event registrations"
  ON inscricoes_eventos
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('coordenacao', 'secretaria', 'administracao')
    )
  );

-- Policies for avaliacoes_eventos
CREATE POLICY "Users can manage own event evaluations"
  ON avaliacoes_eventos
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM inscricoes_eventos 
      WHERE id = inscricao_id 
      AND profile_id = auth.uid()
    )
  );

CREATE POLICY "Admin roles can read all event evaluations"
  ON avaliacoes_eventos
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('coordenacao', 'secretaria', 'administracao')
    )
  );

-- Policies for questionarios_alunos
CREATE POLICY "All authenticated users can read active student questionnaires"
  ON questionarios_alunos
  FOR SELECT
  TO authenticated
  USING (ativo = true);

CREATE POLICY "Admin roles can manage student questionnaires"
  ON questionarios_alunos
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('coordenacao', 'secretaria', 'administracao')
    )
  );

-- Policies for perguntas_alunos
CREATE POLICY "All authenticated users can read student questions"
  ON perguntas_alunos
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin roles can manage student questions"
  ON perguntas_alunos
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('coordenacao', 'secretaria', 'administracao')
    )
  );

-- Policies for respostas_alunos
CREATE POLICY "Users can manage own student responses"
  ON respostas_alunos
  FOR ALL
  TO authenticated
  USING (profile_id = auth.uid());

CREATE POLICY "Admin roles can read all student responses"
  ON respostas_alunos
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('coordenacao', 'secretaria', 'administracao', 'professor')
    )
  );

-- Insert event categories
INSERT INTO categorias_eventos (nome, descricao, cor, icone) VALUES
  ('Acadêmico', 'Eventos relacionados à vida acadêmica', '#3b82f6', 'graduation-cap'),
  ('Networking', 'Eventos de relacionamento profissional', '#059669', 'users'),
  ('Capacitação', 'Cursos e workshops de capacitação', '#dc2626', 'book-open'),
  ('Cultural', 'Eventos culturais e artísticos', '#7c3aed', 'palette'),
  ('Esportivo', 'Atividades esportivas e recreativas', '#ea580c', 'trophy'),
  ('Científico', 'Congressos, seminários e pesquisa', '#0891b2', 'microscope'),
  ('Extensão', 'Projetos de extensão universitária', '#65a30d', 'heart-handshake'),
  ('Institucional', 'Eventos oficiais da UEMG', '#1f2937', 'building');

-- Insert sample detailed events
INSERT INTO eventos_detalhados (titulo, descricao, categoria_id, data_inicio, data_fim, local, modalidade, vagas_total, gratuito, certificado, carga_horaria, palestrantes, organizador, publico_alvo, objetivos, status, unidade_id) VALUES
  ('Encontro de Egressos UEMG 2024', 
   'Evento anual para reunir egressos de todos os cursos da UEMG, promovendo networking e troca de experiências profissionais.',
   (SELECT id FROM categorias_eventos WHERE nome = 'Networking'),
   now() + interval '30 days',
   now() + interval '30 days' + interval '8 hours',
   'Centro de Convenções BH',
   'presencial',
   500,
   true,
   true,
   8,
   ARRAY['Dr. João Silva - Reitor UEMG', 'Dra. Maria Santos - Ex-aluna Destaque', 'Prof. Carlos Lima - Coordenador Geral'],
   'Reitoria UEMG',
   'Egressos de todos os cursos da UEMG',
   'Promover networking entre egressos, apresentar oportunidades de carreira e fortalecer vínculos com a instituição',
   'publicado',
   (SELECT id FROM unidades WHERE codigo = 'REIT')),

  ('Workshop: Inteligência Artificial na Educação',
   'Capacitação para docentes sobre o uso de IA como ferramenta pedagógica.',
   (SELECT id FROM categorias_eventos WHERE nome = 'Capacitação'),
   now() + interval '15 days',
   now() + interval '15 days' + interval '4 hours',
   'Laboratório de Informática - Unidade BH',
   'hibrido',
   50,
   true,
   true,
   4,
   ARRAY['Dr. Pedro Oliveira - Especialista em IA', 'Profa. Ana Costa - Pedagogia Digital'],
   'Coordenação de TI - UEMG BH',
   'Docentes e coordenadores de curso',
   'Capacitar docentes no uso de ferramentas de IA para melhoria do processo ensino-aprendizagem',
   'publicado',
   (SELECT id FROM unidades WHERE codigo = 'BH')),

  ('Semana de Ciência e Tecnologia',
   'Evento científico com apresentação de trabalhos de pesquisa e extensão.',
   (SELECT id FROM categorias_eventos WHERE nome = 'Científico'),
   now() + interval '45 days',
   now() + interval '49 days',
   'Campus Divinópolis',
   'presencial',
   300,
   true,
   true,
   40,
   ARRAY['Diversos pesquisadores da UEMG', 'Convidados externos'],
   'Pró-reitoria de Pesquisa e Extensão',
   'Estudantes, docentes e comunidade externa',
   'Divulgar pesquisas desenvolvidas na UEMG e promover intercâmbio científico',
   'publicado',
   (SELECT id FROM unidades WHERE codigo = 'DIVINOPOLIS')),

  ('Festival Cultural UEMG',
   'Mostra de talentos artísticos e culturais da comunidade acadêmica.',
   (SELECT id FROM categorias_eventos WHERE nome = 'Cultural'),
   now() + interval '60 days',
   now() + interval '62 days',
   'Teatro Municipal - Barbacena',
   'presencial',
   200,
   true,
   false,
   0,
   ARRAY['Grupos artísticos da UEMG', 'Artistas locais'],
   'Coordenação de Cultura - UEMG Barbacena',
   'Comunidade acadêmica e sociedade',
   'Promover a cultura e valorizar talentos da comunidade universitária',
   'publicado',
   (SELECT id FROM unidades WHERE codigo = 'BARBACENA'));

-- Insert sample student questionnaires
INSERT INTO questionarios_alunos (titulo, descricao, categoria, publico_alvo, semestre_aplicacao, data_inicio, data_fim, obrigatorio, unidade_id) VALUES
  ('Avaliação da Satisfação Acadêmica 2024.1',
   'Questionário para avaliar a satisfação dos alunos com o curso e a instituição',
   'satisfacao_academica',
   'todos',
   '2024.1',
   now(),
   now() + interval '30 days',
   false,
   (SELECT id FROM unidades WHERE codigo = 'BH')),

  ('Avaliação da Infraestrutura Universitária',
   'Pesquisa sobre a qualidade da infraestrutura física da universidade',
   'infraestrutura',
   'todos',
   '2024.1',
   now(),
   now() + interval '45 days',
   false,
   (SELECT id FROM unidades WHERE codigo = 'BH')),

  ('Pesquisa sobre Serviços da Biblioteca',
   'Avaliação dos serviços oferecidos pela biblioteca universitária',
   'biblioteca',
   'todos',
   '2024.1',
   now(),
   now() + interval '60 days',
   false,
   (SELECT id FROM unidades WHERE codigo = 'BH')),

  ('Avaliação dos Laboratórios de Ensino',
   'Questionário sobre a qualidade e adequação dos laboratórios',
   'laboratorios',
   'todos',
   '2024.1',
   now(),
   now() + interval '30 days',
   false,
   (SELECT id FROM unidades WHERE codigo = 'BH')),

  ('Pesquisa de Integração - Calouros 2024',
   'Questionário específico para avaliar a adaptação dos novos alunos',
   'vida_academica',
   'calouros',
   '2024.1',
   now(),
   now() + interval '90 days',
   true,
   (SELECT id FROM unidades WHERE codigo = 'BH'));

-- Insert sample questions for academic satisfaction questionnaire
INSERT INTO perguntas_alunos (questionario_id, pergunta, tipo, opcoes, obrigatoria, ordem, categoria_resposta, peso) VALUES
  -- Satisfação Acadêmica
  ((SELECT id FROM questionarios_alunos WHERE titulo = 'Avaliação da Satisfação Acadêmica 2024.1'),
   'Como você avalia a qualidade geral do seu curso?',
   'escala_likert',
   ARRAY['Muito ruim', 'Ruim', 'Regular', 'Bom', 'Excelente'],
   true, 1, 'qualidade_curso', 5),

  ((SELECT id FROM questionarios_alunos WHERE titulo = 'Avaliação da Satisfação Acadêmica 2024.1'),
   'O conteúdo das disciplinas atende às suas expectativas?',
   'escala_likert',
   ARRAY['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'],
   true, 2, 'conteudo_disciplinas', 4),

  ((SELECT id FROM questionarios_alunos WHERE titulo = 'Avaliação da Satisfação Acadêmica 2024.1'),
   'Como você avalia a didática dos professores?',
   'escala_likert',
   ARRAY['Muito ruim', 'Ruim', 'Regular', 'Boa', 'Excelente'],
   true, 3, 'didatica_professores', 4),

  ((SELECT id FROM questionarios_alunos WHERE titulo = 'Avaliação da Satisfação Acadêmica 2024.1'),
   'Você recomendaria seu curso para outras pessoas?',
   'sim_nao',
   ARRAY['Sim', 'Não'],
   true, 4, 'recomendacao_curso', 3),

  ((SELECT id FROM questionarios_alunos WHERE titulo = 'Avaliação da Satisfação Acadêmica 2024.1'),
   'Quais aspectos do curso você considera mais positivos?',
   'checkbox',
   ARRAY['Qualidade dos professores', 'Conteúdo atualizado', 'Metodologia de ensino', 'Infraestrutura', 'Relacionamento com colegas', 'Suporte da coordenação', 'Atividades práticas'],
   false, 5, 'aspectos_positivos', 2),

  ((SELECT id FROM questionarios_alunos WHERE titulo = 'Avaliação da Satisfação Acadêmica 2024.1'),
   'Que sugestões você daria para melhorar o curso?',
   'texto',
   NULL,
   false, 6, 'sugestoes_melhoria', 2),

  -- Infraestrutura
  ((SELECT id FROM questionarios_alunos WHERE titulo = 'Avaliação da Infraestrutura Universitária'),
   'Como você avalia as salas de aula?',
   'escala_likert',
   ARRAY['Muito ruins', 'Ruins', 'Regulares', 'Boas', 'Excelentes'],
   true, 1, 'salas_aula', 4),

  ((SELECT id FROM questionarios_alunos WHERE titulo = 'Avaliação da Infraestrutura Universitária'),
   'A iluminação das salas é adequada?',
   'sim_nao',
   ARRAY['Sim', 'Não'],
   true, 2, 'iluminacao', 3),

  ((SELECT id FROM questionarios_alunos WHERE titulo = 'Avaliação da Infraestrutura Universitária'),
   'Como você avalia a limpeza das instalações?',
   'escala_numerica',
   NULL,
   true, 3, 'limpeza', 3),

  ((SELECT id FROM questionarios_alunos WHERE titulo = 'Avaliação da Infraestrutura Universitária'),
   'Quais áreas precisam de melhorias urgentes?',
   'checkbox',
   ARRAY['Salas de aula', 'Banheiros', 'Laboratórios', 'Biblioteca', 'Cantina', 'Área de convivência', 'Estacionamento', 'Acessibilidade'],
   false, 4, 'areas_melhoria', 4),

  -- Biblioteca
  ((SELECT id FROM questionarios_alunos WHERE titulo = 'Pesquisa sobre Serviços da Biblioteca'),
   'Com que frequência você utiliza a biblioteca?',
   'multipla_escolha',
   ARRAY['Diariamente', 'Semanalmente', 'Mensalmente', 'Raramente', 'Nunca'],
   true, 1, 'frequencia_uso', 3),

  ((SELECT id FROM questionarios_alunos WHERE titulo = 'Pesquisa sobre Serviços da Biblioteca'),
   'O acervo disponível atende às suas necessidades acadêmicas?',
   'escala_likert',
   ARRAY['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'],
   true, 2, 'adequacao_acervo', 4),

  ((SELECT id FROM questionarios_alunos WHERE titulo = 'Pesquisa sobre Serviços da Biblioteca'),
   'Como você avalia o atendimento dos funcionários da biblioteca?',
   'escala_likert',
   ARRAY['Muito ruim', 'Ruim', 'Regular', 'Bom', 'Excelente'],
   true, 3, 'atendimento_funcionarios', 3),

  -- Laboratórios
  ((SELECT id FROM questionarios_alunos WHERE titulo = 'Avaliação dos Laboratórios de Ensino'),
   'Os equipamentos dos laboratórios estão em bom estado?',
   'escala_likert',
   ARRAY['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'],
   true, 1, 'estado_equipamentos', 4),

  ((SELECT id FROM questionarios_alunos WHERE titulo = 'Avaliação dos Laboratórios de Ensino'),
   'O número de equipamentos é suficiente para as aulas práticas?',
   'sim_nao',
   ARRAY['Sim', 'Não'],
   true, 2, 'quantidade_equipamentos', 3),

  -- Calouros
  ((SELECT id FROM questionarios_alunos WHERE titulo = 'Pesquisa de Integração - Calouros 2024'),
   'Como foi sua adaptação à vida universitária?',
   'escala_likert',
   ARRAY['Muito difícil', 'Difícil', 'Regular', 'Fácil', 'Muito fácil'],
   true, 1, 'adaptacao_universitaria', 4),

  ((SELECT id FROM questionarios_alunos WHERE titulo = 'Pesquisa de Integração - Calouros 2024'),
   'Você participou das atividades de recepção aos calouros?',
   'sim_nao',
   ARRAY['Sim', 'Não'],
   true, 2, 'participacao_recepcao', 2),

  ((SELECT id FROM questionarios_alunos WHERE titulo = 'Pesquisa de Integração - Calouros 2024'),
   'Que tipo de apoio você gostaria de receber da universidade?',
   'checkbox',
   ARRAY['Orientação acadêmica', 'Apoio psicológico', 'Suporte financeiro', 'Atividades de integração', 'Mentoria com veteranos', 'Grupos de estudo', 'Atividades extracurriculares'],
   false, 3, 'tipos_apoio', 3);