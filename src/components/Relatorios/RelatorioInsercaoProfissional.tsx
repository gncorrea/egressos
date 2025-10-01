import React, { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { Briefcase, Clock, Building, DollarSign, TrendingUp, Download, ArrowLeft } from 'lucide-react'

interface InsercaoData {
  tempoEmprego: { tempo: string; quantidade: number }[]
  areaAtuacao: { area: string; formacao: number; foraFormacao: number }[]
  tipoVinculo: { tipo: string; quantidade: number; percentual: number }[]
  faixaSalarial: { faixa: string; quantidade: number }[]
  empresas: { empresa: string; quantidade: number; setor: string }[]
  percentualArea: { categoria: string; valor: number }
}

interface RelatorioInsercaoProfissionalProps {
  onBack: () => void
}

const RelatorioInsercaoProfissional: React.FC<RelatorioInsercaoProfissionalProps> = ({ onBack }) => {
  const [dados, setDados] = useState<InsercaoData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDados()
  }, [])

  const fetchDados = async () => {
    try {
      if (import.meta.env.VITE_SUPABASE_URL === 'https://demo.supabase.co' || 
          !import.meta.env.VITE_SUPABASE_URL) {
        
        const mockDados: InsercaoData = {
        tempoEmprego: [
          { tempo: 'Já estava empregado', quantidade: 23 },
          { tempo: 'Menos de 3 meses', quantidade: 45 },
          { tempo: '3 a 6 meses', quantidade: 38 },
          { tempo: '6 meses a 1 ano', quantidade: 32 },
          { tempo: 'Mais de 1 ano', quantidade: 18 },
          { tempo: 'Ainda não conseguiu', quantidade: 8 }
        ],
        areaAtuacao: [
          { area: 'Tecnologia da Informação', formacao: 42, foraFormacao: 8 },
          { area: 'Educação', formacao: 28, foraFormacao: 5 },
          { area: 'Engenharia', formacao: 24, foraFormacao: 6 },
          { area: 'Administração/Gestão', formacao: 18, foraFormacao: 12 },
          { area: 'Saúde', formacao: 15, foraFormacao: 3 },
          { area: 'Design/Criativo', formacao: 12, foraFormacao: 4 }
        ],
        tipoVinculo: [
          { tipo: 'CLT', quantidade: 89, percentual: 53.6 },
          { tipo: 'Pessoa Jurídica (PJ)', quantidade: 28, percentual: 16.9 },
          { tipo: 'Autônomo/Freelancer', quantidade: 24, percentual: 14.5 },
          { tipo: 'Servidor Público', quantidade: 15, percentual: 9.0 },
          { tipo: 'Empreendedor', quantidade: 10, percentual: 6.0 }
        ],
        faixaSalarial: [
          { faixa: 'Até R$ 2.000', quantidade: 18 },
          { faixa: 'R$ 2.001 - R$ 4.000', quantidade: 45 },
          { faixa: 'R$ 4.001 - R$ 6.000', quantidade: 38 },
          { faixa: 'R$ 6.001 - R$ 8.000', quantidade: 28 },
          { faixa: 'R$ 8.001 - R$ 12.000', quantidade: 22 },
          { faixa: 'Acima de R$ 12.000', quantidade: 15 }
        ],
        empresas: [
          { empresa: 'Accenture', quantidade: 8, setor: 'Consultoria/TI' },
          { empresa: 'Prefeitura de BH', quantidade: 7, setor: 'Público' },
          { empresa: 'Vale S.A.', quantidade: 6, setor: 'Mineração' },
          { empresa: 'Banco do Brasil', quantidade: 5, setor: 'Financeiro' },
          { empresa: 'CEMIG', quantidade: 5, setor: 'Energia' },
          { empresa: 'Usiminas', quantidade: 4, setor: 'Siderurgia' },
          { empresa: 'Hospital das Clínicas', quantidade: 4, setor: 'Saúde' },
          { empresa: 'Secretaria de Educação MG', quantidade: 4, setor: 'Público' }
        ],
        percentualArea: { categoria: 'Trabalham na área de formação', valor: 72.3 }
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
      ['RELATÓRIO DE INSERÇÃO PROFISSIONAL'],
      [''],
      ['TEMPO ATÉ PRIMEIRO EMPREGO'],
      ['Tempo', 'Quantidade'],
      ...dados.tempoEmprego.map(item => [item.tempo, item.quantidade.toString()]),
      [''],
      ['TIPO DE VÍNCULO'],
      ['Tipo', 'Quantidade', 'Percentual'],
      ...dados.tipoVinculo.map(item => [item.tipo, item.quantidade.toString(), `${item.percentual}%`]),
      [''],
      ['PRINCIPAIS EMPRESAS'],
      ['Empresa', 'Quantidade', 'Setor'],
      ...dados.empresas.map(item => [item.empresa, item.quantidade.toString(), item.setor])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'relatorio_insercao_profissional.csv'
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
            <Briefcase className="w-8 h-8 text-green-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">Relatório de Inserção Profissional</h1>
          </div>
          <p className="mt-1 text-sm text-gray-600">
            Análise da empregabilidade e inserção no mercado de trabalho
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
            <div className="p-2 bg-green-100 rounded-lg">
              <Briefcase className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Taxa de Empregabilidade</p>
              <p className="text-2xl font-bold text-gray-900">87.2%</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tempo Médio 1º Emprego</p>
              <p className="text-2xl font-bold text-gray-900">4.2 meses</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Trabalham na Área</p>
              <p className="text-2xl font-bold text-gray-900">{dados.percentualArea.valor}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Salário Médio</p>
              <p className="text-2xl font-bold text-gray-900">R$ 5.200</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tempo até Primeiro Emprego */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tempo até Primeiro Emprego</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dados.tempoEmprego}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="tempo" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="quantidade" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tipo de Vínculo */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tipo de Vínculo Empregatício</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dados.tipoVinculo}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ tipo, percentual }) => `${tipo}: ${percentual}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="quantidade"
              >
                {dados.tipoVinculo.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Área de Atuação vs Formação */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Área de Atuação vs Formação</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dados.areaAtuacao}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="area" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="formacao" stackId="a" fill="#22c55e" name="Na área de formação" />
              <Bar dataKey="foraFormacao" stackId="a" fill="#ef4444" name="Fora da área" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Faixa Salarial */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição Salarial</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dados.faixaSalarial}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="faixa" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="quantidade" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Principais Empresas Empregadoras */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Principais Empresas Empregadoras</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Empresa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Setor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Egressos Contratados
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Percentual
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dados.empresas.map((empresa, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {empresa.empresa}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {empresa.setor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {empresa.quantidade}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {((empresa.quantidade / 166) * 100).toFixed(1)}%
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

export default RelatorioInsercaoProfissional