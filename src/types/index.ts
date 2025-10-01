import { Database } from './database'

export type Unidade = Database['public']['Tables']['unidades']['Row']
export type Curso = Database['public']['Tables']['cursos']['Row']
export type QuestionarioTemplate = Database['public']['Tables']['questionarios_templates']['Row']
export type PerguntaTemplate = Database['public']['Tables']['perguntas_templates']['Row']
export type RespostaQuestionario = Database['public']['Tables']['respostas_questionarios']['Row']
export type FeedbackPedagogico = Database['public']['Tables']['feedback_pedagogico']['Row']
export type AcaoCorretiva = Database['public']['Tables']['acoes_corretivas']['Row']

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Egresso = Database['public']['Tables']['egressos']['Row']
export type Questionario = Database['public']['Tables']['questionarios']['Row']
export type Pergunta = Database['public']['Tables']['perguntas']['Row']
export type Resposta = Database['public']['Tables']['respostas']['Row']
export type Evento = Database['public']['Tables']['eventos']['Row']
export type EventoParticipante = Database['public']['Tables']['evento_participantes']['Row']

export type UserRole = 'egresso' | 'coordenacao' | 'secretaria' | 'professor' | 'administracao'

export interface EgressoProfile extends Egresso {
  profile: Profile
}

export interface QuestionarioComPerguntas extends Questionario {
  perguntas: Pergunta[]
}

export interface EventoComParticipantes extends Evento {
  participantes: EventoParticipante[]
}