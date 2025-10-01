/*
  # Questionários Específicos para Egressos - UEMG

  1. New Questionnaire Templates
    - Questionário de Inserção Profissional
    - Questionário de Formação Continuada e Satisfação

  2. Questions
    - Perguntas específicas sobre empregabilidade
    - Perguntas sobre continuidade dos estudos
    - Avaliações de satisfação e competências

  3. Data
    - Templates de questionários para egressos
    - Perguntas estruturadas conforme exemplos fornecidos
*/

-- Insert questionnaire templates for egressos
INSERT INTO questionarios_templates (titulo, descricao, categoria, periodicidade, obrigatorio) VALUES
  ('Questionário de Inserção Profissional', 'Avaliar a empregabilidade e a relevância da formação recebida pelos egressos', 'empregabilidade', 'anual', false),
  ('Questionário de Formação Continuada e Satisfação', 'Entender a continuidade dos estudos e a percepção sobre o curso', 'satisfacao_curso', 'anual', false);

-- Insert questions for Inserção Profissional questionnaire
INSERT INTO perguntas_templates (questionario_template_id, pergunta, tipo, opcoes, obrigatoria, ordem, categoria_resposta, peso) VALUES
  -- Inserção Profissional
  ((SELECT id FROM questionarios_templates WHERE titulo = 'Questionário de Inserção Profissional'),
   'Ano de conclusão do curso',
   'escala_numerica',
   NULL,
   true, 1, 'ano_conclusao', 2),

  ((SELECT id FROM questionarios_templates WHERE titulo = 'Questionário de Inserção Profissional'),
   'Você está atualmente empregado?',
   'multipla_escolha',
   ARRAY['Sim, na área de formação', 'Sim, mas em outra área', 'Não estou empregado'],
   true, 2, 'situacao_emprego', 5),

  ((SELECT id FROM questionarios_templates WHERE titulo = 'Questionário de Inserção Profissional'),
   'Tempo até conseguir o primeiro emprego após a graduação:',
   'multipla_escolha',
   ARRAY['Menos de 6 meses', 'Entre 6 e 12 meses', 'Mais de 12 meses', 'Ainda não consegui emprego'],
   true, 3, 'tempo_primeiro_emprego', 4),

  ((SELECT id FROM questionarios_templates WHERE titulo = 'Questionário de Inserção Profissional'),
   'Tipo de vínculo atual:',
   'multipla_escolha',
   ARRAY['CLT', 'Estágio', 'Autônomo / Freelancer', 'Empreendedor', 'Outro'],
   true, 4, 'tipo_vinculo', 3),

  ((SELECT id FROM questionarios_templates WHERE titulo = 'Questionário de Inserção Profissional'),
   'Se selecionou "Outro" no tipo de vínculo, especifique:',
   'texto',
   NULL,
   false, 5, 'outro_vinculo', 1),

  ((SELECT id FROM questionarios_templates WHERE titulo = 'Questionário de Inserção Profissional'),
   'Em uma escala de 1 a 5, avalie o quanto o curso contribuiu para sua inserção profissional',
   'escala_likert',
   ARRAY['1 - Não contribuiu', '2 - Contribuiu pouco', '3 - Contribuiu moderadamente', '4 - Contribuiu muito', '5 - Contribuiu extremamente'],
   true, 6, 'contribuicao_curso', 5),

  ((SELECT id FROM questionarios_templates WHERE titulo = 'Questionário de Inserção Profissional'),
   'Sugestões de melhorias na formação para aumentar a empregabilidade:',
   'texto',
   NULL,
   false, 7, 'sugestoes_empregabilidade', 3),

  -- Formação Continuada e Satisfação
  ((SELECT id FROM questionarios_templates WHERE titulo = 'Questionário de Formação Continuada e Satisfação'),
   'Após a graduação, você realizou algum curso de pós-graduação?',
   'multipla_escolha',
   ARRAY['Especialização', 'Mestrado', 'Doutorado', 'MBA', 'Não realizei'],
   true, 1, 'pos_graduacao', 4),

  ((SELECT id FROM questionarios_templates WHERE titulo = 'Questionário de Formação Continuada e Satisfação'),
   'O curso contribuiu para que você se sentisse preparado para continuar estudando?',
   'multipla_escolha',
   ARRAY['Sim, totalmente', 'Parcialmente', 'Não'],
   true, 2, 'preparacao_estudos', 4),

  ((SELECT id FROM questionarios_templates WHERE titulo = 'Questionário de Formação Continuada e Satisfação'),
   'Em uma escala de 1 a 5, avalie sua satisfação geral com a formação recebida',
   'escala_likert',
   ARRAY['1 - Muito insatisfeito', '2 - Insatisfeito', '3 - Neutro', '4 - Satisfeito', '5 - Muito satisfeito'],
   true, 3, 'satisfacao_geral', 5),

  ((SELECT id FROM questionarios_templates WHERE titulo = 'Questionário de Formação Continuada e Satisfação'),
   'Quais competências adquiridas no curso você mais utiliza atualmente?',
   'texto',
   NULL,
   false, 4, 'competencias_utilizadas', 3),

  ((SELECT id FROM questionarios_templates WHERE titulo = 'Questionário de Formação Continuada e Satisfação'),
   'O que você considera que deveria ter sido melhor trabalhado durante o curso?',
   'texto',
   NULL,
   false, 5, 'melhorias_curso', 4),

  ((SELECT id FROM questionarios_templates WHERE titulo = 'Questionário de Formação Continuada e Satisfação'),
   'Você participaria de eventos de ex-alunos promovidos pela instituição?',
   'multipla_escolha',
   ARRAY['Sim', 'Talvez', 'Não'],
   true, 6, 'participacao_eventos', 2);

-- Create active questionnaires based on the new templates
INSERT INTO questionarios (titulo, descricao, data_aplicacao, data_fim, questionario_template_id, unidade_id, ativo) VALUES
  ('Pesquisa de Inserção Profissional 2024', 'Avaliação da empregabilidade dos egressos da UEMG', now(), now() + interval '90 days', 
   (SELECT id FROM questionarios_templates WHERE titulo = 'Questionário de Inserção Profissional'), 
   (SELECT id FROM unidades WHERE codigo = 'BH'), true),
   
  ('Pesquisa de Formação Continuada 2024', 'Avaliação da satisfação e continuidade dos estudos dos egressos', now(), now() + interval '90 days', 
   (SELECT id FROM questionarios_templates WHERE titulo = 'Questionário de Formação Continuada e Satisfação'), 
   (SELECT id FROM unidades WHERE codigo = 'BH'), true);