import React, { useState } from 'react'
import { Save, Upload, UserPlus, Users, Download, AlertCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'

interface EgressoForm {
  full_name: string
  email: string
  curso: string
  unidade: string
  ano_conclusao: number
  telefone: string
  endereco: string
  cidade: string
  estado: string
  status_profissional: string
  empresa_atual: string
  cargo_atual: string
  formacao_continuada: string
  linkedin_url: string
  facebook_url: string
  instagram_url: string
  site_pessoal: string
}

const CadastroEgresso: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'individual' | 'lote'>('individual')
  const [formData, setFormData] = useState<EgressoForm>({
    full_name: '',
    email: '',
    curso: '',
    unidade: '',
    ano_conclusao: new Date().getFullYear(),
    telefone: '',
    endereco: '',
    cidade: '',
    estado: '',
    status_profissional: '',
    empresa_atual: '',
    cargo_atual: '',
    formacao_continuada: '',
    linkedin_url: '',
    facebook_url: '',
    instagram_url: '',
    site_pessoal: ''
  })
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [uploadResults, setUploadResults] = useState<{ success: number; errors: string[] } | null>(null)

  const unidadesUEMG = [
    { codigo: 'BH', nome: 'Belo Horizonte' },
    { codigo: 'BARBACENA', nome: 'Barbacena' },
    { codigo: 'CARANGOLA', nome: 'Carangola' },
    { codigo: 'CLAUDIO', nome: 'Cláudio' },
    { codigo: 'DIVINOPOLIS', nome: 'Divinópolis' },
    { codigo: 'FRUTAL', nome: 'Frutal' },
    { codigo: 'IBIRITE', nome: 'Ibirité' },
    { codigo: 'ITUIUTABA', nome: 'Ituiutaba' },
    { codigo: 'JOAO_MONLEVADE', nome: 'João Monlevade' },
    { codigo: 'LEOPOLDINA', nome: 'Leopoldina' },
    { codigo: 'PASSOS', nome: 'Passos' },
    { codigo: 'POCOS_CALDAS', nome: 'Poços de Caldas' },
    { codigo: 'UBA', nome: 'Ubá' },
    { codigo: 'CAMPANHA', nome: 'Campanha' }
  ]

  const cursosPorUnidade = {
    'BH': ['Ciência da Computação', 'Engenharia de Software', 'Sistemas de Informação', 'Design Gráfico'],
    'BARBACENA': ['Administração', 'Pedagogia', 'Educação Física', 'Letras', 'História'],
    'DIVINOPOLIS': ['Engenharia Civil', 'Arquitetura e Urbanismo', 'Engenharia de Produção'],
    'FRUTAL': ['Medicina Veterinária', 'Zootecnia', 'Agronomia', 'Engenharia de Alimentos'],
    'PASSOS': ['Enfermagem', 'Fisioterapia', 'Farmácia', 'Biomedicina'],
    'CARANGOLA': ['Direito', 'Ciências Contábeis', 'Administração'],
    'CLAUDIO': ['Engenharia Ambiental', 'Gestão Ambiental'],
    'IBIRITE': ['Pedagogia', 'Letras', 'Matemática'],
    'ITUIUTABA': ['Educação Física', 'Geografia', 'História'],
    'JOAO_MONLEVADE': ['Engenharia Metalúrgica', 'Engenharia de Materiais'],
    'LEOPOLDINA': ['Direito', 'Administração'],
    'POCOS_CALDAS': ['Turismo', 'Hotelaria', 'Gastronomia'],
    'UBA': ['Medicina', 'Enfermagem', 'Fisioterapia'],
    'CAMPANHA': ['Filosofia', 'Teologia', 'História']
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'ano_conclusao' ? parseInt(value) || 0 : value
    }))
  }

  const handleIndividualSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      // Mock save for demo
      if (import.meta.env.VITE_SUPABASE_URL === 'https://demo.supabase.co' || 
          !import.meta.env.VITE_SUPABASE_URL) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        setMessage('Egresso cadastrado com sucesso! (Modo demonstração)')
        
        // Reset form
        setFormData({
          full_name: '',
          email: '',
          curso: '',
          unidade: '',
          ano_conclusao: new Date().getFullYear(),
          telefone: '',
          endereco: '',
          cidade: '',
          estado: '',
          status_profissional: '',
          empresa_atual: '',
          cargo_atual: '',
          formacao_continuada: '',
          linkedin_url: '',
          facebook_url: '',
          instagram_url: '',
          site_pessoal: ''
        })
        
        setLoading(false)
        return
      }

      // Real implementation would go here
      setLoading(false)
    } catch (error) {
      console.error('Error saving egresso:', error)
      setMessage('Erro ao cadastrar egresso. Tente novamente.')
      setLoading(false)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === 'text/csv') {
      setCsvFile(file)
    } else {
      setMessage('Por favor, selecione um arquivo CSV válido.')
    }
  }

  const handleBatchUpload = async () => {
    if (!csvFile) {
      setMessage('Por favor, selecione um arquivo CSV.')
      return
    }

    setLoading(true)
    setMessage('')
    setUploadResults(null)

    try {
      // Mock batch upload for demo
      if (import.meta.env.VITE_SUPABASE_URL === 'https://demo.supabase.co' || 
          !import.meta.env.VITE_SUPABASE_URL) {
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Simulate processing results
        const mockResults = {
          success: 45,
          errors: [
            'Linha 12: Email já cadastrado - joao@email.com',
            'Linha 28: Curso inválido para a unidade selecionada',
            'Linha 35: Ano de conclusão inválido'
          ]
        }
        
        setUploadResults(mockResults)
        setMessage(`Upload concluído! ${mockResults.success} egressos cadastrados com sucesso.`)
        setCsvFile(null)
        
        setLoading(false)
        return
      }

      // Real batch upload implementation would go here
      setLoading(false)
    } catch (error) {
      console.error('Error uploading batch:', error)
      setMessage('Erro no upload em lote. Tente novamente.')
      setLoading(false)
    }
  }

  const downloadTemplate = () => {
    const csvTemplate = [
      ['full_name', 'email', 'curso', 'unidade', 'ano_conclusao', 'telefone', 'cidade', 'estado', 'status_profissional', 'empresa_atual', 'cargo_atual'],
      ['João Silva', 'joao@email.com', 'Ciência da Computação', 'BH', '2020', '(31) 99999-9999', 'Belo Horizonte', 'MG', 'Empregado', 'Tech Corp', 'Desenvolvedor'],
      ['Maria Santos', 'maria@email.com', 'Administração', 'BARBACENA', '2019', '(32) 88888-8888', 'Barbacena', 'MG', 'Empreendedor', 'Consultoria Própria', 'Consultora']
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvTemplate], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'template_cadastro_egressos.csv'
    link.click()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Cadastro de Egressos</h1>
        <p className="mt-1 text-sm text-gray-600">
          Cadastre egressos individualmente ou em lote através de arquivo CSV
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('individual')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'individual'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <UserPlus className="w-4 h-4 inline mr-2" />
            Cadastro Individual
          </button>
          <button
            onClick={() => setActiveTab('lote')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'lote'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Cadastro em Lote
          </button>
        </nav>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${
          message.includes('sucesso') || message.includes('concluído')
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      {activeTab === 'individual' ? (
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Cadastro Individual</h3>
          </div>

          <form onSubmit={handleIndividualSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unidade UEMG *
                </label>
                <select
                  name="unidade"
                  value={formData.unidade}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Selecione a unidade</option>
                  {unidadesUEMG.map(unidade => (
                    <option key={unidade.codigo} value={unidade.codigo}>
                      {unidade.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Curso *
                </label>
                <select
                  name="curso"
                  value={formData.curso}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Selecione o curso</option>
                  {formData.unidade && cursosPorUnidade[formData.unidade as keyof typeof cursosPorUnidade]?.map(curso => (
                    <option key={curso} value={curso}>
                      {curso}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ano de Conclusão *
                </label>
                <input
                  type="number"
                  name="ano_conclusao"
                  value={formData.ano_conclusao}
                  onChange={handleInputChange}
                  required
                  min="1990"
                  max={new Date().getFullYear()}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone
                </label>
                <input
                  type="tel"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cidade
                </label>
                <input
                  type="text"
                  name="cidade"
                  value={formData.cidade}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Selecione o estado</option>
                  <option value="MG">Minas Gerais</option>
                  <option value="SP">São Paulo</option>
                  <option value="RJ">Rio de Janeiro</option>
                  <option value="ES">Espírito Santo</option>
                  <option value="GO">Goiás</option>
                  <option value="DF">Distrito Federal</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status Profissional
                </label>
                <select
                  name="status_profissional"
                  value={formData.status_profissional}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Selecione...</option>
                  <option value="Empregado">Empregado</option>
                  <option value="Desempregado">Desempregado</option>
                  <option value="Empreendedor">Empreendedor</option>
                  <option value="Estudante">Estudante</option>
                  <option value="Aposentado">Aposentado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Empresa Atual
                </label>
                <input
                  type="text"
                  name="empresa_atual"
                  value={formData.empresa_atual}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cargo Atual
                </label>
                <input
                  type="text"
                  name="cargo_atual"
                  value={formData.cargo_atual}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Endereço Completo
              </label>
              <textarea
                name="endereco"
                value={formData.endereco}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Formação Continuada
              </label>
              <textarea
                name="formacao_continuada"
                value={formData.formacao_continuada}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Especializações, mestrado, doutorado, certificações..."
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Salvando...' : 'Cadastrar Egresso'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Cadastro em Lote</h3>
          </div>

          <div className="p-6 space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Instruções para Upload em Lote:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• O arquivo deve estar no formato CSV</li>
                <li>• Use o template fornecido para garantir a formatação correta</li>
                <li>• Campos obrigatórios: nome, email, curso, unidade, ano_conclusao</li>
                <li>• Máximo de 1000 registros por upload</li>
              </ul>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={downloadTemplate}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Baixar Template CSV
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selecionar Arquivo CSV
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {csvFile && (
                <p className="mt-2 text-sm text-gray-600">
                  Arquivo selecionado: {csvFile.name}
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleBatchUpload}
                disabled={!csvFile || loading}
                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Upload className="w-4 h-4 mr-2" />
                {loading ? 'Processando...' : 'Fazer Upload'}
              </button>
            </div>

            {uploadResults && (
              <div className="mt-6 space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-green-900 mb-2">
                    ✅ Upload Concluído com Sucesso
                  </h4>
                  <p className="text-sm text-green-800">
                    {uploadResults.success} egressos foram cadastrados com sucesso.
                  </p>
                </div>

                {uploadResults.errors.length > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-yellow-900 mb-2 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Erros Encontrados ({uploadResults.errors.length})
                    </h4>
                    <ul className="text-sm text-yellow-800 space-y-1">
                      {uploadResults.errors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default CadastroEgresso