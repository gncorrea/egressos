import React, { useState } from 'react'
import { Star, Send, ArrowLeft } from 'lucide-react'

interface AvaliacaoEventoProps {
  eventoId: string
  eventoTitulo: string
  onBack: () => void
  onSubmit: (avaliacao: any) => void
}

const AvaliacaoEvento: React.FC<AvaliacaoEventoProps> = ({ 
  eventoId, 
  eventoTitulo, 
  onBack, 
  onSubmit 
}) => {
  const [avaliacao, setAvaliacao] = useState({
    avaliacao_geral: 0,
    organizacao: 0,
    conteudo: 0,
    palestrantes: 0,
    infraestrutura: 0,
    recomendaria: null as boolean | null,
    pontos_positivos: '',
    sugestoes_melhoria: '',
    outros_eventos_interesse: '',
    comentarios_adicionais: ''
  })

  const [saving, setSaving] = useState(false)

  const handleStarClick = (campo: string, valor: number) => {
    setAvaliacao(prev => ({ ...prev, [campo]: valor }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      onSubmit(avaliacao)
    } catch (error) {
      console.error('Error saving evaluation:', error)
    } finally {
      setSaving(false)
    }
  }

  const renderStars = (campo: string, valor: number) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleStarClick(campo, star)}
            className={`w-8 h-8 ${
              star <= valor 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300 hover:text-yellow-400'
            } transition-colors`}
          >
            <Star className="w-full h-full" />
          </button>
        ))}
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
                Avaliação do Evento
              </h1>
              <p className="text-gray-600 mt-1">
                {eventoTitulo}
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

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Avaliações com Estrelas */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Avalie os aspectos do evento
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Avaliação Geral *
                </label>
                {renderStars('avaliacao_geral', avaliacao.avaliacao_geral)}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organização
                </label>
                {renderStars('organizacao', avaliacao.organizacao)}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qualidade do Conteúdo
                </label>
                {renderStars('conteudo', avaliacao.conteudo)}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Palestrantes
                </label>
                {renderStars('palestrantes', avaliacao.palestrantes)}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Infraestrutura
                </label>
                {renderStars('infraestrutura', avaliacao.infraestrutura)}
              </div>
            </div>
          </div>

          {/* Recomendação */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Você recomendaria este evento para outras pessoas? *
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="recomendaria"
                  checked={avaliacao.recomendaria === true}
                  onChange={() => setAvaliacao(prev => ({ ...prev, recomendaria: true }))}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">Sim</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="recomendaria"
                  checked={avaliacao.recomendaria === false}
                  onChange={() => setAvaliacao(prev => ({ ...prev, recomendaria: false }))}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">Não</span>
              </label>
            </div>
          </div>

          {/* Comentários */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Comentários e Sugestões
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pontos Positivos
              </label>
              <textarea
                value={avaliacao.pontos_positivos}
                onChange={(e) => setAvaliacao(prev => ({ ...prev, pontos_positivos: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="O que você mais gostou no evento?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sugestões de Melhoria
              </label>
              <textarea
                value={avaliacao.sugestoes_melhoria}
                onChange={(e) => setAvaliacao(prev => ({ ...prev, sugestoes_melhoria: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Como podemos melhorar eventos futuros?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Outros Eventos de Interesse
              </label>
              <textarea
                value={avaliacao.outros_eventos_interesse}
                onChange={(e) => setAvaliacao(prev => ({ ...prev, outros_eventos_interesse: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Que tipos de eventos você gostaria de ver no futuro?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comentários Adicionais
              </label>
              <textarea
                value={avaliacao.comentarios_adicionais}
                onChange={(e) => setAvaliacao(prev => ({ ...prev, comentarios_adicionais: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Algum comentário adicional sobre o evento?"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving || avaliacao.avaliacao_geral === 0 || avaliacao.recomendaria === null}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4 mr-2" />
              {saving ? 'Enviando...' : 'Enviar Avaliação'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AvaliacaoEvento