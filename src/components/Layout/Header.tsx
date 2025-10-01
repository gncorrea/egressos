import React from 'react'
import { LogOut, User, Bell, Facebook, Instagram, Linkedin, ExternalLink } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const Header: React.FC = () => {
  const { profile, signOut } = useAuth()

  const getRoleLabel = (role: string) => {
    const roleLabels = {
      egresso: 'Egresso',
      coordenacao: 'Coordenação',
      secretaria: 'Secretaria',
      professor: 'Professor',
      administracao: 'Administração'
    }
    return roleLabels[role as keyof typeof roleLabels] || role
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-blue-700">
                Sistema de Gestão de Egressos
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
              <Bell className="w-5 h-5" />
            </button>

            {/* Redes Sociais do Sistema */}
            <div className="flex items-center space-x-2 border-l border-gray-200 pl-4">
              <span className="text-xs text-gray-500">Siga-nos:</span>
              <a
                href="https://www.facebook.com/uemgoficial"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                title="Facebook UEMG"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/uemgoficial"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 text-pink-600 hover:text-pink-800 transition-colors"
                title="Instagram UEMG"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/school/universidade-do-estado-de-minas-gerais"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 text-blue-700 hover:text-blue-900 transition-colors"
                title="LinkedIn UEMG"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-500" />
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{profile?.full_name}</p>
                  <p className="text-gray-500">{profile?.role && getRoleLabel(profile.role)}</p>
                </div>
              </div>

              <button
                onClick={() => signOut()}
                className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                title="Sair"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header