import React, { useState, useEffect } from 'react'
import { FileText, Clock, Users, CheckCircle, AlertCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { Questionario, QuestionarioTemplate } from '../../types'

interface QuestionarioComTemplate extends Questionario {
  questionario_template?: QuestionarioTemplate
  total_respostas?: number
  respondido?: boolean
}

const QuestionariosList: React.FC = () => {
  const { user, profile } = useAuth()
  const [questionarios, setQuestionarios] = useState<QuestionarioComTemplate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchQuestionarios()
  }, [user])

  const fetchQuestionarios = async () => {
    try {
      // Mock data for demo
      if (import.meta.env.VITE_SUPABASE_URL === 'https://placeholder.supabase.co' || 
          !import.meta.env.VITE_SUPABASE_URL) {
        const mockQuestionarios: QuestionarioComTemplate[] = [
          {
            id: '1',
            titulo: 'Pesquisa de Inserção Profissional 2024',
            descricao: 'Avaliação da empregabilidade dos egressos da UEMG',
            data_aplicacao: new Date().toISOString(),
            data_fim: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
            ativo: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            questionario_template: {
              id: '1',
              titulo: 'Questionário de Inserção Profissional',
              descricao: 'Template para avaliação de empregabilidade',
              categoria: 'empregabilidade' as const,
              periodicidade: 'anual' as const,
              obrigatorio: false,
              ativo: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            total_respostas: 67,
            respondido: false
          },
          {
            id: '2',
            titulo: 'Pesquisa de Formação Continuada 2024',
            descricao: 'Avaliação da satisfação e continuidade dos estudos dos egressos',
            data_aplicacao: new Date().toISOString(),
            data_fim: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
            ativo: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            questionario_template: {
              id: '2',
              titulo: 'Questionário de Formação Continuada e Satisfação',
              descricao: 'Template para avaliação de satisfação e continuidade',
              categoria: 'satisfacao_curso' as const,
              periodicidade: 'anual' as const,
              obrigatorio: false,
              ativo: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            total_respostas: 54,
            respondido: false
          },
          {
            id: '3',
            titulo: 'Avaliação do Projeto Pedagógico 2024.1',
            descricao: 'Questionário para avaliar a adequação do projeto pedagógico do curso',
            data_aplicacao: new Date().toISOString(),
            data_fim: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
            ativo: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            questionario_template: {
              id: '3',
              titulo: 'Avaliação do Projeto Pedagógico',
              descricao: 'Template para avaliação pedagógica',
              categoria: 'projeto_pedagogico' as const,
              periodicidade: 'anual' as const,
              obrigatorio: false,
              ativo: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            total_respostas: 32,
            respondido: true
          },
          {
            id: '4',
            titulo: 'Satisfação com o Curso 2024',
            descricao: 'Pesquisa de satisfação geral com o curso realizado',
            data_aplicacao: new Date().toISOString(),
            data_fim: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
            ativo: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            questionario_template: {
              id: '4',
              titulo: 'Satisfação com o Curso',
              descricao: 'Template para avaliação de satisfação',
              categoria: 'satisfacao_curso' as const,
              periodicidade: 'anual' as const,
              obrigatorio: false,
              ativo: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            total_respostas: 28,
            respondido: true
          }
        ]
        
        setQuestionarios(mockQuestionarios)
        setLoading(false)
        return
      }

      // Real Supabase query
      const { data, error } = await supabase
        .from('questionarios')
        .select(`
          *,
          questionario_template:questionarios_templates(*)
        `)
        .eq('ativo', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      setQuestionarios(data || [])
    } catch (error) {
      console.error('Error fetching questionarios:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryColor = (categoria: string) => {
    const colors = {
      projeto_pedagogico: 'bg-blue-100 text-blue-800',
      satisfacao_curso: 'bg-green-100 text-green-800',
      empregabilidade: 'bg-purple-100 text-purple-800',
      infraestrutura: 'bg-orange-100 text-orange-800',
      docentes: 'bg-red-100 text-red-800',
      geral: 'bg-gray-100 text-gray-800'
    }
    return colors[categoria as keyof typeof colors] || colors.geral
  }

  const getCategoryLabel = (categoria: string) => {
    const labels = {
      projeto_pedagogico: 'Projeto Pedagógico',
      satisfacao_curso: 'Satisfação',
      empregabilidade: 'Empregabilidade',
      infraestrutura: 'Infraestrutura',
      docentes: 'Docentes',
      geral: 'Geral'
    }
    return labels[categoria as keyof typeof labels] || categoria
  }

  const isExpired = (dataFim: string | null) => {
    if (!dataFim) return false
    return new Date(dataFim) < new Date()
  }

  const getDaysRemaining = (dataFim: string | null) => {
    if (!dataFim) return null
    const days = Math.ceil((new Date(dataFim).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    return days > 0 ? days : 0
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Questionários</h1>
        <p className="mt-1 text-sm text-gray-600">
          Responda aos questionários para contribuir com a melhoria dos cursos
        </p>
      </div>

      {questionarios.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum questionário disponível
          </h3>
          <p className="text-gray-600">
            Não há questionários ativos no momento.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {questionarios.map((questionario) => {
            const expired = isExpired(questionario.data_fim)
            const daysRemaining = getDaysRemaining(questionario.data_fim)
            
            return (
              <div key={questionario.id} className="bg-white shadow rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {questionario.titulo}
                        </h3>
                        {questionario.questionario_template && (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(questionario.questionario_template.categoria)}`}>
                            {getCategoryLabel(questionario.questionario_template.categoria)}
                          </span>
                        )}
                        {questionario.questionario_template?.obrigatorio && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Obrigatório
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-600 mb-4">
                        {questionario.descricao}
                      </p>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {expired ? (
                            <span className="text-red-600 font-medium">Expirado</span>
                          ) : daysRemaining !== null ? (
                            <span>
                              {daysRemaining === 0 ? 'Último dia' : `${daysRemaining} dias restantes`}
                            </span>
                          ) : (
                            <span>Sem prazo definido</span>
                          )}
                        </div>
                        
                        {questionario.total_respostas !== undefined && (
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            <span>{questionario.total_respostas} respostas</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {questionario.respondido ? (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="w-5 h-5 mr-1" />
                          <span className="text-sm font-medium">Respondido</span>
                        </div>
                      ) : expired ? (
                        <div className="flex items-center text-red-600">
                          <AlertCircle className="w-5 h-5 mr-1" />
                          <span className="text-sm font-medium">Expirado</span>
                        </div>
                      ) : (
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                          Responder
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default QuestionariosList