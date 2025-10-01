export interface Database {
  public: {
    Tables: {
      unidades: {
        Row: {
          id: string
          nome: string
          codigo: string
          cidade: string
          endereco: string | null
          telefone: string | null
          email: string | null
          diretor: string | null
          ativo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nome: string
          codigo: string
          cidade: string
          endereco?: string | null
          telefone?: string | null
          email?: string | null
          diretor?: string | null
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome?: string
          codigo?: string
          cidade?: string
          endereco?: string | null
          telefone?: string | null
          email?: string | null
          diretor?: string | null
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      cursos: {
        Row: {
          id: string
          unidade_id: string
          nome: string
          codigo: string
          modalidade: 'presencial' | 'ead' | 'hibrido'
          duracao_semestres: number
          coordenador: string | null
          ativo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          unidade_id: string
          nome: string
          codigo: string
          modalidade?: 'presencial' | 'ead' | 'hibrido'
          duracao_semestres?: number
          coordenador?: string | null
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          unidade_id?: string
          nome?: string
          codigo?: string
          modalidade?: 'presencial' | 'ead' | 'hibrido'
          duracao_semestres?: number
          coordenador?: string | null
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      questionarios_templates: {
        Row: {
          id: string
          titulo: string
          descricao: string | null
          categoria: 'empregabilidade' | 'satisfacao_curso' | 'projeto_pedagogico' | 'infraestrutura' | 'docentes' | 'geral'
          periodicidade: 'semestral' | 'anual' | 'bianual' | 'eventual'
          obrigatorio: boolean
          ativo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          titulo: string
          descricao?: string | null
          categoria: 'empregabilidade' | 'satisfacao_curso' | 'projeto_pedagogico' | 'infraestrutura' | 'docentes' | 'geral'
          periodicidade?: 'semestral' | 'anual' | 'bianual' | 'eventual'
          obrigatorio?: boolean
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          titulo?: string
          descricao?: string | null
          categoria?: 'empregabilidade' | 'satisfacao_curso' | 'projeto_pedagogico' | 'infraestrutura' | 'docentes' | 'geral'
          periodicidade?: 'semestral' | 'anual' | 'bianual' | 'eventual'
          obrigatorio?: boolean
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      perguntas_templates: {
        Row: {
          id: string
          questionario_template_id: string
          pergunta: string
          tipo: 'multipla_escolha' | 'texto' | 'escala_likert' | 'checkbox' | 'escala_numerica'
          opcoes: string[] | null
          obrigatoria: boolean
          ordem: number
          categoria_resposta: string | null
          peso: number
          created_at: string
        }
        Insert: {
          id?: string
          questionario_template_id: string
          pergunta: string
          tipo: 'multipla_escolha' | 'texto' | 'escala_likert' | 'checkbox' | 'escala_numerica'
          opcoes?: string[] | null
          obrigatoria?: boolean
          ordem: number
          categoria_resposta?: string | null
          peso?: number
          created_at?: string
        }
        Update: {
          id?: string
          questionario_template_id?: string
          pergunta?: string
          tipo?: 'multipla_escolha' | 'texto' | 'escala_likert' | 'checkbox' | 'escala_numerica'
          opcoes?: string[] | null
          obrigatoria?: boolean
          ordem?: number
          categoria_resposta?: string | null
          peso?: number
          created_at?: string
        }
      }
      respostas_questionarios: {
        Row: {
          id: string
          egresso_id: string
          questionario_id: string
          pergunta_template_id: string
          resposta: string
          valor_numerico: number | null
          categoria_resposta: string | null
          created_at: string
        }
        Insert: {
          id?: string
          egresso_id: string
          questionario_id: string
          pergunta_template_id: string
          resposta: string
          valor_numerico?: number | null
          categoria_resposta?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          egresso_id?: string
          questionario_id?: string
          pergunta_template_id?: string
          resposta?: string
          valor_numerico?: number | null
          categoria_resposta?: string | null
          created_at?: string
        }
      }
      feedback_pedagogico: {
        Row: {
          id: string
          curso_id: string
          questionario_id: string
          categoria: 'curriculo' | 'metodologia' | 'avaliacao' | 'estagio' | 'tcc' | 'laboratorios' | 'biblioteca' | 'docentes'
          indicador: string
          valor_medio: number
          total_respostas: number
          periodo_referencia: string
          observacoes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          curso_id: string
          questionario_id: string
          categoria: 'curriculo' | 'metodologia' | 'avaliacao' | 'estagio' | 'tcc' | 'laboratorios' | 'biblioteca' | 'docentes'
          indicador: string
          valor_medio: number
          total_respostas: number
          periodo_referencia: string
          observacoes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          curso_id?: string
          questionario_id?: string
          categoria?: 'curriculo' | 'metodologia' | 'avaliacao' | 'estagio' | 'tcc' | 'laboratorios' | 'biblioteca' | 'docentes'
          indicador?: string
          valor_medio?: number
          total_respostas?: number
          periodo_referencia?: string
          observacoes?: string | null
          created_at?: string
        }
      }
      acoes_corretivas: {
        Row: {
          id: string
          curso_id: string
          feedback_id: string | null
          titulo: string
          descricao: string
          categoria: 'curriculo' | 'metodologia' | 'infraestrutura' | 'docentes' | 'recursos' | 'estagio'
          prioridade: 'baixa' | 'media' | 'alta' | 'critica'
          status: 'planejada' | 'em_andamento' | 'concluida' | 'cancelada'
          responsavel: string | null
          prazo_execucao: string | null
          data_conclusao: string | null
          resultados_obtidos: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          curso_id: string
          feedback_id?: string | null
          titulo: string
          descricao: string
          categoria: 'curriculo' | 'metodologia' | 'infraestrutura' | 'docentes' | 'recursos' | 'estagio'
          prioridade?: 'baixa' | 'media' | 'alta' | 'critica'
          status?: 'planejada' | 'em_andamento' | 'concluida' | 'cancelada'
          responsavel?: string | null
          prazo_execucao?: string | null
          data_conclusao?: string | null
          resultados_obtidos?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          curso_id?: string
          feedback_id?: string | null
          titulo?: string
          descricao?: string
          categoria?: 'curriculo' | 'metodologia' | 'infraestrutura' | 'docentes' | 'recursos' | 'estagio'
          prioridade?: 'baixa' | 'media' | 'alta' | 'critica'
          status?: 'planejada' | 'em_andamento' | 'concluida' | 'cancelada'
          responsavel?: string | null
          prazo_execucao?: string | null
          data_conclusao?: string | null
          resultados_obtidos?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          role: 'egresso' | 'coordenacao' | 'secretaria' | 'professor' | 'administracao'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          role: 'egresso' | 'coordenacao' | 'secretaria' | 'professor' | 'administracao'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          role?: 'egresso' | 'coordenacao' | 'secretaria' | 'professor' | 'administracao'
          created_at?: string
          updated_at?: string
        }
      }
      egressos: {
        Row: {
          id: string
          profile_id: string
          curso: string
          ano_conclusao: number
          telefone: string | null
          endereco: string | null
          status_profissional: string | null
          empresa_atual: string | null
          cargo_atual: string | null
          formacao_continuada: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          curso: string
          ano_conclusao: number
          telefone?: string | null
          endereco?: string | null
          status_profissional?: string | null
          empresa_atual?: string | null
          cargo_atual?: string | null
          formacao_continuada?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          curso?: string
          ano_conclusao?: number
          telefone?: string | null
          endereco?: string | null
          status_profissional?: string | null
          empresa_atual?: string | null
          cargo_atual?: string | null
          formacao_continuada?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      questionarios: {
        Row: {
          id: string
          titulo: string
          descricao: string | null
          data_aplicacao: string
          data_fim: string | null
          ativo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          titulo: string
          descricao?: string | null
          data_aplicacao: string
          data_fim?: string | null
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          titulo?: string
          descricao?: string | null
          data_aplicacao?: string
          data_fim?: string | null
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      perguntas: {
        Row: {
          id: string
          questionario_id: string
          pergunta: string
          tipo: 'multipla_escolha' | 'texto' | 'escala' | 'checkbox'
          opcoes: string[] | null
          obrigatoria: boolean
          ordem: number
          created_at: string
        }
        Insert: {
          id?: string
          questionario_id: string
          pergunta: string
          tipo: 'multipla_escolha' | 'texto' | 'escala' | 'checkbox'
          opcoes?: string[] | null
          obrigatoria?: boolean
          ordem: number
          created_at?: string
        }
        Update: {
          id?: string
          questionario_id?: string
          pergunta?: string
          tipo?: 'multipla_escolha' | 'texto' | 'escala' | 'checkbox'
          opcoes?: string[] | null
          obrigatoria?: boolean
          ordem?: number
          created_at?: string
        }
      }
      respostas: {
        Row: {
          id: string
          egresso_id: string
          questionario_id: string
          pergunta_id: string
          resposta: string
          created_at: string
        }
        Insert: {
          id?: string
          egresso_id: string
          questionario_id: string
          pergunta_id: string
          resposta: string
          created_at?: string
        }
        Update: {
          id?: string
          egresso_id?: string
          questionario_id?: string
          pergunta_id?: string
          resposta?: string
          created_at?: string
        }
      }
      eventos: {
        Row: {
          id: string
          titulo: string
          descricao: string | null
          data_evento: string
          local: string | null
          vagas: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          titulo: string
          descricao?: string | null
          data_evento: string
          local?: string | null
          vagas?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          titulo?: string
          descricao?: string | null
          data_evento?: string
          local?: string | null
          vagas?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      evento_participantes: {
        Row: {
          id: string
          evento_id: string
          egresso_id: string
          status: 'inscrito' | 'presente' | 'ausente'
          created_at: string
        }
        Insert: {
          id?: string
          evento_id: string
          egresso_id: string
          status?: 'inscrito' | 'presente' | 'ausente'
          created_at?: string
        }
        Update: {
          id?: string
          evento_id?: string
          egresso_id?: string
          status?: 'inscrito' | 'presente' | 'ausente'
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}