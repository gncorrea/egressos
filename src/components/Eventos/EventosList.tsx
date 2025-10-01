import React, { useState, useEffect } from 'react'
import { Calendar, MapPin, Users, Clock, Tag, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

interface CategoriaEvento {
  id: string
  nome: string
  descricao: string | null
  cor: string
  icone: string
}

interface EventoDetalhado {
  id: string
  titulo: string
  descricao: string | null
  categoria_id: string | null
  data_inicio: string
  data_fim: string | null
  local: string | null
  endereco: string | null
  modalidade: 'presencial' | 'online' | 'hibrido'
  link_online: string | null
  vagas_total: number | null
  vagas_ocupadas: number
  valor: number
  gratuito: boolean
  certificado: boolean
  carga_horaria: number | null
  palestrantes: string[] | null
  organizador: string | null
  publico_alvo: string | null
  objetivos: string | null
  status: 'rascunho' | 'publicado' | 'cancelado' | 'finalizado'
  categoria?: CategoriaEvento
  inscrito?: boolean
  pode_inscrever?: boolean
}

const EventosList: React.FC = () => {
  const { user, profile } = useAuth()
  const [eventos, setEventos] = useState<EventoDetalhado[]>([])
  const [categorias, setCategorias] = useState<CategoriaEvento[]>([])
  const [filtroCategoria, setFiltroCategoria] = useState<string>('')
  const [filtroModalidade, setFiltroModalidade] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEventos()
  }, [user])

  const fetchEventos = async () => {
    try {
      // Mock data for demo
      if (import.meta.env.VITE_SUPABASE_URL === 'https://demo.supabase.co' || 
          !import.meta.env.VITE_SUPABASE_URL) {
        
        const mockCategorias: CategoriaEvento[] = [
          { id: '1', nome: 'Acadêmico', descricao: 'Eventos relacionados à vida acadêmica', cor: '#3b82f6', icone: 'graduation-cap' },
          { id: '2', nome: 'Networking', descricao: 'Eventos de relacionamento profissional', cor: '#059669', icone: 'users' },
          { id: '3', nome: 'Capacitação', descricao: 'Cursos e workshops de capacitação', cor: '#dc2626', icone: 'book-open' },
          { id: '4', nome: 'Cultural', descricao: 'Eventos culturais e artísticos', cor: '#7c3aed', icone: 'palette' },
          { id: '5', nome: 'Científico', descricao: 'Congressos, seminários e pesquisa', cor: '#0891b2', icone: 'microscope' }
        ]

        const mockEventos: EventoDetalhado[] = [
          {
            id: '1',
            titulo: 'Encontro de Egressos UEMG 2024',
            descricao: 'Evento anual para reunir egressos de todos os cursos da UEMG, promovendo networking e troca de experiências profissionais.',
            categoria_id: '2',
            data_inicio: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            data_fim: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000).toISOString(),
            local: 'Centro de Convenções BH',
            endereco: 'Av. Amazonas, 6200 - Gameleira, Belo Horizonte - MG',
            modalidade: 'presencial' as const,
            link_online: null,
            vagas_total: 500,
            vagas_ocupadas: 234,
            valor: 0,
            gratuito: true,
            certificado: true,
            carga_horaria: 8,
            palestrantes: ['Dr. João Silva - Reitor UEMG', 'Dra. Maria Santos - Ex-aluna Destaque', 'Prof. Carlos Lima - Coordenador Geral'],
            organizador: 'Reitoria UEMG',
            publico_alvo: 'Egressos de todos os cursos da UEMG',
            objetivos: 'Promover networking entre egressos, apresentar oportunidades de carreira e fortalecer vínculos com a instituição',
            status: 'publicado' as const,
            categoria: mockCategorias[1],
            inscrito: false,
            pode_inscrever: true
          },
          {
            id: '2',
            titulo: 'Workshop: Inteligência Artificial na Educação',
            descricao: 'Capacitação para docentes sobre o uso de IA como ferramenta pedagógica.',
            categoria_id: '3',
            data_inicio: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
            data_fim: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
            local: 'Laboratório de Informática - Unidade BH',
            endereco: 'Av. Presidente Antônio Carlos, 7545 - Pampulha, Belo Horizonte - MG',
            modalidade: 'hibrido' as const,
            link_online: 'https://meet.google.com/abc-defg-hij',
            vagas_total: 50,
            vagas_ocupadas: 32,
            valor: 0,
            gratuito: true,
            certificado: true,
            carga_horaria: 4,
            palestrantes: ['Dr. Pedro Oliveira - Especialista em IA', 'Profa. Ana Costa - Pedagogia Digital'],
            organizador: 'Coordenação de TI - UEMG BH',
            publico_alvo: 'Docentes e coordenadores de curso',
            objetivos: 'Capacitar docentes no uso de ferramentas de IA para melhoria do processo ensino-aprendizagem',
            status: 'publicado' as const,
            categoria: mockCategorias[2],
            inscrito: true,
            pode_inscrever: false
          },
          {
            id: '3',
            titulo: 'Semana de Ciência e Tecnologia',
            descricao: 'Evento científico com apresentação de trabalhos de pesquisa e extensão.',
            categoria_id: '5',
            data_inicio: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
            data_fim: new Date(Date.now() + 49 * 24 * 60 * 60 * 1000).toISOString(),
            local: 'Campus Divinópolis',
            endereco: 'Av. Paraná, 3001 - Jardim Belvedere, Divinópolis - MG',
            modalidade: 'presencial' as const,
            link_online: null,
            vagas_total: 300,
            vagas_ocupadas: 156,
            valor: 0,
            gratuito: true,
            certificado: true,
            carga_horaria: 40,
            palestrantes: ['Diversos pesquisadores da UEMG', 'Convidados externos'],
            organizador: 'Pró-reitoria de Pesquisa e Extensão',
            publico_alvo: 'Estudantes, docentes e comunidade externa',
            objetivos: 'Divulgar pesquisas desenvolvidas na UEMG e promover intercâmbio científico',
            status: 'publicado' as const,
            categoria: mockCategorias[4],
            inscrito: false,
            pode_inscrever: true
          },
          {
            id: '4',
            titulo: 'Festival Cultural UEMG',
            descricao: 'Mostra de talentos artísticos e culturais da comunidade acadêmica.',
            categoria_id: '4',
            data_inicio: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
            data_fim: new Date(Date.now() + 62 * 24 * 60 * 60 * 1000).toISOString(),
            local: 'Teatro Municipal - Barbacena',
            endereco: 'Praça da Estação, s/n - Centro, Barbacena - MG',
            modalidade: 'presencial' as const,
            link_online: null,
            vagas_total: 200,
            vagas_ocupadas: 78,
            valor: 0,
            gratuito: true,
            certificado: false,
            carga_horaria: null,
            palestrantes: ['Grupos artísticos da UEMG', 'Artistas locais'],
            organizador: 'Coordenação de Cultura - UEMG Barbacena',
            publico_alvo: 'Comunidade acadêmica e sociedade',
            objetivos: 'Promover a cultura e valorizar talentos da comunidade universitária',
            status: 'publicado' as const,
            categoria: mockCategorias[3],
            inscrito: false,
            pode_inscrever: true
          },
          {
            id: '5',
            titulo: 'Webinar: Mercado de Trabalho Pós-Pandemia',
            descricao: 'Discussão sobre as mudanças no mercado de trabalho e oportunidades emergentes.',
            categoria_id: '1',
            data_inicio: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            data_fim: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
            local: 'Online',
            endereco: null,
            modalidade: 'online' as const,
            link_online: 'https://zoom.us/j/123456789',
            vagas_total: 1000,
            vagas_ocupadas: 567,
            valor: 0,
            gratuito: true,
            certificado: true,
            carga_horaria: 2,
            palestrantes: ['Dra. Fernanda Rocha - Especialista em RH', 'Prof. Ricardo Alves - Economia'],
            organizador: 'Coordenação de Extensão',
            publico_alvo: 'Estudantes e egressos',
            objetivos: 'Orientar sobre tendências do mercado de trabalho e estratégias de carreira',
            status: 'publicado' as const,
            categoria: mockCategorias[0],
            inscrito: false,
            pode_inscrever: true
          }
        ]
        
        setCategorias(mockCategorias)
        setEventos(mockEventos)
        setLoading(false)
        return
      }

      // Real Supabase queries would go here
      setLoading(false)
    } catch (error) {
      console.error('Error fetching eventos:', error)
      setLoading(false)
    }
  }

  const handleInscricao = async (eventoId: string) => {
    // Mock inscription
    setEventos(prev => prev.map(evento => 
      evento.id === eventoId 
        ? { ...evento, inscrito: true, vagas_ocupadas: evento.vagas_ocupadas + 1 }
        : evento
    ))
  }

  const getModalidadeIcon = (modalidade: string) => {
    switch (modalidade) {
      case 'online':
        return '🌐'
      case 'hibrido':
        return '🔄'
      default:
        return '📍'
    }
  }

  const getModalidadeColor = (modalidade: string) => {
    switch (modalidade) {
      case 'online':
        return 'bg-blue-100 text-blue-800'
      case 'hibrido':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-green-100 text-green-800'
    }
  }

  const eventosFiltrados = eventos.filter(evento => {
    const categoriaMatch = !filtroCategoria || evento.categoria_id === filtroCategoria
    const modalidadeMatch = !filtroModalidade || evento.modalidade === filtroModalidade
    return categoriaMatch && modalidadeMatch
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Eventos UEMG</h1>
          <p className="mt-1 text-sm text-gray-600">
            Participe dos eventos da universidade e amplie sua rede de contatos
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoria
            </label>
            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todas as categorias</option>
              {categorias.map(categoria => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Modalidade
            </label>
            <select
              value={filtroModalidade}
              onChange={(e) => setFiltroModalidade(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todas as modalidades</option>
              <option value="presencial">Presencial</option>
              <option value="online">Online</option>
              <option value="hibrido">Híbrido</option>
            </select>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Eventos Disponíveis</p>
              <p className="text-2xl font-bold text-gray-900">{eventos.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Inscrições Realizadas</p>
              <p className="text-2xl font-bold text-gray-900">
                {eventos.filter(e => e.inscrito).length}
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
              <p className="text-sm font-medium text-gray-600">Total de Participantes</p>
              <p className="text-2xl font-bold text-gray-900">
                {eventos.reduce((acc, e) => acc + e.vagas_ocupadas, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Tag className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Eventos Gratuitos</p>
              <p className="text-2xl font-bold text-gray-900">
                {eventos.filter(e => e.gratuito).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Eventos */}
      {eventosFiltrados.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum evento encontrado
          </h3>
          <p className="text-gray-600">
            Não há eventos que correspondam aos filtros selecionados.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {eventosFiltrados.map((evento) => (
            <div key={evento.id} className="bg-white shadow rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {evento.titulo}
                      </h3>
                      {evento.categoria && (
                        <span 
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                          style={{ backgroundColor: evento.categoria.cor }}
                        >
                          {evento.categoria.nome}
                        </span>
                      )}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getModalidadeColor(evento.modalidade)}`}>
                        {getModalidadeIcon(evento.modalidade)} {evento.modalidade.charAt(0).toUpperCase() + evento.modalidade.slice(1)}
                      </span>
                      {evento.gratuito && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Gratuito
                        </span>
                      )}
                      {evento.certificado && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Certificado
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-4">
                      {evento.descricao}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(evento.data_inicio).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          })} às {new Date(evento.data_inicio).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>

                      {evento.local && (
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span>{evento.local}</span>
                        </div>
                      )}

                      {evento.carga_horaria && (
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>{evento.carga_horaria}h de duração</span>
                        </div>
                      )}

                      {evento.vagas_total && (
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4" />
                          <span>
                            {evento.vagas_ocupadas}/{evento.vagas_total} vagas ocupadas
                          </span>
                        </div>
                      )}
                    </div>

                    {evento.palestrantes && evento.palestrantes.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Palestrantes:</h4>
                        <div className="flex flex-wrap gap-2">
                          {evento.palestrantes.map((palestrante, index) => (
                            <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {palestrante}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2 ml-6">
                    {evento.inscrito ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="w-5 h-5 mr-1" />
                        <span className="text-sm font-medium">Inscrito</span>
                      </div>
                    ) : evento.pode_inscrever ? (
                      <button
                        onClick={() => handleInscricao(evento.id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        Inscrever-se
                      </button>
                    ) : (
                      <div className="flex items-center text-red-600">
                        <AlertCircle className="w-5 h-5 mr-1" />
                        <span className="text-sm font-medium">Esgotado</span>
                      </div>
                    )}

                    {evento.link_online && (
                      <a
                        href={evento.link_online}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Link do evento
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default EventosList