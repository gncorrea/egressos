import React, { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Heart, Users, Award, Building, Download, ArrowLeft } from 'lucide-react'

interface ImpactoData {
  participacaoSocial: { atividade: string; participantes: number; percentual: number }[]
  cargosLideranca: { cargo: string; quantidade: number; setor: string }[]
  contribuicaoComunidade: { tipo: string; projetos: number; beneficiados: number }[]
  empreendedorismoSocial: { area: string; iniciativas: number; impacto: string }[]
  voluntariado: { organizacao: string; voluntarios: number; horas: number }[]
}

interface RelatorioImpactoSocialProps {
  onBack: () => void
}

const RelatorioImpactoSocial: React.FC<RelatorioImpactoSocialProps> = ({ onBack }) => {
  const [dados, setDados] = useState<ImpactoData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDados()
  }, [])

  const fetchDados = async () => {
    try {
      if (import.meta.env.VITE_SUPABASE_URL === 'https://demo.supabase.co' || 
          !import.meta.env.VITE_SUPABASE_URL) {
        
        const mockDados: ImpactoData = {
        participacaoSocial: [
          { atividade: 'Voluntariado', participantes: 78, percentual: 41.7 },
          { atividade: 'Projetos Sociais', participantes: 56, percentual: 29.9 },
          { atividade: 'ONGs', participantes: 34, percentual: 18.2 },
          { atividade: 'Empreendedorismo Social', participantes: 28, percentual: 15.0 },
          { atividade: 'Conselhos Comunitários', participantes: 22, percentual: 11.8 },
          { atividade: 'Cooperativas', participantes: 18, percentual: 9.6 }
        ],
        cargosLideranca: [
          { cargo: 'Coordenador de Projeto Social', quantidade: 15, setor: 'Terceiro Setor' },
          { cargo: 'Diretor de Escola', quantidade: 12, setor: 'Educação' },
          { cargo: 'Gestor Público Municipal', quantidade: 10, setor: 'Público' },
          { cargo: 'Presidente de Associação', quantidade: 8, setor: 'Comunitário' },
          { cargo: 'Coordenador de ONG', quantidade: 7, setor: 'Terceiro Setor' },
          { cargo: 'Conselheiro Municipal', quantidade: 6, setor: 'Público' },
          { cargo: 'Líder Comunitário', quantidade: 5, setor: 'Comunitário' }
        ],
        contribuicaoComunidade: [
          { tipo: 'Educação e Capacitação', projetos: 23, beneficiados: 1250 },
          { tipo: 'Saúde Comunitária', projetos: 18, beneficiados: 890 },
          { tipo: 'Meio Ambiente', projetos: 15, beneficiados: 2100 },
          { tipo: 'Inclusão Digital', projetos: 12, beneficiados: 650 },
          { tipo: 'Geração de Renda', projetos: 10, beneficiados: 420 },
          { tipo: 'Cultura e Arte', projetos: 8, beneficiados: 780 }
        ],
        empreendedorismoSocial: [
          { area: 'Educação', iniciativas: 12, impacto: 'Alto' },
          { area: 'Tecnologia Social', iniciativas: 8, impacto: 'Médio' },
          { area: 'Sustentabilidade', iniciativas: 6, impacto: 'Alto' },
          { area: 'Saúde', iniciativas: 5, impacto: 'Médio' },
          { area: 'Inclusão Social', iniciativas: 4, impacto: 'Alto' }
        ],
        voluntariado: [
          { organizacao: 'Cruz Vermelha', voluntarios: 15, horas: 1200 },
          { organizacao: 'Pastoral da Criança', voluntarios: 12, horas: 960 },
          { organizacao: 'APAE', voluntarios: 10, horas: 800 },
          { organizacao: 'Bombeiros Voluntários', voluntarios: 8, horas: 640 },
          { organizacao: 'Casa de Apoio', voluntarios: 7, horas: 560 },
          { organizacao: 'Projeto Guri', voluntarios: 6, horas: 480 }
        ]
        }
        
        setDados(mockDados)
        setLoading(false)
        return
      }
      
      // Real Supabase queries would go here
      setLoading(false)
    } catch (error) {
      console.error('Error fetching dados:', error)
      setLoading(false)
    }
  }

  const exportarRelatorio = () => {
    if (!dados) return

    const csvContent = [
      ['RELATÓRIO DE IMPACTO SOCIAL E COMUNITÁRIO'],
      [''],
      ['PARTICIPAÇÃO SOCIAL'],
      ['Atividade', 'Participantes', 'Percentual'],
      ...dados.participacaoSocial.map(item => [item.atividade, item.participantes.toString(), `${item.percentual}%`]),
      [''],
      ['CARGOS DE LIDERANÇA'],
      ['Cargo', 'Quantidade', 'Setor'],
      ...dados.cargosLideranca.map(item => [item.cargo, item.quantidade.toString(), item.setor]),
      [''],
      ['CONTRIBUIÇÃO PARA COMUNIDADE'],
      ['Tipo', 'Projetos', 'Beneficiados'],
      ...dados.contribuicaoComunidade.map(item => [item.tipo, item.projetos.toString(), item.beneficiados.toString()])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'relatorio_impacto_social.csv'
    link.click()
  }

  const COLORS = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6', '#06b6d4']

  const getImpactColor = (impacto: string) => {
    switch (impacto) {
      case 'Alto': return 'bg-green-100 text-green-800'
      case 'Médio': return 'bg-yellow-100 text-yellow-800'
      case 'Baixo': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!dados) return null

  const totalParticipantes = dados.participacaoSocial.reduce((acc, item) => acc + item.participantes, 0)
  const totalBeneficiados = dados.contribuicaoComunidade.reduce((acc, item) => acc + item.beneficiados, 0)
  const totalProjetos = dados.contribuicaoComunidade.reduce((acc, item) => acc + item.projetos, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={onBack}
            className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Dashboard
          </button>
          <div className="flex items-center mb-2">
            <Heart className="w-8 h-8 text-red-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">Relatório de Impacto Social e Comunitário</h1>
          </div>
          <p className="mt-1 text-sm text-gray-600">
            Análise da contribuição dos egressos para a sociedade e comunidade
          </p>
        </div>
        <button
          onClick={exportarRelatorio}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download className="w-4 h-4 mr-2" />
          Exportar Relatório
        </button>
      </div>

      {/* Indicadores Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <Heart className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Engajamento Social</p>
              <p className="text-2xl font-bold text-gray-900">64.2%</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pessoas Beneficiadas</p>
              <p className="text-2xl font-bold text-gray-900">{totalBeneficiados.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Building className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Projetos Ativos</p>
              <p className="text-2xl font-bold text-gray-900">{totalProjetos}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Cargos de Liderança</p>
              <p className="text-2xl font-bold text-gray-900">
                {dados.cargosLideranca.reduce((acc, item) => acc + item.quantidade, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Participação Social */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Participação em Atividades Sociais</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dados.participacaoSocial}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="atividade" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="participantes" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Distribuição por Setor de Liderança */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Liderança por Setor</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Terceiro Setor', value: dados.cargosLideranca.filter(c => c.setor === 'Terceiro Setor').reduce((acc, c) => acc + c.quantidade, 0) },
                  { name: 'Público', value: dados.cargosLideranca.filter(c => c.setor === 'Público').reduce((acc, c) => acc + c.quantidade, 0) },
                  { name: 'Educação', value: dados.cargosLideranca.filter(c => c.setor === 'Educação').reduce((acc, c) => acc + c.quantidade, 0) },
                  { name: 'Comunitário', value: dados.cargosLideranca.filter(c => c.setor === 'Comunitário').reduce((acc, c) => acc + c.quantidade, 0) }
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {COLORS.map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Contribuição para Comunidade */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contribuição por Área</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dados.contribuicaoComunidade}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="tipo" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="beneficiados" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Horas de Voluntariado */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Horas de Voluntariado por Organização</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dados.voluntariado} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="organizacao" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="horas" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabelas Detalhadas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cargos de Liderança */}
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Cargos de Liderança</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cargo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Setor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantidade
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dados.cargosLideranca.map((cargo, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {cargo.cargo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {cargo.setor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {cargo.quantidade}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empreendedorismo Social */}
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Empreendedorismo Social</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Área
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Iniciativas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Impacto
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dados.empreendedorismoSocial.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.area}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.iniciativas}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getImpactColor(item.impacto)}`}>
                        {item.impacto}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RelatorioImpactoSocial