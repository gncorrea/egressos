import React, { useState } from 'react'
import { Save, UserCheck, Mail, Phone, MapPin, GraduationCap } from 'lucide-react'
import { supabase } from '../../lib/supabase'

interface CoordenadorForm {
  full_name: string
  email: string
  telefone: string
  curso_coordenado: string
  unidade: string
  formacao_academica: string
  experiencia_profissional: string
  data_inicio_coordenacao: string
  endereco: string
  cidade: string
  estado: string
  cpf: string
  rg: string
  data_nascimento: string
}

const CadastroCoordenador: React.FC = () => {
  const [formData, setFormData] = useState<CoordenadorForm>({
    full_name: '',
    email: '',
    telefone: '',
    curso_coordenado: '',
    unidade: '',
    formacao_academica: '',
    experiencia_profissional: '',
    data_inicio_coordenacao: '',
    endereco: '',
    cidade: '',
    estado: '',
    cpf: '',
    rg: '',
    data_nascimento: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

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
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      // Mock save for demo
      if (import.meta.env.VITE_SUPABASE_URL === 'https://demo.supabase.co' || 
          !import.meta.env.VITE_SUPABASE_URL) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        setMessage('Coordenador cadastrado com sucesso! (Modo demonstração)')
        
        // Reset form
        setFormData({
          full_name: '',
          email: '',
          telefone: '',
          curso_coordenado: '',
          unidade: '',
          formacao_academica: '',
          experiencia_profissional: '',
          data_inicio_coordenacao: '',
          endereco: '',
          cidade: '',
          estado: '',
          cpf: '',
          rg: '',
          data_nascimento: ''
        })
        
        setLoading(false)
        return
      }

      // Real implementation would go here
      setLoading(false)
    } catch (error) {
      console.error('Error saving coordenador:', error)
      setMessage('Erro ao cadastrar coordenador. Tente novamente.')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center">
          <UserCheck className="w-6 h-6 text-blue-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">Cadastro de Coordenador</h1>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {message && (
            <div className={`p-4 rounded-lg ${
              message.includes('sucesso') 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          {/* Informações Pessoais */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Mail className="w-5 h-5 mr-2 text-blue-600" />
              Informações Pessoais
            </h3>
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
                  Email Institucional *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="coordenador@uemg.br"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CPF *
                </label>
                <input
                  type="text"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="000.000.000-00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  RG
                </label>
                <input
                  type="text"
                  name="rg"
                  value={formData.rg}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="MG-00.000.000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Nascimento
                </label>
                <input
                  type="date"
                  name="data_nascimento"
                  value={formData.data_nascimento}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone *
                </label>
                <input
                  type="tel"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="(31) 99999-9999"
                />
              </div>
            </div>
          </div>

          {/* Informações Acadêmicas */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <GraduationCap className="w-5 h-5 mr-2 text-blue-600" />
              Informações Acadêmicas e Profissionais
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  Curso Coordenado *
                </label>
                <select
                  name="curso_coordenado"
                  value={formData.curso_coordenado}
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
                  Data de Início na Coordenação
                </label>
                <input
                  type="date"
                  name="data_inicio_coordenacao"
                  value={formData.data_inicio_coordenacao}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Formação Acadêmica *
              </label>
              <textarea
                name="formacao_academica"
                value={formData.formacao_academica}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ex: Doutorado em Ciência da Computação - UFMG (2015), Mestrado em Sistemas de Informação - PUC-MG (2010)..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experiência Profissional
              </label>
              <textarea
                name="experiencia_profissional"
                value={formData.experiencia_profissional}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Descreva a experiência profissional relevante, cargos anteriores, projetos importantes..."
              />
            </div>
          </div>

          {/* Informações de Endereço */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-blue-600" />
              Endereço
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Endereço Completo
                </label>
                <input
                  type="text"
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Rua, número, bairro, CEP"
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
                  placeholder="Ex: Belo Horizonte"
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
                  <option value="BA">Bahia</option>
                  <option value="PR">Paraná</option>
                  <option value="SC">Santa Catarina</option>
                  <option value="RS">Rio Grande do Sul</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Salvando...' : 'Cadastrar Coordenador'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CadastroCoordenador