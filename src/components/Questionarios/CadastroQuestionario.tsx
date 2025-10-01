import React, { useState } from 'react'
import { Save, Plus, Trash2, ArrowUp, ArrowDown, Eye, Settings, FileText } from 'lucide-react'
import { supabase } from '../../lib/supabase'

interface Pergunta {
  id: string
  pergunta: string
  tipo: 'multipla_escolha' | 'texto' | 'escala_likert' | 'checkbox' | 'escala_numerica' | 'sim_nao'
  opcoes: string[]
  obrigatoria: boolean
  ordem: number
}

interface QuestionarioForm {
  titulo: string
  descricao: string
  objetivos: string
  categoria: string
  publico_alvo: string
  semestre_aplicacao: string
  data_inicio: string
  data_fim: string
  obrigatorio: boolean
  anonimo: boolean
  perguntas: Pergunta[]
}

const CadastroQuestionario: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'config' | 'perguntas' | 'preview'>('config')
  const [formData, setFormData] = useState<QuestionarioForm>({
    titulo: '',
    descricao: '',
    objetivos: '',
    categoria: 'satisfacao_academica',
    publico_alvo: 'todos',
    semestre_aplicacao: '2024.1',
    data_inicio: '',
    data_fim: '',
    obrigatorio: false,
    anonimo: true,
    perguntas: []
  })
  const [loading, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const tiposQuestao = [
    { value: 'multipla_escolha', label: 'Múltipla Escolha', icon: '◉' },
    { value: 'checkbox', label: 'Caixas de Seleção', icon: '☑' },
    { value: 'texto', label: 'Resposta Longa', icon: '📝' },
    { value: 'escala_likert', label: 'Escala Likert', icon: '📊' },
    { value: 'escala_numerica', label: 'Escala Numérica', icon: '🔢' },
    { value: 'sim_nao', label: 'Sim/Não', icon: '✓' }
  ]

  const categorias = [
    { value: 'satisfacao_academica', label: 'Satisfação Acadêmica' },
    { value: 'infraestrutura', label: 'Infraestrutura' },
    { value: 'servicos_estudantis', label: 'Serviços Estudantis' },
    { value: 'biblioteca', label: 'Biblioteca' },
    { value: 'laboratorios', label: 'Laboratórios' },
    { value: 'vida_academica', label: 'Vida Acadêmica' },
    { value: 'coordenacao', label: 'Coordenação' },
    { value: 'secretaria', label: 'Secretaria' }
  ]

  const publicoAlvo = [
    { value: 'todos', label: 'Todos os Alunos' },
    { value: 'calouros', label: 'Calouros' },
    { value: 'veteranos', label: 'Veteranos' },
    { value: 'formandos', label: 'Formandos' },
    { value: 'pos_graduacao', label: 'Pós-graduação' }
  ]

  const adicionarPergunta = () => {
    const novaPergunta: Pergunta = {
      id: Date.now().toString(),
      pergunta: '',
      tipo: 'multipla_escolha',
      opcoes: ['Opção 1', 'Opção 2'],
      obrigatoria: false,
      ordem: formData.perguntas.length + 1
    }
    setFormData(prev => ({
      ...prev,
      perguntas: [...prev.perguntas, novaPergunta]
    }))
  }

  const removerPergunta = (id: string) => {
    setFormData(prev => ({
      ...prev,
      perguntas: prev.perguntas.filter(p => p.id !== id)
    }))
  }

  const atualizarPergunta = (id: string, campo: keyof Pergunta, valor: any) => {
    setFormData(prev => ({
      ...prev,
      perguntas: prev.perguntas.map(p => 
        p.id === id ? { ...p, [campo]: valor } : p
      )
    }))
  }

  const moverPergunta = (id: string, direcao: 'up' | 'down') => {
    const perguntas = [...formData.perguntas]
    const index = perguntas.findIndex(p => p.id === id)
    
    if (direcao === 'up' && index > 0) {
      [perguntas[index], perguntas[index - 1]] = [perguntas[index - 1], perguntas[index]]
    } else if (direcao === 'down' && index < perguntas.length - 1) {
      [perguntas[index], perguntas[index + 1]] = [perguntas[index + 1], perguntas[index]]
    }
    
    setFormData(prev => ({ ...prev, perguntas }))
  }

  const adicionarOpcao = (perguntaId: string) => {
    const pergunta = formData.perguntas.find(p => p.id === perguntaId)
    if (pergunta) {
      const novasOpcoes = [...pergunta.opcoes, `Opção ${pergunta.opcoes.length + 1}`]
      atualizarPergunta(perguntaId, 'opcoes', novasOpcoes)
    }
  }

  const removerOpcao = (perguntaId: string, opcaoIndex: number) => {
    const pergunta = formData.perguntas.find(p => p.id === perguntaId)
    if (pergunta && pergunta.opcoes.length > 2) {
      const novasOpcoes = pergunta.opcoes.filter((_, index) => index !== opcaoIndex)
      atualizarPergunta(perguntaId, 'opcoes', novasOpcoes)
    }
  }

  const atualizarOpcao = (perguntaId: string, opcaoIndex: number, valor: string) => {
    const pergunta = formData.perguntas.find(p => p.id === perguntaId)
    if (pergunta) {
      const novasOpcoes = [...pergunta.opcoes]
      novasOpcoes[opcaoIndex] = valor
      atualizarPergunta(perguntaId, 'opcoes', novasOpcoes)
    }
  }

  const handleSubmit = async () => {
    setSaving(true)
    setMessage('')

    try {
      // Validações
      if (!formData.titulo.trim()) {
        setMessage('Título é obrigatório')
        setSaving(false)
        return
      }

      if (formData.perguntas.length === 0) {
        setMessage('Adicione pelo menos uma pergunta')
        setSaving(false)
        return
      }

      // Mock save for demo
      if (import.meta.env.VITE_SUPABASE_URL === 'https://demo.supabase.co' || 
          !import.meta.env.VITE_SUPABASE_URL) {
        await new Promise(resolve => setTimeout(resolve, 1500))
        setMessage('Questionário criado com sucesso! (Modo demonstração)')
        
        // Reset form
        setFormData({
          titulo: '',
          descricao: '',
          objetivos: '',
          categoria: 'satisfacao_academica',
          publico_alvo: 'todos',
          semestre_aplicacao: '2024.1',
          data_inicio: '',
          data_fim: '',
          obrigatorio: false,
          anonimo: true,
          perguntas: []
        })
        setActiveTab('config')
        
        setSaving(false)
        return
      }

      // Real implementation would save to Supabase
      setSaving(false)
    } catch (error) {
      console.error('Error saving questionario:', error)
      setMessage('Erro ao criar questionário. Tente novamente.')
      setSaving(false)
    }
  }

  const renderConfiguracoes = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Título do Questionário *
          </label>
          <input
            type="text"
            value={formData.titulo}
            onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ex: Avaliação da Satisfação Acadêmica 2024.1"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descrição
          </label>
          <textarea
            value={formData.descricao}
            onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Descreva o propósito do questionário..."
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Objetivos
          </label>
          <textarea
            value={formData.objetivos}
            onChange={(e) => setFormData(prev => ({ ...prev, objetivos: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Quais são os objetivos deste questionário?"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categoria
          </label>
          <select
            value={formData.categoria}
            onChange={(e) => setFormData(prev => ({ ...prev, categoria: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {categorias.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Público Alvo
          </label>
          <select
            value={formData.publico_alvo}
            onChange={(e) => setFormData(prev => ({ ...prev, publico_alvo: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {publicoAlvo.map(pub => (
              <option key={pub.value} value={pub.value}>{pub.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Semestre de Aplicação
          </label>
          <input
            type="text"
            value={formData.semestre_aplicacao}
            onChange={(e) => setFormData(prev => ({ ...prev, semestre_aplicacao: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ex: 2024.1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data de Início
          </label>
          <input
            type="date"
            value={formData.data_inicio}
            onChange={(e) => setFormData(prev => ({ ...prev, data_inicio: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data de Fim
          </label>
          <input
            type="date"
            value={formData.data_fim}
            onChange={(e) => setFormData(prev => ({ ...prev, data_fim: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.obrigatorio}
            onChange={(e) => setFormData(prev => ({ ...prev, obrigatorio: e.target.checked }))}
            className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-700">Questionário obrigatório</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.anonimo}
            onChange={(e) => setFormData(prev => ({ ...prev, anonimo: e.target.checked }))}
            className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-700">Respostas anônimas</span>
        </label>
      </div>
    </div>
  )

  const renderPerguntas = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">
          Perguntas ({formData.perguntas.length})
        </h3>
        <button
          onClick={adicionarPergunta}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Pergunta
        </button>
      </div>

      {formData.perguntas.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma pergunta adicionada
          </h3>
          <p className="text-gray-600 mb-4">
            Comece adicionando sua primeira pergunta ao questionário
          </p>
          <button
            onClick={adicionarPergunta}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Primeira Pergunta
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {formData.perguntas.map((pergunta, index) => (
            <div key={pergunta.id} className="border border-gray-200 rounded-lg p-6 bg-white">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-500">
                    Pergunta {index + 1}
                  </span>
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                    {tiposQuestao.find(t => t.value === pergunta.tipo)?.label}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => moverPergunta(pergunta.id, 'up')}
                    disabled={index === 0}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moverPergunta(pergunta.id, 'down')}
                    disabled={index === formData.perguntas.length - 1}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removerPergunta(pergunta.id)}
                    className="p-1 text-red-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pergunta
                  </label>
                  <input
                    type="text"
                    value={pergunta.pergunta}
                    onChange={(e) => atualizarPergunta(pergunta.id, 'pergunta', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Digite sua pergunta..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Resposta
                    </label>
                    <select
                      value={pergunta.tipo}
                      onChange={(e) => atualizarPergunta(pergunta.id, 'tipo', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {tiposQuestao.map(tipo => (
                        <option key={tipo.value} value={tipo.value}>
                          {tipo.icon} {tipo.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-end">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={pergunta.obrigatoria}
                        onChange={(e) => atualizarPergunta(pergunta.id, 'obrigatoria', e.target.checked)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Pergunta obrigatória</span>
                    </label>
                  </div>
                </div>

                {(pergunta.tipo === 'multipla_escolha' || pergunta.tipo === 'checkbox') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Opções de Resposta
                    </label>
                    <div className="space-y-2">
                      {pergunta.opcoes.map((opcao, opcaoIndex) => (
                        <div key={opcaoIndex} className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500 w-8">
                            {pergunta.tipo === 'multipla_escolha' ? '◉' : '☑'}
                          </span>
                          <input
                            type="text"
                            value={opcao}
                            onChange={(e) => atualizarOpcao(pergunta.id, opcaoIndex, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          {pergunta.opcoes.length > 2 && (
                            <button
                              onClick={() => removerOpcao(pergunta.id, opcaoIndex)}
                              className="p-1 text-red-400 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={() => adicionarOpcao(pergunta.id)}
                        className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Adicionar opção
                      </button>
                    </div>
                  </div>
                )}

                {pergunta.tipo === 'escala_likert' && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Escala Likert (1-5):</p>
                    <div className="flex items-center space-x-4 text-sm">
                      <span>1 - Discordo totalmente</span>
                      <span>2 - Discordo</span>
                      <span>3 - Neutro</span>
                      <span>4 - Concordo</span>
                      <span>5 - Concordo totalmente</span>
                    </div>
                  </div>
                )}

                {pergunta.tipo === 'escala_numerica' && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Escala numérica de 1 a 10</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderPreview = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {formData.titulo || 'Título do Questionário'}
          </h2>
          {formData.descricao && (
            <p className="text-gray-600 mb-4">{formData.descricao}</p>
          )}
          {formData.objetivos && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">Objetivos:</h3>
              <p className="text-blue-800 text-sm">{formData.objetivos}</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {formData.perguntas.map((pergunta, index) => (
            <div key={pergunta.id} className="border-b border-gray-200 pb-6 last:border-b-0">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                {index + 1}. {pergunta.pergunta || 'Pergunta sem título'}
                {pergunta.obrigatoria && <span className="text-red-500 ml-1">*</span>}
              </h3>

              {pergunta.tipo === 'multipla_escolha' && (
                <div className="space-y-2">
                  {pergunta.opcoes.map((opcao, opcaoIndex) => (
                    <label key={opcaoIndex} className="flex items-center space-x-3">
                      <input type="radio" name={`preview_${pergunta.id}`} className="w-4 h-4" disabled />
                      <span className="text-gray-700">{opcao}</span>
                    </label>
                  ))}
                </div>
              )}

              {pergunta.tipo === 'checkbox' && (
                <div className="space-y-2">
                  {pergunta.opcoes.map((opcao, opcaoIndex) => (
                    <label key={opcaoIndex} className="flex items-center space-x-3">
                      <input type="checkbox" className="w-4 h-4" disabled />
                      <span className="text-gray-700">{opcao}</span>
                    </label>
                  ))}
                </div>
              )}

              {pergunta.tipo === 'texto' && (
                <textarea
                  rows={4}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  placeholder="Resposta longa..."
                />
              )}

              {pergunta.tipo === 'escala_likert' && (
                <div className="space-y-2">
                  {['Discordo totalmente', 'Discordo', 'Neutro', 'Concordo', 'Concordo totalmente'].map((opcao, opcaoIndex) => (
                    <label key={opcaoIndex} className="flex items-center space-x-3">
                      <input type="radio" name={`preview_${pergunta.id}`} className="w-4 h-4" disabled />
                      <span className="text-gray-700">{opcaoIndex + 1} - {opcao}</span>
                    </label>
                  ))}
                </div>
              )}

              {pergunta.tipo === 'escala_numerica' && (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">1</span>
                  <input type="range" min="1" max="10" disabled className="flex-1" />
                  <span className="text-sm text-gray-600">10</span>
                </div>
              )}

              {pergunta.tipo === 'sim_nao' && (
                <div className="space-y-2">
                  <label className="flex items-center space-x-3">
                    <input type="radio" name={`preview_${pergunta.id}`} className="w-4 h-4" disabled />
                    <span className="text-gray-700">Sim</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input type="radio" name={`preview_${pergunta.id}`} className="w-4 h-4" disabled />
                    <span className="text-gray-700">Não</span>
                  </label>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Criar Questionário</h1>
        <p className="mt-1 text-sm text-gray-600">
          Crie questionários personalizados para coletar feedback dos alunos
        </p>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${
          message.includes('sucesso') 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('config')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'config'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Settings className="w-4 h-4 inline mr-2" />
            Configurações
          </button>
          <button
            onClick={() => setActiveTab('perguntas')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'perguntas'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Perguntas ({formData.perguntas.length})
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'preview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Eye className="w-4 h-4 inline mr-2" />
            Visualizar
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white shadow rounded-lg p-6">
        {activeTab === 'config' && renderConfiguracoes()}
        {activeTab === 'perguntas' && renderPerguntas()}
        {activeTab === 'preview' && renderPreview()}
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={handleSubmit}
          disabled={loading || !formData.titulo.trim() || formData.perguntas.length === 0}
          className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Salvando...' : 'Criar Questionário'}
        </button>
      </div>
    </div>
  )
}

export default CadastroQuestionario