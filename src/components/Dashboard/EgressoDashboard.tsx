import React, { useState, useEffect } from 'react'
import { FileText, Calendar, User, TrendingUp, Facebook, Instagram, Linkedin, ExternalLink, Users, MessageCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { Questionario, Evento } from '../../types'

const EgressoDashboard: React.FC = () => {
  const { user } = useAuth()
  const [questionarios, setQuestionarios] = useState<Questionario[]>([])
  const [eventos, setEventos] = useState<Evento[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    try {
      // Skip data fetch if using placeholder Supabase
      if (import.meta.env.VITE_SUPABASE_URL === 'https://placeholder.supabase.co' || 
          !import.meta.env.VITE_SUPABASE_URL) {
        // Set mock data
        setQuestionarios([
          {
            id: '1',
            titulo: 'Pesquisa de Inserção Profissional 2024',
            descricao: 'Avaliação da empregabilidade dos egressos da UEMG',
            data_aplicacao: new Date().toISOString(),
            data_fim: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
            ativo: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: '2',
            titulo: 'Pesquisa de Formação Continuada 2024',
            descricao: 'Avaliação da satisfação e continuidade dos estudos dos egressos',
            data_aplicacao: new Date().toISOString(),
            data_fim: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
            ativo: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: '3',
            titulo: 'Avaliação do Projeto Pedagógico 2024.1',
            descricao: 'Questionário para avaliar a adequação do projeto pedagógico do curso',
            data_aplicacao: new Date().toISOString(),
            data_fim: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
            ativo: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        setEventos([
          {
            id: '1',
            titulo: 'Encontro de Egressos 2024',
            descricao: 'Evento anual de networking entre egressos',
            data_evento: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
            local: 'Auditório Central',
            vagas: 100,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        setLoading(false)
        return
      }

      // Buscar questionários ativos
      const { data: questData } = await supabase
        .from('questionarios')
        .select('*')
        .eq('ativo', true)
        .order('created_at', { ascending: false })
        .limit(3)

      // Buscar próximos eventos
      const { data: eventData } = await supabase
        .from('eventos')
        .select('*')
        .gte('data_evento', new Date().toISOString())
        .order('data_evento', { ascending: true })
        .limit(3)

      setQuestionarios(questData || [])
      setEventos(eventData || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const stats = [
    {
      name: 'Perfil',
      value: 'Atualizado',
      icon: User,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Questionários',
      value: `${questionarios.length}`,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Próximos Eventos',
      value: `${eventos.length}`,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      name: 'Status',
      value: 'Ativo',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Bem-vindo ao sistema de acompanhamento de egressos
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`p-2 ${stat.bgColor} rounded-lg`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
                <div className="ml-4 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Questionários Disponíveis */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Questionários Disponíveis
            </h3>
          </div>
          <div className="p-6">
            {questionarios.length > 0 ? (
              <div className="space-y-4">
                {questionarios.map((questionario) => (
                  <div key={questionario.id} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900">{questionario.titulo}</h4>
                    <p className="text-sm text-gray-600 mt-1">{questionario.descricao}</p>
                    <div className="mt-3 flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        Até: {new Date(questionario.data_fim || '').toLocaleDateString()}
                      </span>
                      <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                        Responder
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                Nenhum questionário disponível
              </p>
            )}
          </div>
        </div>

        {/* Próximos Eventos */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Próximos Eventos
            </h3>
          </div>
          <div className="p-6">
            {eventos.length > 0 ? (
              <div className="space-y-4">
                {eventos.map((evento) => (
                  <div key={evento.id} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900">{evento.titulo}</h4>
                    <p className="text-sm text-gray-600 mt-1">{evento.descricao}</p>
                    <div className="mt-3 flex justify-between items-center">
                      <div className="text-xs text-gray-500">
                        <p>{new Date(evento.data_evento).toLocaleDateString()}</p>
                        <p>{evento.local}</p>
                      </div>
                      <button className="text-sm text-green-600 hover:text-green-800 font-medium">
                        Inscrever-se
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                Nenhum evento próximo
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Seção de Redes Sociais e Comunidade */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Users className="w-5 h-5 mr-2 text-blue-600" />
          Conecte-se com a Comunidade UEMG
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="https://www.facebook.com/groups/egressosuemg"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
          >
            <Facebook className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <h4 className="font-medium text-gray-900">Grupo de Egressos</h4>
              <p className="text-sm text-gray-600">Conecte-se no Facebook</p>
            </div>
          </a>
          
          <a
            href="https://www.linkedin.com/groups/egressos-uemg"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
          >
            <Linkedin className="w-8 h-8 text-blue-700 mr-3" />
            <div>
              <h4 className="font-medium text-gray-900">Rede Profissional</h4>
              <p className="text-sm text-gray-600">Networking no LinkedIn</p>
            </div>
          </a>
          
          <a
            href="https://www.instagram.com/uemgoficial"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
          >
            <Instagram className="w-8 h-8 text-pink-600 mr-3" />
            <div>
              <h4 className="font-medium text-gray-900">Instagram UEMG</h4>
              <p className="text-sm text-gray-600">Acompanhe novidades</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}

export default EgressoDashboard