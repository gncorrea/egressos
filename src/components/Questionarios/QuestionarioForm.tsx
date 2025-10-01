import React, { useState, useEffect } from 'react'
import { Save, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { PerguntaTemplate, QuestionarioTemplate } from '../../types'

interface QuestionarioFormProps {
  questionarioId: string
  onBack: () => void
}

interface PerguntaComResposta extends PerguntaTemplate {
  resposta?: string
  valor_numerico?: number
}

const QuestionarioForm: React.FC<QuestionarioFormProps> = ({ questionarioId, onBack }) => {
  const { user } = useAuth()
  const [perguntas, setPerguntas] = useState<PerguntaComResposta[]>([])
  const [questionarioInfo, setQuestionarioInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchQuestionarioData()
  }, [questionarioId])

  const fetchQuestionarioData = async () => {
    try {
      // Mock data for demo
      if (import.meta.env.VITE_SUPABASE_URL === 'https://demo.supabase.co' || 
          !import.meta.env.VITE_SUPABASE_URL) {
        
        const mockQuestionario = {
          id: questionarioId,
          titulo: questionarioId === '1' ? 'Pesquisa de Inserção Profissional 2024' : 
                  questionarioId === '2' ? 'Pesquisa de Formação Continuada 2024' :
                  'Avaliação do Projeto Pedagógico 2024.1',
          descricao: questionarioId === '1' ? 'Avaliação da empregabilidade dos egressos da UEMG' :
                     questionarioId === '2' ? 'Avaliação da satisfação e continuidade dos estudos dos egressos' :
                     'Questionário para avaliar a adequação do projeto pedagógico do curso'
        }
        
        let mockPerguntas: PerguntaComResposta[] = []
        
        if (questionarioId === '1') {
          // Questionário de Inserção Profissional
          mockPerguntas = [
            {
              id: '1',
              questionario_template_id: '1',
              pergunta: 'Ano de conclusão do curso',
              tipo: 'escala_numerica' as const,
              opcoes: null,
              obrigatoria: true,
              ordem: 1,
              categoria_resposta: 'ano_conclusao',
              peso: 2,
              created_at: new Date().toISOString()
            },
            {
              id: '2',
              questionario_template_id: '1',
              pergunta: 'Você está atualmente empregado?',
              tipo: 'multipla_escolha' as const,
              opcoes: ['Sim, na área de formação', 'Sim, mas em outra área', 'Não estou empregado'],
              obrigatoria: true,
              ordem: 2,
              categoria_resposta: 'situacao_emprego',
              peso: 5,
              created_at: new Date().toISOString()
            },
            {
              id: '3',
              questionario_template_id: '1',
              pergunta: 'Tempo até conseguir o primeiro emprego após a graduação:',
              tipo: 'multipla_escolha' as const,
              opcoes: ['Menos de 6 meses', 'Entre 6 e 12 meses', 'Mais de 12 meses', 'Ainda não consegui emprego'],
              obrigatoria: true,
              ordem: 3,
              categoria_resposta: 'tempo_primeiro_emprego',
              peso: 4,
              created_at: new Date().toISOString()
            },
            {
              id: '4',
              questionario_template_id: '1',
              pergunta: 'Tipo de vínculo atual:',
              tipo: 'multipla_escolha' as const,
              opcoes: ['CLT', 'Estágio', 'Autônomo / Freelancer', 'Empreendedor', 'Outro'],
              obrigatoria: true,
              ordem: 4,
              categoria_resposta: 'tipo_vinculo',
              peso: 3,
              created_at: new Date().toISOString()
            },
            {
              id: '5',
              questionario_template_id: '1',
              pergunta: 'Se selecionou "Outro" no tipo de vínculo, especifique:',
              tipo: 'texto' as const,
              opcoes: null,
              obrigatoria: false,
              ordem: 5,
              categoria_resposta: 'outro_vinculo',
              peso: 1,
              created_at: new Date().toISOString()
            },
            {
              id: '6',
              questionario_template_id: '1',
              pergunta: 'Em uma escala de 1 a 5, avalie o quanto o curso contribuiu para sua inserção profissional',
              tipo: 'escala_likert' as const,
              opcoes: ['1 - Não contribuiu', '2 - Contribuiu pouco', '3 - Contribuiu moderadamente', '4 - Contribuiu muito', '5 - Contribuiu extremamente'],
              obrigatoria: true,
              ordem: 6,
              categoria_resposta: 'contribuicao_curso',
              peso: 5,
              created_at: new Date().toISOString()
            },
            {
              id: '7',
              questionario_template_id: '1',
              pergunta: 'Sugestões de melhorias na formação para aumentar a empregabilidade:',
              tipo: 'texto' as const,
              opcoes: null,
              obrigatoria: false,
              ordem: 7,
              categoria_resposta: 'sugestoes_empregabilidade',
              peso: 3,
              created_at: new Date().toISOString()
            }
          ]
        } else if (questionarioId === '2') {
          // Questionário de Formação Continuada e Satisfação
          mockPerguntas = [
            {
              id: '8',
              questionario_template_id: '2',
              pergunta: 'Após a graduação, você realizou algum curso de pós-graduação?',
              tipo: 'multipla_escolha' as const,
              opcoes: ['Especialização', 'Mestrado', 'Doutorado', 'MBA', 'Não realizei'],
              obrigatoria: true,
              ordem: 1,
              categoria_resposta: 'pos_graduacao',
              peso: 4,
              created_at: new Date().toISOString()
            },
            {
              id: '9',
              questionario_template_id: '2',
              pergunta: 'O curso contribuiu para que você se sentisse preparado para continuar estudando?',
              tipo: 'multipla_escolha' as const,
              opcoes: ['Sim, totalmente', 'Parcialmente', 'Não'],
              obrigatoria: true,
              ordem: 2,
              categoria_resposta: 'preparacao_estudos',
              peso: 4,
              created_at: new Date().toISOString()
            },
            {
              id: '10',
              questionario_template_id: '2',
              pergunta: 'Em uma escala de 1 a 5, avalie sua satisfação geral com a formação recebida',
              tipo: 'escala_likert' as const,
              opcoes: ['1 - Muito insatisfeito', '2 - Insatisfeito', '3 - Neutro', '4 - Satisfeito', '5 - Muito satisfeito'],
              obrigatoria: true,
              ordem: 3,
              categoria_resposta: 'satisfacao_geral',
              peso: 5,
              created_at: new Date().toISOString()
            },
            {
              id: '11',
              questionario_template_id: '2',
              pergunta: 'Quais competências adquiridas no curso você mais utiliza atualmente?',
              tipo: 'texto' as const,
              opcoes: null,
              obrigatoria: false,
              ordem: 4,
              categoria_resposta: 'competencias_utilizadas',
              peso: 3,
              created_at: new Date().toISOString()
            },
            {
              id: '12',
              questionario_template_id: '2',
              pergunta: 'O que você considera que deveria ter sido melhor trabalhado durante o curso?',
              tipo: 'texto' as const,
              opcoes: null,
              obrigatoria: false,
              ordem: 5,
              categoria_resposta: 'melhorias_curso',
              peso: 4,
              created_at: new Date().toISOString()
            },
            {
              id: '13',
              questionario_template_id: '2',
              pergunta: 'Você participaria de eventos de ex-alunos promovidos pela instituição?',
              tipo: 'multipla_escolha' as const,
              opcoes: ['Sim', 'Talvez', 'Não'],
              obrigatoria: true,
              ordem: 6,
              categoria_resposta: 'participacao_eventos',
              peso: 2,
              created_at: new Date().toISOString()
            }
          ]
        } else {
          // Questionário padrão (Projeto Pedagógico)
          mockPerguntas = [
          {
            id: '1',
            questionario_template_id: '1',
            pergunta: 'Como você avalia a adequação do currículo do seu curso às demandas do mercado de trabalho?',
            tipo: 'escala_likert' as const,
            opcoes: ['Muito inadequado', 'Inadequado', 'Neutro', 'Adequado', 'Muito adequado'],
            obrigatoria: true,
            ordem: 1,
            categoria_resposta: 'adequacao_curriculo',
            peso: 3,
            created_at: new Date().toISOString()
          },
          {
            id: '2',
            questionario_template_id: '1',
            pergunta: 'O curso proporcionou conhecimentos teóricos suficientes para sua atuação profissional?',
            tipo: 'escala_likert' as const,
            opcoes: ['Discordo totalmente', 'Discordo', 'Neutro', 'Concordo', 'Concordo totalmente'],
            obrigatoria: true,
            ordem: 2,
            categoria_resposta: 'conhecimento_teorico',
            peso: 3,
            created_at: new Date().toISOString()
          },
          {
            id: '3',
            questionario_template_id: '1',
            pergunta: 'O curso proporcionou conhecimentos práticos suficientes para sua atuação profissional?',
            tipo: 'escala_likert' as const,
            opcoes: ['Discordo totalmente', 'Discordo', 'Neutro', 'Concordo', 'Concordo totalmente'],
            obrigatoria: true,
            ordem: 3,
            categoria_resposta: 'conhecimento_pratico',
            peso: 3,
            created_at: new Date().toISOString()
          },
          {
            id: '4',
            questionario_template_id: '1',
            pergunta: 'Quais disciplinas você considera que deveriam ser incluídas ou ter maior carga horária?',
            tipo: 'texto' as const,
            opcoes: null,
            obrigatoria: false,
            ordem: 4,
            categoria_resposta: 'sugestao_disciplinas',
            peso: 2,
            created_at: new Date().toISOString()
          },
          {
            id: '5',
            questionario_template_id: '1',
            pergunta: 'Como você avalia a metodologia de ensino utilizada no curso?',
            tipo: 'escala_likert' as const,
            opcoes: ['Muito ruim', 'Ruim', 'Regular', 'Boa', 'Excelente'],
            obrigatoria: true,
            ordem: 5,
            categoria_resposta: 'metodologia_ensino',
            peso: 3,
            created_at: new Date().toISOString()
          }
          ]
        }
        
        setQuestionarioInfo(mockQuestionario)
        setPerguntas(mockPerguntas)
        setLoading(false)
        return
      }

      // Real Supabase queries would go here
      setLoading(false)
    } catch (error) {
      console.error('Error fetching questionario data:', error)
      setLoading(false)
    }
  }

  const handleRespostaChange = (perguntaId: string, resposta: string, valorNumerico?: number) => {
    setPerguntas(prev => prev.map(p => 
      p.id === perguntaId 
        ? { ...p, resposta, valor_numerico: valorNumerico }
        : p
    ))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      // Validate required questions
      const unansweredRequired = perguntas.filter(p => p.obrigatoria && !p.resposta)
      if (unansweredRequired.length > 0) {
        setMessage('Por favor, responda todas as perguntas obrigatórias.')
        setSaving(false)
        return
      }

      // Mock save for demo
      if (import.meta.env.VITE_SUPABASE_URL === 'https://demo.supabase.co' || 
          !import.meta.env.VITE_SUPABASE_URL) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        setMessage('Questionário respondido com sucesso! Obrigado pela sua participação.')
        
        // Auto redirect after success
        setTimeout(() => {
          onBack()
        }, 2000)
        
        setSaving(false)
        return
      }

      // Real save logic would go here
      setSaving(false)
    } catch (error) {
      console.error('Error saving responses:', error)
      setMessage('Erro ao salvar respostas. Tente novamente.')
      setSaving(false)
    }
  }

  const renderPergunta = (pergunta: PerguntaComResposta) => {
    switch (pergunta.tipo) {
      case 'escala_likert':
        return (
          <div className="space-y-2">
            {pergunta.opcoes?.map((opcao, index) => (
              <label key={index} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name={`pergunta_${pergunta.id}`}
                  value={opcao}
                  checked={pergunta.resposta === opcao}
                  onChange={(e) => handleRespostaChange(pergunta.id, e.target.value, index + 1)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">{opcao}</span>
              </label>
            ))}
          </div>
        )
      
      case 'multipla_escolha':
        return (
          <div className="space-y-2">
            {pergunta.opcoes?.map((opcao, index) => (
              <label key={index} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name={`pergunta_${pergunta.id}`}
                  value={opcao}
                  checked={pergunta.resposta === opcao}
                  onChange={(e) => handleRespostaChange(pergunta.id, e.target.value)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">{opcao}</span>
              </label>
            ))}
          </div>
        )
      
      case 'checkbox':
        return (
          <div className="space-y-2">
            {pergunta.opcoes?.map((opcao, index) => {
              const selectedOptions = pergunta.resposta ? pergunta.resposta.split(',') : []
              return (
                <label key={index} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedOptions.includes(opcao)}
                    onChange={(e) => {
                      const currentOptions = pergunta.resposta ? pergunta.resposta.split(',') : []
                      let newOptions
                      if (e.target.checked) {
                        newOptions = [...currentOptions, opcao]
                      } else {
                        newOptions = currentOptions.filter(opt => opt !== opcao)
                      }
                      handleRespostaChange(pergunta.id, newOptions.join(','))
                    }}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
                  />
                  <span className="text-gray-700">{opcao}</span>
                </label>
              )
            })}
          </div>
        )
      
      case 'texto':
        return (
          <textarea
            value={pergunta.resposta || ''}
            onChange={(e) => handleRespostaChange(pergunta.id, e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Digite sua resposta..."
          />
        )
      
      case 'escala_numerica':
        return (
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">1</span>
            <input
              type="range"
              min="1"
              max="10"
              value={pergunta.valor_numerico || 1}
              onChange={(e) => {
                const valor = parseInt(e.target.value)
                handleRespostaChange(pergunta.id, valor.toString(), valor)
              }}
              className="flex-1"
            />
            <span className="text-sm text-gray-600">10</span>
            <span className="text-sm font-medium text-blue-600 min-w-[2rem]">
              {pergunta.valor_numerico || 1}
            </span>
          </div>
        )
      
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {questionarioInfo?.titulo}
              </h1>
              <p className="text-gray-600 mt-1">
                {questionarioInfo?.descricao}
              </p>
            </div>
            <button
              onClick={onBack}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {message && (
            <div className={`mb-6 p-4 rounded-lg flex items-center ${
              message.includes('sucesso') 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message.includes('sucesso') ? (
                <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              )}
              {message}
            </div>
          )}

          <div className="space-y-8">
            {perguntas.map((pergunta, index) => (
              <div key={pergunta.id} className="border-b border-gray-200 pb-8 last:border-b-0">
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {index + 1}. {pergunta.pergunta}
                    {pergunta.obrigatoria && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </h3>
                </div>
                
                {renderPergunta(pergunta)}
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Salvando...' : 'Enviar Respostas'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default QuestionarioForm