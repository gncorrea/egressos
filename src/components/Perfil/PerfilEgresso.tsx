import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { Save, User, Facebook, Instagram, Linkedin, ExternalLink, MapPin, Building } from 'lucide-react'
import { Egresso } from '../../types'

const PerfilEgresso: React.FC = () => {
  const { user } = useAuth()
  const [egresso, setEgresso] = useState<Egresso | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const [formData, setFormData] = useState({
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

  const unidadesUEMG = [
    { codigo: 'BH', nome: 'Belo Horizonte', cidade: 'Belo Horizonte' },
    { codigo: 'BARBACENA', nome: 'Barbacena', cidade: 'Barbacena' },
    { codigo: 'CARANGOLA', nome: 'Carangola', cidade: 'Carangola' },
    { codigo: 'CLAUDIO', nome: 'Cláudio', cidade: 'Cláudio' },
    { codigo: 'DIVINOPOLIS', nome: 'Divinópolis', cidade: 'Divinópolis' },
    { codigo: 'FRUTAL', nome: 'Frutal', cidade: 'Frutal' },
    { codigo: 'IBIRITE', nome: 'Ibirité', cidade: 'Ibirité' },
    { codigo: 'ITUIUTABA', nome: 'Ituiutaba', cidade: 'Ituiutaba' },
    { codigo: 'JOAO_MONLEVADE', nome: 'João Monlevade', cidade: 'João Monlevade' },
    { codigo: 'LEOPOLDINA', nome: 'Leopoldina', cidade: 'Leopoldina' },
    { codigo: 'PASSOS', nome: 'Passos', cidade: 'Passos' },
    { codigo: 'POCOS_CALDAS', nome: 'Poços de Caldas', cidade: 'Poços de Caldas' },
    { codigo: 'UBA', nome: 'Ubá', cidade: 'Ubá' },
    { codigo: 'CAMPANHA', nome: 'Campanha', cidade: 'Campanha' }
  ]

  const cursosPorUnidade = {
    'BH': ['Ciência da Computação', 'Engenharia de Software', 'Sistemas de Informação', 'Design Gráfico', 'Análise e Desenvolvimento de Sistemas'],
    'BARBACENA': ['Administração', 'Pedagogia', 'Educação Física', 'Letras', 'História'],
    'DIVINOPOLIS': ['Engenharia Civil', 'Arquitetura e Urbanismo', 'Engenharia de Produção', 'Engenharia Mecânica'],
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

  useEffect(() => {
    if (user) {
      fetchEgressoData()
    }
  }, [user])

  const fetchEgressoData = async () => {
    try {
      // Skip data fetch if using placeholder Supabase
      if (import.meta.env.VITE_SUPABASE_URL === 'https://placeholder.supabase.co' || 
          !import.meta.env.VITE_SUPABASE_URL) {
        // Set mock egresso data
        const mockEgresso = {
          id: '1',
          profile_id: user!.id,
          curso: 'Ciência da Computação',
          unidade: 'BH',
          ano_conclusao: 2020,
          telefone: '(11) 99999-9999',
          endereco: 'São Paulo, SP',
          cidade: 'São Paulo',
          estado: 'SP',
          status_profissional: 'Empregado',
          empresa_atual: 'Tech Corp',
          cargo_atual: 'Desenvolvedor Sênior',
          formacao_continuada: 'MBA em Gestão de Projetos',
          linkedin_url: 'https://linkedin.com/in/joaosilva',
          facebook_url: '',
          instagram_url: 'https://instagram.com/joaosilva',
          site_pessoal: 'https://joaosilva.dev',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        
        setEgresso(mockEgresso)
        setFormData({
          curso: mockEgresso.curso,
          unidade: mockEgresso.unidade || '',
          ano_conclusao: mockEgresso.ano_conclusao,
          telefone: mockEgresso.telefone || '',
          endereco: mockEgresso.endereco || '',
          cidade: mockEgresso.cidade || '',
          estado: mockEgresso.estado || '',
          status_profissional: mockEgresso.status_profissional || '',
          empresa_atual: mockEgresso.empresa_atual || '',
          cargo_atual: mockEgresso.cargo_atual || '',
          formacao_continuada: mockEgresso.formacao_continuada || '',
          linkedin_url: mockEgresso.linkedin_url || '',
          facebook_url: mockEgresso.facebook_url || '',
          instagram_url: mockEgresso.instagram_url || '',
          site_pessoal: mockEgresso.site_pessoal || ''
        })
        
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('egressos')
        .select('*')
        .eq('profile_id', user!.id)
        .single()

      if (data) {
        setEgresso(data)
        setFormData({
          curso: data.curso || '',
          unidade: data.unidade || '',
          ano_conclusao: data.ano_conclusao || new Date().getFullYear(),
          telefone: data.telefone || '',
          endereco: data.endereco || '',
          cidade: data.cidade || '',
          estado: data.estado || '',
          status_profissional: data.status_profissional || '',
          empresa_atual: data.empresa_atual || '',
          cargo_atual: data.cargo_atual || '',
          formacao_continuada: data.formacao_continuada || '',
          linkedin_url: data.linkedin_url || '',
          facebook_url: data.facebook_url || '',
          instagram_url: data.instagram_url || '',
          site_pessoal: data.site_pessoal || ''
        })
      }
    } catch (error) {
      console.error('Error fetching egresso data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      // Skip save for demo
      if (import.meta.env.VITE_SUPABASE_URL === 'https://placeholder.supabase.co' || 
          !import.meta.env.VITE_SUPABASE_URL) {
        setMessage('Perfil atualizado com sucesso! (Modo demonstração)')
        setSaving(false)
        return
      }

      if (egresso) {
        // Atualizar registro existente
        const { error } = await supabase
          .from('egressos')
          .update({
            ...formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', egresso.id)

        if (error) throw error
      } else {
        // Criar novo registro
        const { error } = await supabase
          .from('egressos')
          .insert({
            profile_id: user!.id,
            ...formData
          })

        if (error) throw error
      }

      setMessage('Perfil atualizado com sucesso!')
      await fetchEgressoData()
    } catch (error) {
      console.error('Error saving profile:', error)
      setMessage('Erro ao salvar perfil. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'ano_conclusao' ? parseInt(value) || 0 : value
    }))
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
        <div className="px-6 py-4 border-b border-gray-200 flex items-center">
          <User className="w-6 h-6 text-blue-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unidade UEMG *
              </label>
              <select
                name="unidade"
                value={formData.unidade}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Selecione a unidade</option>
                {unidadesUEMG.map(unidade => (
                  <option key={unidade.codigo} value={unidade.codigo}>
                    {unidade.nome} - {unidade.cidade}
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
                onChange={handleChange}
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
                Ano de Conclusão
              </label>
              <input
                type="number"
                name="ano_conclusao"
                value={formData.ano_conclusao}
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status Profissional
              </label>
              <select
                name="status_profissional"
                value={formData.status_profissional}
                onChange={handleChange}
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
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nome da empresa"
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
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ex: Desenvolvedor Sênior"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Formação Continuada
            </label>
            <textarea
              name="formacao_continuada"
              value={formData.formacao_continuada}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Cursos de especialização, mestrado, doutorado, certificações, etc."
            />
          </div>

          {/* Seção de Redes Sociais */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <ExternalLink className="w-5 h-5 mr-2 text-blue-600" />
              Redes Sociais e Contatos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Linkedin className="w-4 h-4 mr-2 text-blue-700" />
                  LinkedIn
                </label>
                <input
                  type="url"
                  name="linkedin_url"
                  value={formData.linkedin_url}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://linkedin.com/in/seuperfil"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Instagram className="w-4 h-4 mr-2 text-pink-600" />
                  Instagram
                </label>
                <input
                  type="url"
                  name="instagram_url"
                  value={formData.instagram_url}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://instagram.com/seuperfil"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Facebook className="w-4 h-4 mr-2 text-blue-600" />
                  Facebook
                </label>
                <input
                  type="url"
                  name="facebook_url"
                  value={formData.facebook_url}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://facebook.com/seuperfil"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <ExternalLink className="w-4 h-4 mr-2 text-gray-600" />
                  Site Pessoal
                </label>
                <input
                  type="url"
                  name="site_pessoal"
                  value={formData.site_pessoal}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://seusite.com"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Endereço Completo
            </label>
            <textarea
              name="endereco"
              value={formData.endereco}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Rua, número, bairro, CEP"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Salvando...' : 'Salvar Perfil'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PerfilEgresso