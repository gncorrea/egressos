import React, { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { Star, ThumbsUp, AlertTriangle, Users, Download, ArrowLeft } from 'lucide-react'

interface SatisfacaoData {
  avaliacaoGeral: { aspecto: string; nota: number; satisfacao: number }[]
  pontosFortes: { ponto: string; mencoes: number; percentual: number }[]
  lacunas: { lacuna: string; mencoes: number; impacto: string }[]
  recomendacao: { categoria: string; sim: number; nao: number; talvez: number }
  avaliacaoDetalhada: { categoria: string; nota: number; desvio: number }[]
}

interface RelatorioSatisfacaoPercepcaoProps {
  onBack: () => void
}

const RelatorioSatisfacaoPercepcao: React.FC<RelatorioSatisfacaoPercepcaoProps> = ({ onBack }) => {
  const [dados, setDados] = useState<SatisfacaoData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDados()
  }, [])

  const fetchDados = async () => {
    try {
      if (import.meta.env.VITE_SUPABASE_URL === 'https://demo.supabase.co' || 
          !import.meta.env.VITE_SUPABASE_URL) {
        
        const mockDados: SatisfacaoData = {
        avaliacaoGeral: [
          { aspecto: 'Curso Geral', nota: 4.2, satisfacao: 84 },
          { aspecto: 'Professores', nota: 4.1, satisfacao: 82 },
          { aspecto: 'Infraestrutura', nota: 3.6, satisfacao: 72 },
          { aspecto: 'Metodologia', nota: 3.9, satisfacao: 78 },
          { aspecto: 'Apoio Estudantil', nota: 3.4, satisfacao: 68 },
          { aspecto: 'Preparação Mercado', nota: 3.8, satisfacao: 76 }
        ],
        pontosFortes: [
          { ponto: 'Qualidade dos professores', mencoes: 89, percentual: 47.6 },
          { ponto: 'Conteúdo atualizado', mencoes: 76, percentual: 40.6 },
          { ponto: 'Relacionamento interpessoal', mencoes: 67, percentual: 35.8 },
          { ponto: 'Atividades práticas', mencoes: 54, percentual: 28.9 },
          { ponto: 'Pesquisa e extensão', mencoes: 43, percentual: 23.0 },
          { ponto: 'Estágios supervisionados', mencoes: 38, percentual: 20.3 }
        ],
        lacunas: [
          { lacuna: 'Falta de disciplinas práticas', mencoes: 67, impacto: 'Alto' },
          { lacuna: 'Infraestrutura de laboratórios', mencoes: 54, impacto: 'Alto' },
          { lacuna: 'Conexão com mercado de trabalho', mencoes: 48, impacto: 'Médio' },
          { lacuna: 'Soft skills e habilidades interpessoais', mencoes: 42, impacto: 'Médio' },
          { lacuna: 'Empreendedorismo e inovação', mencoes: 36, impacto: 'Médio' },
          { lacuna: 'Idiomas estrangeiros', mencoes: 28, impacto: 'Baixo' }
        ],
        recomendacao: { categoria: 'Recomendaria o curso', sim: 142, nao: 18, talvez: 27 },
        avaliacaoDetalhada: [
          { categoria: 'Corpo Docente', nota: 4.1, desvio: 0.8 },
          { categoria: 'Currículo', nota: 3.9, desvio: 0.9 },
          { categoria: 'Infraestrutura', nota: 3.6, desvio: 1.1 },
          { categoria: 'Metodologia', nota: 3.9, desvio: 0.7 },
          { categoria: 'Apoio Acadêmico', nota: 3.4, desvio: 1.0 },
          { categoria: 'Preparação Profissional', nota: 3.8, desvio: 0.9 }
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
      ['RELATÓRIO DE SATISFAÇÃO E PERCEPÇÃO'],
      [''],
      ['AVALIAÇÃO GERAL'],
      ['Aspecto', 'Nota', 'Satisfação %'],
      ...dados.avaliacaoGeral.map(item => [item.aspecto, item.nota.toString(), `${item.satisfacao}%`]),
      [''],
      ['PONTOS FORTES'],
      ['Ponto Forte', 'Menções', 'Percentual'],
      ...dados.pontosFortes.map(item => [item.ponto, item.mencoes.toString(), `${item.percentual}%`]),
      [''],
      ['LACUNAS IDENTIFICADAS'],
      ['Lacuna', 'Menções', 'Impacto'],
      ...dados.lacunas.map(item => [item.lacuna, item.mencoes.toString(), item.impacto])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'relatorio_satisfacao_percepcao.csv'
    link.click()
  }

  const getImpactColor = (impacto: string) => {
    switch (impacto) {
      case 'Alto': return 'bg-red-100 text-red-800'
      case 'Médio': return 'bg-yellow-100 text-yellow-800'
      case 'Baixo': return 'bg-green-100 text-green-800'
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

  const satisfacaoMedia = dados.avaliacaoGeral.reduce((acc, item) => acc + item.nota, 0) / dados.avaliacaoGeral.length
  const recomendacaoPercentual = (dados.recomendacao.sim / (dados.recomendacao.sim + dados.recomendacao.nao + dados.recomendacao.talvez)) * 100

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
            <Star className="w-8 h-8 text-yellow-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">Relatório de Satisfação e Percepção</h1>
          </div>
          <p className="mt-1 text-sm text-gray-600">
            Avaliação da satisfação dos egressos com a formação recebida
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
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Satisfação Média</p>
              <p className="text-2xl font-bold text-gray-900">{satisfacaoMedia.toFixed(1)}/5.0</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <ThumbsUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Recomendariam</p>
              <p className="text-2xl font-bold text-gray-900">{recomendacaoPercentual.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Respondentes</p>
              <p className="text-2xl font-bold text-gray-900">187</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Lacunas Críticas</p>
              <p className="text-2xl font-bold text-gray-900">
                {dados.lacunas.filter(l => l.impacto === 'Alto').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Avaliação Geral por Aspecto */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Avaliação por Aspecto</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dados.avaliacaoGeral}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="aspecto" angle={-45} textAnchor="end" height={80} />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Bar dataKey="nota" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Radar Chart - Avaliação Detalhada */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Perfil de Satisfação</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={dados.avaliacaoDetalhada}>
              <PolarGrid />
              <PolarAngleAxis dataKey="categoria" />
              <PolarRadiusAxis angle={90} domain={[0, 5]} />
              <Radar name="Nota" dataKey="nota" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Pontos Fortes */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Principais Pontos Fortes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dados.pontosFortes} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="ponto" type="category" width={120} />
              <Tooltip />
              <Bar dataKey="mencoes" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recomendação do Curso */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recomendação do Curso</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Sim, recomendaria</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${(dados.recomendacao.sim / (dados.recomendacao.sim + dados.recomendacao.nao + dados.recomendacao.talvez)) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-bold text-gray-900">{dados.recomendacao.sim}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Talvez</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full" 
                    style={{ width: `${(dados.recomendacao.talvez / (dados.recomendacao.sim + dados.recomendacao.nao + dados.recomendacao.talvez)) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-bold text-gray-900">{dados.recomendacao.talvez}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Não recomendaria</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-600 h-2 rounded-full" 
                    style={{ width: `${(dados.recomendacao.nao / (dados.recomendacao.sim + dados.recomendacao.nao + dados.recomendacao.talvez)) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-bold text-gray-900">{dados.recomendacao.nao}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lacunas Identificadas */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Lacunas Identificadas na Formação</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lacuna Identificada
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Menções
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Impacto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Percentual
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dados.lacunas.map((lacuna, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {lacuna.lacuna}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {lacuna.mencoes}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getImpactColor(lacuna.impacto)}`}>
                      {lacuna.impacto}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {((lacuna.mencoes / 187) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default RelatorioSatisfacaoPercepcao