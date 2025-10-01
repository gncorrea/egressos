import React, { useState, useEffect } from 'react'
import { Users, FileText, TrendingUp, Calendar } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

interface Stats {
  totalEgressos: number
  egressosEmpregados: number
  questionariosAtivos: number
  proximosEventos: number
}

const CoordenacaoDashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    totalEgressos: 0,
    egressosEmpregados: 0,
    questionariosAtivos: 0,
    proximosEventos: 0
  })
  const [empregabilidadeData, setEmpregabilidadeData] = useState([])
  const [cursoData, setCursoData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Skip data fetch if using placeholder Supabase
      if (import.meta.env.VITE_SUPABASE_URL === 'https://placeholder.supabase.co' || 
          !import.meta.env.VITE_SUPABASE_URL) {
        // Set mock data
        const mockStats = {
          totalEgressos: 150,
          egressosEmpregados: 120,
          questionariosAtivos: 2,
          proximosEventos: 3
        }
        
        setStats(mockStats)
        
        setEmpregabilidadeData([
          { status: 'Empregado', count: 120 },
          { status: 'Desempregado', count: 30 },
        ] as any)
        
        setCursoData([
          { curso: 'Ciência da Computação', egressos: 45 },
          { curso: 'Engenharia de Software', egressos: 38 },
          { curso: 'Sistemas de Informação', egressos: 35 },
          { curso: 'Análise e Desenvolvimento', egressos: 32 }
        ] as any)
        
        setLoading(false)
        return
      }

      // Buscar estatísticas gerais
      const { data: egressos } = await supabase
        .from('egressos')
        .select('*')

      const { data: questionarios } = await supabase
        .from('questionarios')
        .select('*')
        .eq('ativo', true)

      const { data: eventos } = await supabase
        .from('eventos')
        .select('*')
        .gte('data_evento', new Date().toISOString())

      const totalEgressos = egressos?.length || 0
      const egressosEmpregados = egressos?.filter(e => e.status_profissional === 'Empregado').length || 0

      setStats({
        totalEgressos,
        egressosEmpregados,
        questionariosAtivos: questionarios?.length || 0,
        proximosEventos: eventos?.length || 0
      })

      // Dados para gráfico de empregabilidade
      const empregabilidade = [
        { status: 'Empregado', count: egressosEmpregados },
        { status: 'Desempregado', count: totalEgressos - egressosEmpregados },
      ]
      setEmpregabilidadeData(empregabilidade as any)

      // Dados por curso
      const cursoStats = egressos?.reduce((acc: any, egresso) => {
        acc[egresso.curso] = (acc[egresso.curso] || 0) + 1
        return acc
      }, {})

      const cursosChart = Object.entries(cursoStats || {}).map(([curso, count]) => ({
        curso,
        egressos: count
      }))
      setCursoData(cursosChart as any)

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
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

  const statsCards = [
    {
      name: 'Total de Egressos',
      value: stats.totalEgressos,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Egressos Empregados',
      value: stats.egressosEmpregados,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Questionários Ativos',
      value: stats.questionariosAtivos,
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      name: 'Próximos Eventos',
      value: stats.proximosEventos,
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ]

  const COLORS = ['#22c55e', '#ef4444']

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard - Coordenação</h1>
        <p className="mt-1 text-sm text-gray-600">
          Visão geral do desempenho dos egressos e indicadores institucionais
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat) => (
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
        {/* Gráfico de Empregabilidade */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Status de Empregabilidade
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={empregabilidadeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ status, count }) => `${status}: ${count}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {empregabilidadeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico por Curso */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Egressos por Curso
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={cursoData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="curso" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="egressos" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Taxa de Empregabilidade */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Indicadores de Desempenho
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {stats.totalEgressos > 0 ? Math.round((stats.egressosEmpregados / stats.totalEgressos) * 100) : 0}%
            </div>
            <div className="text-sm text-gray-500">Taxa de Empregabilidade</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {stats.totalEgressos}
            </div>
            <div className="text-sm text-gray-500">Total de Egressos</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              {stats.questionariosAtivos}
            </div>
            <div className="text-sm text-gray-500">Pesquisas Ativas</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CoordenacaoDashboard