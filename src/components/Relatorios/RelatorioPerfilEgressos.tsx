import React, { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { Users, MapPin, GraduationCap, Calendar, Download, Filter, ArrowLeft, Target } from 'lucide-react'
import { supabase } from '../../lib/supabase'

interface PerfilData {
  faixaEtaria: { faixa: string; quantidade: number }[]
  genero: { genero: string; quantidade: number }[]
  localidade: { estado: string; cidade: string; quantidade: number }[]
  cursos: { curso: string; quantidade: number; tempoMedio: number }[]
  situacaoMercado: { situacao: string; quantidade: number; percentual: number }[]
}

interface RelatorioPerfilEgressosProps {
  onBack: () => void
}

const RelatorioPerfilEgressos: React.FC<RelatorioPerfilEgressosProps> = ({ onBack }) => {
  const [dados, setDados] = useState<PerfilData | null>(null)
  const [filtros, setFiltros] = useState({
    anoInicio: '',
    anoFim: '',
    curso: '',
    unidade: ''
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDados()
  }, [filtros])

  const fetchDados = async () => {
    try {
      // Mock data for demo
      if (import.meta.env.VITE_SUPABASE_URL === 'https://demo.supabase.co' || 
          !import.meta.env.VITE_SUPABASE_URL) {
        
        const mockDados: PerfilData = {
        faixaEtaria: [
          { faixa: '22-25 anos', quantidade: 45 },
          { faixa: '26-30 anos', quantidade: 67 },
          { faixa: '31-35 anos', quantidade: 38 },
          { faixa: '36-40 anos', quantidade: 22 },
          { faixa: '41+ anos', quantidade: 15 }
        ],
        genero: [
          { genero: 'Feminino', quantidade: 98 },
          { genero: 'Masculino', quantidade: 89 },
          { genero: 'Não informado', quantidade: 0 }
        ],
        localidade: [
          { estado: 'MG', cidade: 'Belo Horizonte', quantidade: 45 },
          { estado: 'MG', cidade: 'Contagem', quantidade: 23 },
          { estado: 'SP', cidade: 'São Paulo', quantidade: 34 },
          { estado: 'RJ', cidade: 'Rio de Janeiro', quantidade: 18 },
          { estado: 'MG', cidade: 'Uberlândia', quantidade: 15 },
          { estado: 'MG', cidade: 'Juiz de Fora', quantidade: 12 },
          { estado: 'GO', cidade: 'Goiânia', quantidade: 10 },
          { estado: 'ES', cidade: 'Vitória', quantidade: 8 }
        ],
        cursos: [
          { curso: 'Ciência da Computação', quantidade: 45, tempoMedio: 4.2 },
          { curso: 'Engenharia de Software', quantidade: 38, tempoMedio: 4.1 },
          { curso: 'Administração', quantidade: 32, tempoMedio: 4.3 },
          { curso: 'Pedagogia', quantidade: 28, tempoMedio: 4.0 },
          { curso: 'Engenharia Civil', quantidade: 24, tempoMedio: 5.1 },
          { curso: 'Design Gráfico', quantidade: 20, tempoMedio: 3.8 }
        ],
        situacaoMercado: [
          { situacao: 'Empregado na área', quantidade: 89, percentual: 47.6 },
          { situacao: 'Empregado fora da área', quantidade: 34, percentual: 18.2 },
          { situacao: 'Autônomo/Freelancer', quantidade: 28, percentual: 15.0 },
          { situacao: 'Empreendedor', quantidade: 18, percentual: 9.6 },
          { situacao: 'Pós-graduação', quantidade: 12, percentual: 6.4 },
          { situacao: 'Desempregado', quantidade: 6, percentual: 3.2 }
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
      ['RELATÓRIO DE PERFIL DOS EGRESSOS'],
      [''],
      ['FAIXA ETÁRIA'],
      ['Faixa', 'Quantidade'],
      ...dados.faixaEtaria.map(item => [item.faixa, item.quantidade.toString()]),
      [''],
      ['GÊNERO'],
      ['Gênero', 'Quantidade'],
      ...dados.genero.map(item => [item.genero, item.quantidade.toString()]),
      [''],
      ['SITUAÇÃO NO MERCADO'],
      ['Situação', 'Quantidade', 'Percentual'],
      ...dados.situacaoMercado.map(item => [item.situacao, item.quantidade.toString(), `${item.percentual}%`])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'relatorio_perfil_egressos.csv'
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
            <Users className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">Relatório de Perfil dos Egressos</h1>
          </div>
          <p className="mt-1 text-sm text-gray-600">
            Análise demográfica e profissional dos egressos da UEMG
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

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
        <div className="flex items-center space-x-2 mb-3">
          <Filter className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-medium text-gray-900">Filtros</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ano Início</label>
            <input
              type="number"
              value={filtros.anoInicio}
              onChange={(e) => setFiltros(prev => ({ ...prev, anoInicio: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="2020"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ano Fim</label>
            <input
              type="number"
              value={filtros.anoFim}
              onChange={(e) => setFiltros(prev => ({ ...prev, anoFim: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="2024"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Curso</label>
            <select
              value={filtros.curso}
              onChange={(e) => setFiltros(prev => ({ ...prev, curso: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos os cursos</option>
              {dados.cursos.map(curso => (
                <option key={curso.curso} value={curso.curso}>{curso.curso}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Unidade</label>
            <select
              value={filtros.unidade}
              onChange={(e) => setFiltros(prev => ({ ...prev, unidade: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas as unidades</option>
              <option value="BH">Belo Horizonte</option>
              <option value="BARBACENA">Barbacena</option>
              <option value="DIVINOPOLIS">Divinópolis</option>
            </select>
          </div>
        </div>
      </div>

      {/* Indicadores Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total de Egressos</p>
              <p className="text-2xl font-bold text-gray-900">187</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <GraduationCap className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tempo Médio Conclusão</p>
              <p className="text-2xl font-bold text-gray-900">4.3 anos</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <MapPin className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Estados Representados</p>
              <p className="text-2xl font-bold text-gray-900">4</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Idade Média</p>
              <p className="text-2xl font-bold text-gray-900">28.5 anos</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribuição por Faixa Etária */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição por Faixa Etária</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dados.faixaEtaria}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="faixa" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="quantidade" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Distribuição por Gênero */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição por Gênero</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dados.genero}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ genero, quantidade }) => `${genero}: ${quantidade}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="quantidade"
              >
                {dados.genero.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Situação no Mercado de Trabalho */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Situação no Mercado de Trabalho</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dados.situacaoMercado} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="situacao" type="category" width={120} />
              <Tooltip />
              <Bar dataKey="quantidade" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Cursos por Quantidade de Egressos */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Egressos por Curso</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dados.cursos}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="curso" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="quantidade" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabela de Localidades */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Distribuição Geográfica</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cidade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantidade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Percentual
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dados.localidade.map((local, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {local.estado}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {local.cidade}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {local.quantidade}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {((local.quantidade / 187) * 100).toFixed(1)}%
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

export default RelatorioPerfilEgressos