import React, { useState, useEffect } from 'react'
import { FileText, Clock, Users, CheckCircle, AlertCircle, GraduationCap, Plus } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import CadastroQuestionario from './CadastroQuestionario'

interface QuestionarioAluno {
  id: string
  titulo: string
  descricao: string | null
  categoria: string
  publico_alvo: string
  semestre_aplicacao: string | null
  data_inicio: string
  data_fim: string | null
  obrigatorio: boolean
  anonimo: boolean
  respondido?: boolean
  total_respostas?: number
}

const QuestionariosAlunos: React.FC = () => {
  const { user, profile } = useAuth()
  const [questionarios, setQuestionarios] = useState<QuestionarioAluno[]>([])
  const [activeView, setActiveView] = useState<'list' | 'create'>('list')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchQuestionarios()
  }, [user])

  const fetchQuestionarios = async () => {
    try {
      // Mock data for demo
      if (import.meta.env.VITE_SUPABASE_URL === 'https://demo.supabase.co' || 
          !import.meta.env.VITE_SUPABASE_URL) {
        const mockQuestionarios: QuestionarioAluno[] = [
          {
            id: '1',
            titulo: 'Avaliação da Satisfação Acadêmica 2024.1',
            descricao: 'Questionário para avaliar a satisfação dos alunos com o curso e a instituição',
            categoria: 'satisfacao_academica',
            publico_alvo: 'todos',
            semestre_aplicacao: '2024.1',
            data_inicio: new Date().toISOString(),
            data_fim: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            obrigatorio: false,
            anonimo: true,
            respondido: false,
            total_respostas: 156
          },
          {
            id: '2',
            titulo: 'Avaliação da Infraestrutura Universitária',
            descricao: 'Pesquisa sobre a qualidade da infraestrutura física da universidade',
            categoria: 'infraestrutura',
            publico_alvo: 'todos',
            semestre_aplicacao: '2024.1',
            data_inicio: new Date().toISOString(),
            data_fim: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
            obrigatorio: false,
            anonimo: true,
            respondido: true,
            total_respostas: 89
          },
          {
            id: '3',
            titulo: 'Pesquisa sobre Serviços da Biblioteca',
            descricao: 'Avaliação dos serviços oferecidos pela biblioteca universitária',
            categoria: 'biblioteca',
            publico_alvo: 'todos',
            semestre_aplicacao: '2024.1',
            data_inicio: new Date().toISOString(),
            data_fim: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
            obrigatorio: false,
            anonimo: true,
            respondido: false,
            total_respostas: 67
          },
          {
            id: '4',
            titulo: 'Avaliação dos Laboratórios de Ensino',
            descricao: 'Questionário sobre a qualidade e adequação dos laboratórios',
            categoria: 'laboratorios',
            publico_alvo: 'todos',
            semestre_aplicacao: '2024.1',
            data_inicio: new Date().toISOString(),
            data_fim: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            obrigatorio: false,
            anonimo: true,
            respondido: false,
            total_respostas: 43
          },
          {
            id: '5',
            titulo: 'Pesquisa de Integração - Calouros 2024',
            descricao: 'Questionário específico para avaliar a adaptação dos novos alunos',
            categoria: 'vida_academica',
            publico_alvo: 'calouros',
            semestre_aplicacao: '2024.1',
            data_inicio: new Date().toISOString(),
            data_fim: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
            obrigatorio: true,
            anonimo: true,
            respondido: false,
            total_respostas: 234
          }
        ]
        
        setQuestionarios(mockQuestionarios)
        setLoading(false)
        return
      }

      // Real Supabase query would go here
      setLoading(false)
    } catch (error) {
      console.error('Error fetching questionarios:', error)
      setLoading(false)
    }
  }

  const getCategoryColor = (categoria: string) => {
    const colors = {
      satisfacao_academica: 'bg-blue-100 text-blue-800',
      infraestrutura: 'bg-orange-100 text-orange-800',
      servicos_estudantis: 'bg-green-100 text-green-800',
      biblioteca: 'bg-purple-100 text-purple-800',
      laboratorios: 'bg-red-100 text-red-800',
      cantina: 'bg-yellow-100 text-yellow-800',
      coordenacao: 'bg-indigo-100 text-indigo-800',
      secretaria: 'bg-pink-100 text-pink-800',
      vida_academica: 'bg-teal-100 text-teal-800',
      extensao: 'bg-emerald-100 text-emerald-800',
      pesquisa: 'bg-cyan-100 text-cyan-800'
    }
    return colors[categoria as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  // Show create form for coordinators
  if (activeView === 'create') {
    return <CadastroQuestionario />
  }

  const getCategoryLabel = (categoria: string) => {
    const labels = {
      satisfacao_academica: 'Satisfação Acadêmica',
      infraestrutura: 'Infraestrutura',
      servicos_estudantis: 'Serviços Estudantis',
      biblioteca: 'Biblioteca',
      laboratorios: 'Laboratórios',
      cantina: 'Cantina',
      coordenacao: 'Coordenação',
      secretaria: 'Secretaria',
      vida_academica: 'Vida Acadêmica',
      extensao: 'Extensão',
      pesquisa: 'Pesquisa'
    }
    return labels[categoria as keyof typeof labels] || categoria
  }

  const getPublicoAlvoLabel = (publico: string) => {
    const labels = {
      todos: 'Todos os alunos',
      calouros: 'Calouros',
      veteranos: 'Veteranos',
      formandos: 'Formandos',
      pos_graduacao: 'Pós-graduação'
    }
    return labels[publico as keyof typeof labels] || publico
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
      <div className="flex items-center space-x-3">
        <GraduationCap className="w-8 h-8 text-blue-600" />
        <div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Questionários para Alunos</h1>
              <p className="mt-1 text-sm text-gray-600">
                {profile?.role === 'coordenacao' 
                  ? 'Gerencie questionários para coletar feedback dos alunos'
                  : 'Contribua com sua opinião para melhorar a qualidade do ensino e dos serviços da UEMG'
                }
              </p>
            </div>
            {profile?.role === 'coordenacao' && (
              <button
                onClick={() => setActiveView('create')}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar Questionário
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Disponíveis</p>
              <p className="text-2xl font-bold text-gray-900">{questionarios.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Respondidos</p>
              <p className="text-2xl font-bold text-gray-900">
                {questionarios.filter(q => q.respondido).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Obrigatórios</p>
              <p className="text-2xl font-bold text-gray-900">
                {questionarios.filter(q => q.obrigatorio && !q.respondido).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Respostas</p>
              <p className="text-2xl font-bold text-gray-900">
                {questionarios.reduce((acc, q) => acc + (q.total_respostas || 0), 0)}
              </p>
            </div>
          </div>
        </div>
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
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(questionario.categoria)}`}>
                          {getCategoryLabel(questionario.categoria)}
                        </span>
                        {questionario.obrigatorio && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Obrigatório
                          </span>
                        )}
                        {questionario.anonimo && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Anônimo
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-600 mb-3">
                        {questionario.descricao}
                      </p>

                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        <span className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {getPublicoAlvoLabel(questionario.publico_alvo)}
                        </span>
                        {questionario.semestre_aplicacao && (
                          <span>Semestre: {questionario.semestre_aplicacao}</span>
                        )}
                      </div>
                      
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

      {/* Informações Adicionais */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          Por que responder aos questionários?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div className="flex items-start space-x-2">
            <CheckCircle className="w-4 h-4 mt-0.5 text-blue-600" />
            <span>Contribuir para a melhoria contínua dos cursos</span>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle className="w-4 h-4 mt-0.5 text-blue-600" />
            <span>Influenciar decisões sobre infraestrutura</span>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle className="w-4 h-4 mt-0.5 text-blue-600" />
            <span>Melhorar a qualidade dos serviços oferecidos</span>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle className="w-4 h-4 mt-0.5 text-blue-600" />
            <span>Fortalecer a comunicação institucional</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuestionariosAlunos