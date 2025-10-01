import React, { useState, useEffect } from 'react'
import { Search, Filter, Download, Eye, CreditCard as Edit, GraduationCap, MapPin, Briefcase, Calendar, Phone, Mail, TrendingUp, Users, Building, Facebook, Instagram, Linkedin, ExternalLink } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

interface EgressoData {
  id: string
  profile_id: string
  curso: string
  ano_conclusao: number
  telefone: string | null
  endereco: string | null
  cidade: string | null
  estado: string | null
  status_profissional: string | null
  empresa_atual: string | null
  cargo_atual: string | null
  formacao_continuada: string | null
  linkedin_url: string | null
  facebook_url: string | null
  instagram_url: string | null
  site_pessoal: string | null
  profile: {
    full_name: string
    email: string
  }
  unidade?: string
  created_at: string
  updated_at: string
}

const GestaoEgressos: React.FC = () => {
  const { user } = useAuth()
  const [egressos, setEgressos] = useState<EgressoData[]>([])
  const [filteredEgressos, setFilteredEgressos] = useState<EgressoData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCurso, setFilterCurso] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterAno, setFilterAno] = useState('')
  const [selectedEgresso, setSelectedEgresso] = useState<EgressoData | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchEgressos()
  }, [user])

  useEffect(() => {
    filterEgressos()
  }, [searchTerm, filterCurso, filterStatus, filterAno, egressos])

  const fetchEgressos = async () => {
    try {
      // Mock data for demo
      if (import.meta.env.VITE_SUPABASE_URL === 'https://demo.supabase.co' || 
          !import.meta.env.VITE_SUPABASE_URL) {
        
        const mockEgressos: EgressoData[] = [
          {
            id: '1',
            profile_id: '11111111-1111-1111-1111-111111111111',
            curso: 'Ciência da Computação',
            ano_conclusao: 2020,
            telefone: '(31) 99999-9999',
            endereco: 'Rua das Flores, 123 - Centro',
            cidade: 'Belo Horizonte',
            estado: 'MG',
            status_profissional: 'Empregado',
            empresa_atual: 'Tech Corp',
            cargo_atual: 'Desenvolvedor Sênior',
            formacao_continuada: 'MBA em Gestão de Projetos',
            linkedin_url: 'https://linkedin.com/in/joaosilva',
            facebook_url: null,
            instagram_url: 'https://instagram.com/joaosilva',
            site_pessoal: 'https://joaosilva.dev',
            profile: {
              full_name: 'João Silva',
              email: 'joao.silva@email.com'
            },
            unidade: 'UEMG - Belo Horizonte',
            created_at: '2020-12-15T00:00:00Z',
            updated_at: '2024-01-15T00:00:00Z'
          },
          {
            id: '2',
            profile_id: '22222222-2222-2222-2222-222222222222',
            curso: 'Engenharia de Software',
            ano_conclusao: 2019,
            telefone: '(31) 88888-8888',
            endereco: 'Av. Brasil, 456 - Industrial',
            cidade: 'Contagem',
            estado: 'MG',
            status_profissional: 'Empregado',
            empresa_atual: 'StartupXYZ',
            cargo_atual: 'Tech Lead',
            formacao_continuada: 'Mestrado em Computação',
            linkedin_url: 'https://linkedin.com/in/mariasantos',
            facebook_url: 'https://facebook.com/maria.santos',
            instagram_url: null,
            site_pessoal: null,
            profile: {
              full_name: 'Maria Santos',
              email: 'maria.santos@email.com'
            },
            unidade: 'UEMG - Belo Horizonte',
            created_at: '2019-12-15T00:00:00Z',
            updated_at: '2024-01-10T00:00:00Z'
          },
          {
            id: '3',
            profile_id: '33333333-3333-3333-3333-333333333333',
            curso: 'Administração',
            ano_conclusao: 2021,
            telefone: '(32) 77777-7777',
            endereco: 'Rua Principal, 789 - São José',
            cidade: 'Barbacena',
            estado: 'MG',
            status_profissional: 'Empreendedor',
            empresa_atual: 'Consultoria Própria',
            cargo_atual: 'Consultor',
            formacao_continuada: 'Especialização em Gestão Empresarial',
            linkedin_url: 'https://linkedin.com/in/carloslima',
            facebook_url: null,
            instagram_url: null,
            site_pessoal: 'https://consultoriacarlos.com.br',
            profile: {
              full_name: 'Carlos Lima',
              email: 'carlos.lima@email.com'
            },
            unidade: 'UEMG - Barbacena',
            created_at: '2021-12-15T00:00:00Z',
            updated_at: '2024-01-20T00:00:00Z'
          },
          {
            id: '4',
            profile_id: '44444444-4444-4444-4444-444444444444',
            curso: 'Pedagogia',
            ano_conclusao: 2018,
            telefone: '(32) 66666-6666',
            endereco: 'Rua da Escola, 321 - Centro',
            cidade: 'Barbacena',
            estado: 'MG',
            status_profissional: 'Empregado',
            empresa_atual: 'Escola Municipal',
            cargo_atual: 'Professora',
            formacao_continuada: 'Especialização em Educação Infantil',
            linkedin_url: null,
            facebook_url: 'https://facebook.com/ana.costa.prof',
            instagram_url: 'https://instagram.com/profanacosta',
            site_pessoal: null,
            profile: {
              full_name: 'Ana Costa',
              email: 'ana.costa@email.com'
            },
            unidade: 'UEMG - Barbacena',
            created_at: '2018-12-15T00:00:00Z',
            updated_at: '2024-01-05T00:00:00Z'
          },
          {
            id: '5',
            profile_id: '55555555-5555-5555-5555-555555555555',
            curso: 'Engenharia Civil',
            ano_conclusao: 2022,
            telefone: '(37) 55555-5555',
            endereco: 'Av. Paraná, 654 - Belvedere',
            cidade: 'Divinópolis',
            estado: 'MG',
            status_profissional: 'Desempregado',
            empresa_atual: null,
            cargo_atual: null,
            formacao_continuada: 'Cursando Pós-graduação em Estruturas',
            linkedin_url: 'https://linkedin.com/in/pedrooliveira',
            facebook_url: null,
            instagram_url: null,
            site_pessoal: null,
            profile: {
              full_name: 'Pedro Oliveira',
              email: 'pedro.oliveira@email.com'
            },
            unidade: 'UEMG - Divinópolis',
            created_at: '2022-12-15T00:00:00Z',
            updated_at: '2024-01-25T00:00:00Z'
          },
          {
            id: '6',
            profile_id: '66666666-6666-6666-6666-666666666666',
            curso: 'Design Gráfico',
            ano_conclusao: 2020,
            telefone: '(31) 44444-4444',
            endereco: 'Rua do Design, 987 - Savassi',
            cidade: 'Belo Horizonte',
            estado: 'MG',
            status_profissional: 'Autônomo',
            empresa_atual: 'Freelancer',
            cargo_atual: 'Designer Gráfico',
            formacao_continuada: 'Cursos de UX/UI Design',
            linkedin_url: 'https://linkedin.com/in/luciaferreira',
            facebook_url: null,
            instagram_url: 'https://instagram.com/luciadesign',
            site_pessoal: 'https://luciaferreira.design',
            profile: {
              full_name: 'Lucia Ferreira',
              email: 'lucia.ferreira@email.com'
            },
            unidade: 'UEMG - Belo Horizonte',
            created_at: '2020-12-15T00:00:00Z',
            updated_at: '2024-01-12T00:00:00Z'
          }
        ]
        
        setEgressos(mockEgressos)
        setLoading(false)
        return
      }

      // Real Supabase query would go here
      setLoading(false)
    } catch (error) {
      console.error('Error fetching egressos:', error)
      setLoading(false)
    }
  }

  const filterEgressos = () => {
    let filtered = egressos

    if (searchTerm) {
      filtered = filtered.filter(egresso => 
        egresso.profile.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        egresso.profile.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        egresso.curso.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filterCurso) {
      filtered = filtered.filter(egresso => egresso.curso === filterCurso)
    }

    if (filterStatus) {
      filtered = filtered.filter(egresso => egresso.status_profissional === filterStatus)
    }

    if (filterAno) {
      filtered = filtered.filter(egresso => egresso.ano_conclusao.toString() === filterAno)
    }

    setFilteredEgressos(filtered)
  }

  const getUniqueValues = (field: keyof EgressoData | 'profile.full_name') => {
    if (field === 'curso') {
      return [...new Set(egressos.map(e => e.curso))].sort()
    }
    if (field === 'status_profissional') {
      return [...new Set(egressos.map(e => e.status_profissional).filter(Boolean))].sort()
    }
    if (field === 'ano_conclusao') {
      return [...new Set(egressos.map(e => e.ano_conclusao.toString()))].sort().reverse()
    }
    return []
  }

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'Empregado':
        return 'bg-green-100 text-green-800'
      case 'Desempregado':
        return 'bg-red-100 text-red-800'
      case 'Empreendedor':
        return 'bg-blue-100 text-blue-800'
      case 'Autônomo':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const exportData = () => {
    const csvContent = [
      ['Nome', 'Email', 'Curso', 'Ano Conclusão', 'Status', 'Empresa', 'Cargo', 'Telefone'].join(','),
      ...filteredEgressos.map(egresso => [
        egresso.profile.full_name,
        egresso.profile.email,
        egresso.curso,
        egresso.ano_conclusao,
        egresso.status_profissional || '',
        egresso.empresa_atual || '',
        egresso.cargo_atual || '',
        egresso.telefone || ''
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'egressos.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const stats = {
    total: egressos.length,
    empregados: egressos.filter(e => e.status_profissional === 'Empregado').length,
    empreendedores: egressos.filter(e => e.status_profissional === 'Empreendedor').length,
    autonomos: egressos.filter(e => e.status_profissional === 'Autônomo').length,
    desempregados: egressos.filter(e => e.status_profissional === 'Desempregado').length
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Egressos</h1>
          <p className="mt-1 text-sm text-gray-600">
            Acompanhe e gerencie os egressos da UEMG
          </p>
        </div>
        <button
          onClick={exportData}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download className="w-4 h-4 mr-2" />
          Exportar CSV
        </button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Briefcase className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Empregados</p>
              <p className="text-2xl font-bold text-gray-900">{stats.empregados}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Empreendedores</p>
              <p className="text-2xl font-bold text-gray-900">{stats.empreendedores}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Autônomos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.autonomos}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <Search className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Desempregados</p>
              <p className="text-2xl font-bold text-gray-900">{stats.desempregados}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nome, email ou curso..."
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Curso
            </label>
            <select
              value={filterCurso}
              onChange={(e) => setFilterCurso(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos os cursos</option>
              {getUniqueValues('curso').map(curso => (
                <option key={curso} value={curso}>{curso}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos os status</option>
              {getUniqueValues('status_profissional').map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ano de Conclusão
            </label>
            <select
              value={filterAno}
              onChange={(e) => setFilterAno(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos os anos</option>
              {getUniqueValues('ano_conclusao').map(ano => (
                <option key={ano} value={ano}>{ano}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('')
                setFilterCurso('')
                setFilterStatus('')
                setFilterAno('')
              }}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Egressos */}
      <div className="bg-white shadow rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Egressos ({filteredEgressos.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Egresso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Curso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ano
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Empresa/Cargo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Localização
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEgressos.map((egresso) => (
                <tr key={egresso.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {egresso.profile.full_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {egresso.profile.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">
                        {egresso.cidade}, {egresso.estado}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <GraduationCap className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{egresso.curso}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{egresso.ano_conclusao}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(egresso.status_profissional)}`}>
                      {egresso.status_profissional || 'Não informado'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {egresso.empresa_atual || 'Não informado'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {egresso.cargo_atual || ''}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectedEgresso(egresso)
                        setShowModal(true)
                      }}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Detalhes */}
      {showModal && selectedEgresso && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Detalhes do Egresso
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nome</label>
                  <p className="text-sm text-gray-900">{selectedEgresso.profile.full_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-sm text-gray-900">{selectedEgresso.profile.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Curso</label>
                  <p className="text-sm text-gray-900">{selectedEgresso.curso}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ano de Conclusão</label>
                  <p className="text-sm text-gray-900">{selectedEgresso.ano_conclusao}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Telefone</label>
                  <p className="text-sm text-gray-900">{selectedEgresso.telefone || 'Não informado'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status Profissional</label>
                  <p className="text-sm text-gray-900">{selectedEgresso.status_profissional || 'Não informado'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Empresa Atual</label>
                  <p className="text-sm text-gray-900">{selectedEgresso.empresa_atual || 'Não informado'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Cargo Atual</label>
                  <p className="text-sm text-gray-900">
                    {selectedEgresso.endereco || 'Não informado'}
                    {selectedEgresso.cidade && selectedEgresso.estado && (
                      <span className="block text-gray-600">
                        {selectedEgresso.cidade}, {selectedEgresso.estado}
                      </span>
                    )}
                  </p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Endereço</label>
                <p className="text-sm text-gray-900">{selectedEgresso.endereco || 'Não informado'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Formação Continuada</label>
                <p className="text-sm text-gray-900">{selectedEgresso.formacao_continuada || 'Não informado'}</p>
              </div>
              
              {/* Redes Sociais */}
              {(selectedEgresso.linkedin_url || selectedEgresso.facebook_url || selectedEgresso.instagram_url || selectedEgresso.site_pessoal) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Redes Sociais</label>
                  <div className="flex items-center space-x-4">
                    {selectedEgresso.linkedin_url && (
                      <a
                        href={selectedEgresso.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-700 hover:text-blue-900 text-sm"
                      >
                        <Linkedin className="w-4 h-4 mr-1" />
                        LinkedIn
                      </a>
                    )}
                    {selectedEgresso.facebook_url && (
                      <a
                        href={selectedEgresso.facebook_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                      >
                        <Facebook className="w-4 h-4 mr-1" />
                        Facebook
                      </a>
                    )}
                    {selectedEgresso.instagram_url && (
                      <a
                        href={selectedEgresso.instagram_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-pink-600 hover:text-pink-800 text-sm"
                      >
                        <Instagram className="w-4 h-4 mr-1" />
                        Instagram
                      </a>
                    )}
                    {selectedEgresso.site_pessoal && (
                      <a
                        href={selectedEgresso.site_pessoal}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-gray-600 hover:text-gray-800 text-sm"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Site
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GestaoEgressos