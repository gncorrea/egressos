import React, { useState } from 'react'
import { Users, Briefcase, GraduationCap, Star, Heart, Target, ArrowLeft } from 'lucide-react'
import RelatorioPerfilEgressos from './RelatorioPerfilEgressos'
import RelatorioInsercaoProfissional from './RelatorioInsercaoProfissional'
import RelatorioContinuidadeAcademica from './RelatorioContinuidadeAcademica'
import RelatorioSatisfacaoPercepcao from './RelatorioSatisfacaoPercepcao'
import RelatorioImpactoSocial from './RelatorioImpactoSocial'

type RelatorioView = 'dashboard' | 'perfil' | 'insercao' | 'continuidade' | 'satisfacao' | 'impacto'

const RelatoriosPedagogicos: React.FC = () => {
  const [activeView, setActiveView] = useState<RelatorioView>('dashboard')

  const relatorios = [
    {
      id: 'perfil' as const,
      titulo: 'Perfil dos Egressos',
      descricao: 'Análise demográfica e profissional dos egressos',
      icon: Users,
      color: 'bg-blue-500',
      stats: '187 egressos analisados'
    },
    {
      id: 'insercao' as const,
      titulo: 'Inserção Profissional',
      descricao: 'Empregabilidade e inserção no mercado de trabalho',
      icon: Briefcase,
      color: 'bg-green-500',
      stats: '87.2% taxa de empregabilidade'
    },
    {
      id: 'continuidade' as const,
      titulo: 'Continuidade Acadêmica',
      descricao: 'Formação continuada e pós-graduação',
      icon: GraduationCap,
      color: 'bg-purple-500',
      stats: '68.4% continuam estudando'
    },
    {
      id: 'satisfacao' as const,
      titulo: 'Satisfação e Percepção',
      descricao: 'Avaliação do curso e da instituição',
      icon: Star,
      color: 'bg-yellow-500',
      stats: '4.2/5.0 satisfação média'
    },
    {
      id: 'impacto' as const,
      titulo: 'Impacto Social',
      descricao: 'Contribuição para sociedade e comunidade',
      icon: Heart,
      color: 'bg-red-500',
      stats: '6.090 pessoas beneficiadas'
    }
  ]

  const handleCardClick = (relatorioId: RelatorioView) => {
    setActiveView(relatorioId)
  }

  const handleBackToDashboard = () => {
    setActiveView('dashboard')
  }

  // Renderizar dashboard principal
  const renderDashboard = () => (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <Target className="w-12 h-12 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Relatórios Pedagógicos
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Análise abrangente do desempenho dos egressos e indicadores institucionais para tomada de decisões estratégicas
        </p>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">187</div>
          <div className="text-sm text-gray-600">Total de Egressos</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">87.2%</div>
          <div className="text-sm text-gray-600">Taxa de Empregabilidade</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">68.4%</div>
          <div className="text-sm text-gray-600">Continuam Estudando</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200 text-center">
          <div className="text-3xl font-bold text-yellow-600 mb-2">4.2/5.0</div>
          <div className="text-sm text-gray-600">Satisfação Média</div>
        </div>
      </div>

      {/* Cards de Relatórios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatorios.map((relatorio) => (
          <div
            key={relatorio.id}
            className="bg-white rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 group p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${relatorio.color} group-hover:scale-110 transition-transform`}>
                <relatorio.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Dados atualizados</div>
                <div className="text-xs text-gray-400">Hoje</div>
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              {relatorio.titulo}
            </h3>
            
            <p className="text-gray-600 mb-4 text-sm leading-relaxed">
              {relatorio.descricao}
            </p>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-600">
                {relatorio.stats}
              </span>
              <button
                onClick={() => handleCardClick(relatorio.id)}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors cursor-pointer"
              >
                Ver relatório →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Informações Adicionais */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 border border-blue-200">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Sobre os Relatórios Pedagógicos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm text-gray-700">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <div className="font-medium mb-1">Dados Atualizados</div>
                <div>Informações coletadas através de questionários aplicados aos egressos</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <div className="font-medium mb-1">Análise Estratégica</div>
                <div>Indicadores para tomada de decisões pedagógicas e institucionais</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <div className="font-medium mb-1">Melhoria Contínua</div>
                <div>Base para ajustes curriculares e melhorias na formação</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderRelatorio = () => {
    const commonProps = {
      onBack: handleBackToDashboard
    }

    switch (activeView) {
      case 'perfil':
        return <RelatorioPerfilEgressos {...commonProps} />
      case 'insercao':
        return <RelatorioInsercaoProfissional {...commonProps} />
      case 'continuidade':
        return <RelatorioContinuidadeAcademica {...commonProps} />
      case 'satisfacao':
        return <RelatorioSatisfacaoPercepcao {...commonProps} />
      case 'impacto':
        return <RelatorioImpactoSocial {...commonProps} />
      default:
        return renderDashboard()
    }
  }

  if (activeView === 'dashboard') {
    return renderDashboard()
  } else {
    return renderRelatorio()
  }
}

export default RelatoriosPedagogicos