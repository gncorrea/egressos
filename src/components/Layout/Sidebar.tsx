import React from 'react'
import { NavLink } from 'react-router-dom'
import { 
  Home, 
  User, 
  FileText, 
  Calendar, 
  BarChart3, 
  Users, 
  Settings,
  GraduationCap,
  UserPlus,
  UserCheck
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const Sidebar: React.FC = () => {
  const { profile } = useAuth()

  const getNavigationItems = () => {
    const baseItems = [
      { name: 'Dashboard', href: '/', icon: Home },
    ]

    switch (profile?.role) {
      case 'egresso':
        return [
          ...baseItems,
          { name: 'Meu Perfil', href: '/perfil', icon: User },
          { name: 'Questionários Egressos', href: '/questionarios', icon: FileText },
          { name: 'Eventos', href: '/eventos', icon: Calendar },
        ]
      
      case 'coordenacao':
        return [
          ...baseItems,
          { name: 'Egressos', href: '/egressos', icon: GraduationCap },
          { name: 'Relatórios Pedagógicos', href: '/relatorios', icon: BarChart3 },
          { name: 'Questionários Alunos', href: '/questionarios', icon: FileText },
          { name: 'Eventos', href: '/eventos', icon: Calendar },
        ]
      
      case 'secretaria':
        return [
          ...baseItems,
          { name: 'Cadastro Egressos', href: '/cadastro-egressos', icon: UserPlus },
          { name: 'Cadastro Coordenador', href: '/cadastro-coordenador', icon: UserCheck },
          { name: 'Egressos', href: '/egressos', icon: Users },
          { name: 'Relatórios', href: '/relatorios', icon: BarChart3 },
          { name: 'Questionários Alunos', href: '/questionarios', icon: FileText },
          { name: 'Eventos', href: '/eventos', icon: Calendar },
        ]
      
      case 'professor':
        return [
          ...baseItems,
          { name: 'Egressos', href: '/egressos', icon: Users },
          { name: 'Questionários Alunos', href: '/questionarios', icon: FileText },
        ]
      
      case 'administracao':
        return [
          ...baseItems,
          { name: 'Cadastro Egressos', href: '/cadastro-egressos', icon: UserPlus },
          { name: 'Egressos', href: '/egressos', icon: Users },
          { name: 'Relatórios', href: '/relatorios', icon: BarChart3 },
          { name: 'Questionários Alunos', href: '/questionarios', icon: FileText },
          { name: 'Eventos', href: '/eventos', icon: Calendar },
          { name: 'Configurações', href: '/configuracoes', icon: Settings },
        ]
      
      default:
        return baseItems
    }
  }

  const navigationItems = getNavigationItems()

  return (
    <div className="flex flex-col w-64 bg-gray-50 border-r border-gray-200">
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigationItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`
            }
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export default Sidebar