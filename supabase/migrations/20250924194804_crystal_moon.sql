/*
  # Sistema de Questionários UEMG - Expansão Completa

  1. New Tables
    - `unidades` - Unidades da UEMG (campi)
    - `cursos` - Cursos por unidade
    - `questionarios_templates` - Templates de questionários
    - `perguntas_templates` - Templates de perguntas
    - `respostas_questionarios` - Respostas dos questionários
    - `feedback_pedagogico` - Feedback específico do projeto pedagógico
    - `acoes_corretivas` - Ações baseadas no feedback

  2. Security
    - Enable RLS on all new tables
    - Add policies for different user roles
    - Specific policies for UEMG units and courses

  3. Data
    - Insert UEMG units and courses
    - Create questionnaire templates
    - Sample pedagogical feedback questions
*/

-- Create unidades table (UEMG Units)
CREATE TABLE IF NOT EXISTS unidades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  codigo text UNIQUE NOT NULL,
  cidade text NOT NULL,
  endereco text,
  telefone text,
  email text,
  diretor text,
  ativo boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE unidades ENABLE ROW LEVEL SECURITY;

-- Create cursos table
CREATE TABLE IF NOT EXISTS cursos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unidade_id uuid REFERENCES unidades(id) ON DELETE CASCADE NOT NULL,
  nome text NOT NULL,
  codigo text NOT NULL,
  modalidade text CHECK (modalidade IN ('presencial', 'ead', 'hibrido')) DEFAULT 'presencial',
  duracao_semestres integer NOT NULL DEFAULT 8,
  coordenador text,
  ativo boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(unidade_id, codigo)
);

ALTER TABLE cursos ENABLE ROW LEVEL SECURITY;

-- Create questionarios_templates table
CREATE TABLE IF NOT EXISTS questionarios_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  descricao text,
  categoria text CHECK (categoria IN ('empregabilidade', 'satisfacao_curso', 'projeto_pedagogico', 'infraestrutura', 'docentes', 'geral')) NOT NULL,
  periodicidade text CHECK (periodicidade IN ('semestral', 'anual', 'bianual', 'eventual')) DEFAULT 'anual',
  obrigatorio boolean DEFAULT false,
  ativo boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE questionarios_templates ENABLE ROW LEVEL SECURITY;

-- Create perguntas_templates table
CREATE TABLE IF NOT EXISTS perguntas_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  questionario_template_id uuid REFERENCES questionarios_templates(id) ON DELETE CASCADE NOT NULL,
  pergunta text NOT NULL,
  tipo text NOT NULL CHECK (tipo IN ('multipla_escolha', 'texto', 'escala_likert', 'checkbox', 'escala_numerica')),
  opcoes text[],
  obrigatoria boolean DEFAULT false,
  ordem integer NOT NULL DEFAULT 0,
  categoria_resposta text, -- Para categorizar as respostas (ex: 'qualidade_ensino', 'infraestrutura')
  peso integer DEFAULT 1, -- Para cálculos de indicadores
  created_at timestamptz DEFAULT now()
);

ALTER TABLE perguntas_templates ENABLE ROW LEVEL SECURITY;

-- Update questionarios table to reference templates and units
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'questionarios' AND column_name = 'questionario_template_id'
  ) THEN
    ALTER TABLE questionarios ADD COLUMN questionario_template_id uuid REFERENCES questionarios_templates(id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'questionarios' AND column_name = 'unidade_id'
  ) THEN
    ALTER TABLE questionarios ADD COLUMN unidade_id uuid REFERENCES unidades(id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'questionarios' AND column_name = 'curso_id'
  ) THEN
    ALTER TABLE questionarios ADD COLUMN curso_id uuid REFERENCES cursos(id);
  END IF;
END $$;

-- Update egressos table to reference courses
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'egressos' AND column_name = 'curso_id'
  ) THEN
    ALTER TABLE egressos ADD COLUMN curso_id uuid REFERENCES cursos(id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'egressos' AND column_name = 'unidade_id'
  ) THEN
    ALTER TABLE egressos ADD COLUMN unidade_id uuid REFERENCES unidades(id);
  END IF;
END $$;

-- Create respostas_questionarios table (enhanced responses)
CREATE TABLE IF NOT EXISTS respostas_questionarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  egresso_id uuid REFERENCES egressos(id) ON DELETE CASCADE NOT NULL,
  questionario_id uuid REFERENCES questionarios(id) ON DELETE CASCADE NOT NULL,
  pergunta_template_id uuid REFERENCES perguntas_templates(id) ON DELETE CASCADE NOT NULL,
  resposta text NOT NULL,
  valor_numerico decimal, -- Para escalas numéricas
  categoria_resposta text, -- Categoria da resposta para análise
  created_at timestamptz DEFAULT now(),
  UNIQUE(egresso_id, questionario_id, pergunta_template_id)
);

ALTER TABLE respostas_questionarios ENABLE ROW LEVEL SECURITY;

-- Create feedback_pedagogico table
CREATE TABLE IF NOT EXISTS feedback_pedagogico (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  curso_id uuid REFERENCES cursos(id) ON DELETE CASCADE NOT NULL,
  questionario_id uuid REFERENCES questionarios(id) ON DELETE CASCADE NOT NULL,
  categoria text CHECK (categoria IN ('curriculo', 'metodologia', 'avaliacao', 'estagio', 'tcc', 'laboratorios', 'biblioteca', 'docentes')) NOT NULL,
  indicador text NOT NULL, -- Ex: 'satisfacao_curriculo', 'adequacao_mercado'
  valor_medio decimal NOT NULL,
  total_respostas integer NOT NULL,
  periodo_referencia text NOT NULL, -- Ex: '2024.1'
  observacoes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE feedback_pedagogico ENABLE ROW LEVEL SECURITY;

-- Create acoes_corretivas table
CREATE TABLE IF NOT EXISTS acoes_corretivas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  curso_id uuid REFERENCES cursos(id) ON DELETE CASCADE NOT NULL,
  feedback_id uuid REFERENCES feedback_pedagogico(id) ON DELETE CASCADE,
  titulo text NOT NULL,
  descricao text NOT NULL,
  categoria text CHECK (categoria IN ('curriculo', 'metodologia', 'infraestrutura', 'docentes', 'recursos', 'estagio')) NOT NULL,
  prioridade text CHECK (prioridade IN ('baixa', 'media', 'alta', 'critica')) DEFAULT 'media',
  status text CHECK (status IN ('planejada', 'em_andamento', 'concluida', 'cancelada')) DEFAULT 'planejada',
  responsavel text,
  prazo_execucao date,
  data_conclusao date,
  resultados_obtidos text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE acoes_corretivas ENABLE ROW LEVEL SECURITY;

-- Policies for unidades
CREATE POLICY "All authenticated users can read units"
  ON unidades
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin roles can manage units"
  ON unidades
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('administracao')
    )
  );

-- Policies for cursos
CREATE POLICY "All authenticated users can read courses"
  ON cursos
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin and coordination can manage courses"
  ON cursos
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('coordenacao', 'administracao')
    )
  );

-- Policies for questionarios_templates
CREATE POLICY "All authenticated users can read questionnaire templates"
  ON questionarios_templates
  FOR SELECT
  TO authenticated
  USING (ativo = true);

CREATE POLICY "Admin roles can manage questionnaire templates"
  ON questionarios_templates
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('coordenacao', 'administracao')
    )
  );

-- Policies for perguntas_templates
CREATE POLICY "All authenticated users can read question templates"
  ON perguntas_templates
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin roles can manage question templates"
  ON perguntas_templates
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('coordenacao', 'administracao')
    )
  );

-- Policies for respostas_questionarios
CREATE POLICY "Egressos can manage own questionnaire responses"
  ON respostas_questionarios
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM egressos 
      WHERE id = egresso_id 
      AND profile_id = auth.uid()
    )
  );

CREATE POLICY "Admin roles can read all questionnaire responses"
  ON respostas_questionarios
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('coordenacao', 'secretaria', 'administracao', 'professor')
    )
  );

-- Policies for feedback_pedagogico
CREATE POLICY "Admin and coordination can read pedagogical feedback"
  ON feedback_pedagogico
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('coordenacao', 'administracao', 'professor')
    )
  );

CREATE POLICY "Admin and coordination can manage pedagogical feedback"
  ON feedback_pedagogico
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('coordenacao', 'administracao')
    )
  );

-- Policies for acoes_corretivas
CREATE POLICY "Admin and coordination can read corrective actions"
  ON acoes_corretivas
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('coordenacao', 'administracao', 'professor')
    )
  );

CREATE POLICY "Admin and coordination can manage corrective actions"
  ON acoes_corretivas
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('coordenacao', 'administracao')
    )
  );

-- Insert UEMG Units
INSERT INTO unidades (nome, codigo, cidade, endereco, telefone, email) VALUES
  ('Reitoria UEMG', 'REIT', 'Belo Horizonte', 'Rodovia Papa João XXIII, 4143 - Serra Verde', '(31) 3916-9000', 'reitoria@uemg.br'),
  ('Unidade Acadêmica de Belo Horizonte', 'BH', 'Belo Horizonte', 'Av. Presidente Antônio Carlos, 7545', '(31) 3916-9100', 'bh@uemg.br'),
  ('Unidade Acadêmica de Barbacena', 'BARBACENA', 'Barbacena', 'Av. Bias Fortes, 1300', '(32) 3339-1200', 'barbacena@uemg.br'),
  ('Unidade Acadêmica de Carangola', 'CARANGOLA', 'Carangola', 'Av. Dr. José Bonifácio, 1001', '(32) 3741-2944', 'carangola@uemg.br'),
  ('Unidade Acadêmica de Cláudio', 'CLAUDIO', 'Cláudio', 'Rua Natalino José do Patrocínio, 104', '(37) 3354-8800', 'claudio@uemg.br'),
  ('Unidade Acadêmica de Divinópolis', 'DIVINOPOLIS', 'Divinópolis', 'Av. Paraná, 3001', '(37) 3229-3700', 'divinopolis@uemg.br'),
  ('Unidade Acadêmica de Frutal', 'FRUTAL', 'Frutal', 'Av. Prof. Mário Palmério, 1001', '(34) 3421-9200', 'frutal@uemg.br'),
  ('Unidade Acadêmica de Ibirité', 'IBIRITE', 'Ibirité', 'Av. São Paulo, 3996', '(31) 3521-4700', 'ibirite@uemg.br'),
  ('Unidade Acadêmica de Ituiutaba', 'ITUIUTABA', 'Ituiutaba', 'Rua Vereador Geraldo Moisés da Silva, s/n', '(34) 3271-8400', 'ituiutaba@uemg.br'),
  ('Unidade Acadêmica de João Monlevade', 'JOAO_MONLEVADE', 'João Monlevade', 'Av. Primeiro de Junho, 1043', '(31) 3859-1034', 'joaomonlevade@uemg.br'),
  ('Unidade Acadêmica de Leopoldina', 'LEOPOLDINA', 'Leopoldina', 'Praça Doutor João Pinheiro, 17', '(32) 3441-5599', 'leopoldina@uemg.br'),
  ('Unidade Acadêmica de Passos', 'PASSOS', 'Passos', 'Av. Juca Stockler, 1130', '(35) 3529-2700', 'passos@uemg.br'),
  ('Unidade Acadêmica de Poços de Caldas', 'POCOS_CALDAS', 'Poços de Caldas', 'Av. José do Patrocínio Pontes, 1001', '(35) 3697-4400', 'pocoscaldas@uemg.br'),
  ('Unidade Acadêmica de Ubá', 'UBA', 'Ubá', 'Av. Olegário Maciel, 1427', '(32) 3539-5300', 'uba@uemg.br'),
  ('Unidade Acadêmica de Campanha', 'CAMPANHA', 'Campanha', 'Rua Brigadeiro Eduardo Gomes, 1001', '(35) 3231-4100', 'campanha@uemg.br');

-- Insert sample courses for different units
INSERT INTO cursos (unidade_id, nome, codigo, modalidade, duracao_semestres, coordenador) VALUES
  -- Belo Horizonte
  ((SELECT id FROM unidades WHERE codigo = 'BH'), 'Ciência da Computação', 'CC', 'presencial', 8, 'Prof. Dr. João Silva'),
  ((SELECT id FROM unidades WHERE codigo = 'BH'), 'Engenharia de Software', 'ES', 'presencial', 8, 'Prof. Dr. Maria Santos'),
  ((SELECT id FROM unidades WHERE codigo = 'BH'), 'Sistemas de Informação', 'SI', 'presencial', 8, 'Prof. Dr. Carlos Lima'),
  ((SELECT id FROM unidades WHERE codigo = 'BH'), 'Design Gráfico', 'DG', 'presencial', 6, 'Prof. Dra. Ana Costa'),
  
  -- Barbacena
  ((SELECT id FROM unidades WHERE codigo = 'BARBACENA'), 'Administração', 'ADM', 'presencial', 8, 'Prof. Dr. Pedro Oliveira'),
  ((SELECT id FROM unidades WHERE codigo = 'BARBACENA'), 'Pedagogia', 'PED', 'presencial', 8, 'Prof. Dra. Lucia Ferreira'),
  ((SELECT id FROM unidades WHERE codigo = 'BARBACENA'), 'Educação Física', 'EF', 'presencial', 8, 'Prof. Dr. Roberto Alves'),
  
  -- Divinópolis
  ((SELECT id FROM unidades WHERE codigo = 'DIVINOPOLIS'), 'Engenharia Civil', 'EC', 'presencial', 10, 'Prof. Dr. Fernando Costa'),
  ((SELECT id FROM unidades WHERE codigo = 'DIVINOPOLIS'), 'Arquitetura e Urbanismo', 'AU', 'presencial', 10, 'Prof. Dra. Beatriz Rocha'),
  ((SELECT id FROM unidades WHERE codigo = 'DIVINOPOLIS'), 'Engenharia de Produção', 'EP', 'presencial', 10, 'Prof. Dr. Marcos Vieira'),
  
  -- Frutal
  ((SELECT id FROM unidades WHERE codigo = 'FRUTAL'), 'Medicina Veterinária', 'MV', 'presencial', 10, 'Prof. Dr. Antonio Ribeiro'),
  ((SELECT id FROM unidades WHERE codigo = 'FRUTAL'), 'Zootecnia', 'ZOO', 'presencial', 8, 'Prof. Dr. José Martins'),
  ((SELECT id FROM unidades WHERE codigo = 'FRUTAL'), 'Agronomia', 'AGR', 'presencial', 10, 'Prof. Dra. Sandra Campos'),
  
  -- Passos
  ((SELECT id FROM unidades WHERE codigo = 'PASSOS'), 'Enfermagem', 'ENF', 'presencial', 8, 'Prof. Dra. Helena Souza'),
  ((SELECT id FROM unidades WHERE codigo = 'PASSOS'), 'Fisioterapia', 'FISIO', 'presencial', 8, 'Prof. Dr. Ricardo Nunes'),
  ((SELECT id FROM unidades WHERE codigo = 'PASSOS'), 'Farmácia', 'FARM', 'presencial', 10, 'Prof. Dra. Carla Mendes');

-- Insert questionnaire templates
INSERT INTO questionarios_templates (titulo, descricao, categoria, periodicidade, obrigatorio) VALUES
  ('Avaliação do Projeto Pedagógico', 'Questionário para avaliar a adequação do projeto pedagógico do curso', 'projeto_pedagogico', 'anual', true),
  ('Satisfação com o Curso', 'Avaliação geral da satisfação do egresso com o curso realizado', 'satisfacao_curso', 'anual', true),
  ('Empregabilidade e Mercado de Trabalho', 'Questionário sobre inserção no mercado de trabalho', 'empregabilidade', 'semestral', false),
  ('Avaliação dos Docentes', 'Feedback sobre a qualidade do corpo docente', 'docentes', 'anual', false),
  ('Infraestrutura e Recursos', 'Avaliação da infraestrutura física e recursos disponíveis', 'infraestrutura', 'bianual', false);

-- Insert question templates for pedagogical project evaluation
INSERT INTO perguntas_templates (questionario_template_id, pergunta, tipo, opcoes, obrigatoria, ordem, categoria_resposta, peso) VALUES
  -- Projeto Pedagógico
  ((SELECT id FROM questionarios_templates WHERE titulo = 'Avaliação do Projeto Pedagógico'), 
   'Como você avalia a adequação do currículo do seu curso às demandas do mercado de trabalho?', 
   'escala_likert', 
   ARRAY['Muito inadequado', 'Inadequado', 'Neutro', 'Adequado', 'Muito adequado'], 
   true, 1, 'adequacao_curriculo', 3),
   
  ((SELECT id FROM questionarios_templates WHERE titulo = 'Avaliação do Projeto Pedagógico'), 
   'O curso proporcionou conhecimentos teóricos suficientes para sua atuação profissional?', 
   'escala_likert', 
   ARRAY['Discordo totalmente', 'Discordo', 'Neutro', 'Concordo', 'Concordo totalmente'], 
   true, 2, 'conhecimento_teorico', 3),
   
  ((SELECT id FROM questionarios_templates WHERE titulo = 'Avaliação do Projeto Pedagógico'), 
   'O curso proporcionou conhecimentos práticos suficientes para sua atuação profissional?', 
   'escala_likert', 
   ARRAY['Discordo totalmente', 'Discordo', 'Neutro', 'Concordo', 'Concordo totalmente'], 
   true, 3, 'conhecimento_pratico', 3),
   
  ((SELECT id FROM questionarios_templates WHERE titulo = 'Avaliação do Projeto Pedagógico'), 
   'Quais disciplinas você considera que deveriam ser incluídas ou ter maior carga horária?', 
   'texto', 
   NULL, 
   false, 4, 'sugestao_disciplinas', 2),
   
  ((SELECT id FROM questionarios_templates WHERE titulo = 'Avaliação do Projeto Pedagógico'), 
   'Como você avalia a metodologia de ensino utilizada no curso?', 
   'escala_likert', 
   ARRAY['Muito ruim', 'Ruim', 'Regular', 'Boa', 'Excelente'], 
   true, 5, 'metodologia_ensino', 3),
   
  ((SELECT id FROM questionarios_templates WHERE titulo = 'Avaliação do Projeto Pedagógico'), 
   'O estágio supervisionado contribuiu para sua formação profissional?', 
   'escala_likert', 
   ARRAY['Não contribuiu', 'Contribuiu pouco', 'Contribuiu moderadamente', 'Contribuiu muito', 'Contribuiu extremamente'], 
   true, 6, 'estagio_supervisionado', 3),
   
  ((SELECT id FROM questionarios_templates WHERE titulo = 'Avaliação do Projeto Pedagógico'), 
   'Como você avalia o processo de orientação do TCC/Trabalho de Conclusão?', 
   'escala_likert', 
   ARRAY['Muito ruim', 'Ruim', 'Regular', 'Bom', 'Excelente'], 
   true, 7, 'orientacao_tcc', 2);

-- Insert question templates for course satisfaction
INSERT INTO perguntas_templates (questionario_template_id, pergunta, tipo, opcoes, obrigatoria, ordem, categoria_resposta, peso) VALUES
  ((SELECT id FROM questionarios_templates WHERE titulo = 'Satisfação com o Curso'), 
   'De forma geral, como você avalia o curso que realizou?', 
   'escala_likert', 
   ARRAY['Muito insatisfeito', 'Insatisfeito', 'Neutro', 'Satisfeito', 'Muito satisfeito'], 
   true, 1, 'satisfacao_geral', 5),
   
  ((SELECT id FROM questionarios_templates WHERE titulo = 'Satisfação com o Curso'), 
   'Você recomendaria este curso para outras pessoas?', 
   'escala_likert', 
   ARRAY['Definitivamente não', 'Provavelmente não', 'Talvez', 'Provavelmente sim', 'Definitivamente sim'], 
   true, 2, 'recomendacao_curso', 4),
   
  ((SELECT id FROM questionarios_templates WHERE titulo = 'Satisfação com o Curso'), 
   'Quais foram os principais pontos positivos do curso?', 
   'checkbox', 
   ARRAY['Qualidade dos professores', 'Conteúdo atualizado', 'Infraestrutura', 'Metodologia de ensino', 'Estágios', 'Pesquisa/Extensão', 'Relacionamento interpessoal'], 
   false, 3, 'pontos_positivos', 2),
   
  ((SELECT id FROM questionarios_templates WHERE titulo = 'Satisfação com o Curso'), 
   'Quais foram os principais pontos que precisam melhorar?', 
   'checkbox', 
   ARRAY['Qualidade dos professores', 'Atualização do conteúdo', 'Infraestrutura', 'Metodologia de ensino', 'Estágios', 'Pesquisa/Extensão', 'Biblioteca', 'Laboratórios'], 
   false, 4, 'pontos_melhoria', 3);

-- Insert question templates for employability
INSERT INTO perguntas_templates (questionario_template_id, pergunta, tipo, opcoes, obrigatoria, ordem, categoria_resposta, peso) VALUES
  ((SELECT id FROM questionarios_templates WHERE titulo = 'Empregabilidade e Mercado de Trabalho'), 
   'Qual sua situação profissional atual?', 
   'multipla_escolha', 
   ARRAY['Empregado na área de formação', 'Empregado fora da área', 'Desempregado', 'Empreendedor', 'Estudando (pós-graduação)', 'Concursado'], 
   true, 1, 'situacao_profissional', 5),
   
  ((SELECT id FROM questionarios_templates WHERE titulo = 'Empregabilidade e Mercado de Trabalho'), 
   'Em quanto tempo após a formatura você conseguiu o primeiro emprego?', 
   'multipla_escolha', 
   ARRAY['Já estava empregado', 'Menos de 3 meses', '3 a 6 meses', '6 meses a 1 ano', 'Mais de 1 ano', 'Ainda não consegui'], 
   true, 2, 'tempo_primeiro_emprego', 4),
   
  ((SELECT id FROM questionarios_templates WHERE titulo = 'Empregabilidade e Mercado de Trabalho'), 
   'Como você avalia sua preparação para o mercado de trabalho?', 
   'escala_likert', 
   ARRAY['Muito mal preparado', 'Mal preparado', 'Razoavelmente preparado', 'Bem preparado', 'Muito bem preparado'], 
   true, 3, 'preparacao_mercado', 4);

-- Create sample active questionnaires
INSERT INTO questionarios (titulo, descricao, data_aplicacao, data_fim, questionario_template_id, unidade_id, ativo) VALUES
  ('Avaliação Projeto Pedagógico 2024.1', 'Avaliação do projeto pedagógico - primeiro semestre 2024', now(), now() + interval '60 days', 
   (SELECT id FROM questionarios_templates WHERE titulo = 'Avaliação do Projeto Pedagógico'), 
   (SELECT id FROM unidades WHERE codigo = 'BH'), true),
   
  ('Satisfação com Curso 2024', 'Pesquisa de satisfação com o curso - 2024', now(), now() + interval '45 days', 
   (SELECT id FROM questionarios_templates WHERE titulo = 'Satisfação com o Curso'), 
   (SELECT id FROM unidades WHERE codigo = 'BH'), true),
   
  ('Empregabilidade 2024.1', 'Pesquisa sobre empregabilidade dos egressos', now(), now() + interval '30 days', 
   (SELECT id FROM questionarios_templates WHERE titulo = 'Empregabilidade e Mercado de Trabalho'), 
   (SELECT id FROM unidades WHERE codigo = 'BH'), true);