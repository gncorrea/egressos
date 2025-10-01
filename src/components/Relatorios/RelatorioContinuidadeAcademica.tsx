import React, { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { GraduationCap, BookOpen, School, Award, Download, ArrowLeft } from 'lucide-react'

interface ContinuidadeData {
  tipoFormacao: { tipo: string; quantidade: number; percentual: number }[]
  areasFormacao: { area: string; especializacao: number; mestrado: number; doutorado: number }[]
  instituicoes: { instituicao: string; quantidade: number; tipo: string }[]
  motivacao: { motivo: string; quantidade: number }[]
}

interface RelatorioContinuidadeAcademicaProps {
  onBack: () => void
}

const RelatorioContinuidadeAcademica: React.FC<RelatorioContinuidadeAcademicaProps> = ({ onBack }) => {
  const [dados, setDados] = useState<ContinuidadeData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDados()
  }, [])

  const fetchDados = async () => {
    try {
      if (import.meta.env.VITE_SUPABASE_URL === 'https://demo.supabase.co' || 
          !import.meta.env.VITE_SUPABASE_URL) {
        
        const mockDados: ContinuidadeData = {
        tipoFormacao: [
          { tipo: 'Especialização', quantidade: 78, percentual: 41.7 },
          { tipo: 'MBA', quantidade: 45, percentual: 24.1 },
          { tipo: 'Mestrado', quantidade: 32, percentual: 17.1 },
          { tipo: 'Doutorado', quantidade: 12, percentual: 6.4 },
          { tipo: 'Cursos Livres', quantidade: 89, percentual: 47.6 },
          { tipo: 'Certificações', quantidade: 67, percentual: 35.8 }
        ],
        areasFormacao: [
          { area: 'Tecnologia da Informação', especializacao: 28, mestrado: 12, doutorado: 4 },
          { area: 'Gestão e Negócios', especializacao: 22, mestrado: 8, doutorado: 2 },
          { area: 'Educação', especializacao: 18, mestrado: 15, doutorado: 6 },
          { area: 'Engenharia', especializacao: 15, mestrado: 10, doutorado: 3 },
          { area: 'Saúde', especializacao: 12, mestrado: 6, doutorado: 2 },
          { area: 'Design e Criatividade', especializacao: 8, mestrado: 3, doutorado: 1 }
        ],
        instituicoes: [
          { instituicao: 'UFMG', quantidade: 28, tipo: 'Pública' },
          { instituicao: 'PUC Minas', quantidade: 22, tipo: 'Privada' },
          { instituicao: 'UEMG', quantidade: 18, tipo: 'Pública' },
          { instituicao: 'Fundação Dom Cabral', quantidade: 15, tipo: 'Privada' },
          { instituicao: 'CEFET-MG', quantidade: 12, tipo: 'Pública' },
          { instituicao: 'Newton Paiva', quantidade: 10, tipo: 'Privada' },
          { instituicao: 'FUMEC', quantidade: 8, tipo: 'Privada' },
          { instituicao: 'USP', quantidade: 6, tipo: 'Pública' }
        ],
        motivacao: [
          { motivo: 'Crescimento profissional', quantidade: 89 },
          { motivo: 'Atualização de conhecimentos', quantidade: 67 },
          { motivo: 'Mudança de área', quantidade: 34 },
          { motivo: 'Exigência do mercado', quantidade: 45 },
          { motivo: 'Interesse acadêmico', quantidade: 28 },
          { motivo: 'Melhoria salarial', quantidade: 56 }
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
      ['RELATÓRIO DE CONTINUIDADE ACADÊMICA'],
      [''],
      ['TIPO DE FORMAÇÃO CONTINUADA'],
      ['Tipo', 'Quantidade', 'Percentual'],
      ...dados.tipoFormacao.map(item => [item.tipo, item.quantidade.toString(), `${item.percentual}%`]),
      [''],
      ['INSTITUIÇÕES DE DESTINO'],
      ['Instituição', 'Quantidade', 'Tipo'],
      ...dados.instituicoes.map(item => [item.instituicao, item.quantidade.toString(), item.tipo])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'relatorio_continuidade_academica.csv'
    link.click()
  }

  const COLORS = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6', '#06b6d4']

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!dados) return null

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
            <GraduationCap className="w-8 h-8 text-purple-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">Relatório de Continuidade Acadêmica</h1>
          </div>
          <p className="mt-1 text-sm text-gray-600">
            Análise da formação continuada dos egressos da UEMG
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
            <div className="p-2 bg-blue-100 rounded-lg">
              <GraduationCap className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Taxa de Continuidade</p>
              <p className="text-2xl font-bold text-gray-900">68.4%</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Especializações</p>
              <p className="text-2xl font-bold text-gray-900">78</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <School className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Mestrados</p>
              <p className="text-2xl font-bold text-gray-900">32</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Award className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Doutorados</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tipo de Formação Continuada */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tipo de Formação Continuada</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dados.tipoFormacao}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="tipo" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="quantidade" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Motivação para Continuidade */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Motivação para Formação Continuada</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dados.motivacao} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="motivo" type="category" width={120} />
              <Tooltip />
              <Bar dataKey="quantidade" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Áreas de Formação Continuada */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Áreas de Formação Continuada</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dados.areasFormacao}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="area" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="especializacao" stackId="a" fill="#3b82f6" name="Especialização" />
              <Bar dataKey="mestrado" stackId="a" fill="#22c55e" name="Mestrado" />
              <Bar dataKey="doutorado" stackId="a" fill="#ef4444" name="Doutorado" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Distribuição por Tipo de Instituição */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tipo de Instituição</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Pública', value: dados.instituicoes.filter(i => i.tipo === 'Pública').reduce((acc, i) => acc + i.quantidade, 0) },
                  { name: 'Privada', value: dados.instituicoes.filter(i => i.tipo === 'Privada').reduce((acc, i) => acc + i.quantidade, 0) }
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                <Cell fill="#3b82f6" />
                <Cell fill="#22c55e" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Instituições de Destino */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Principais Instituições de Destino</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Instituição
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Egressos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Percentual
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dados.instituicoes.map((instituicao, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {instituicao.instituicao}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      instituicao.tipo === 'Pública' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {instituicao.tipo}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {instituicao.quantidade}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {((instituicao.quantidade / 119) * 100).toFixed(1)}%
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

export default RelatorioContinuidadeAcademica