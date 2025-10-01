import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import EgressoDashboard from '../components/Dashboard/EgressoDashboard'
import CoordenacaoDashboard from '../components/Dashboard/CoordenacaoDashboard'

const Dashboard: React.FC = () => {
  const { profile } = useAuth()

  const renderDashboard = () => {
    switch (profile?.role) {
      case 'egresso':
        return <EgressoDashboard />
      case 'coordenacao':
        return <CoordenacaoDashboard />
      case 'secretaria':
        return <CoordenacaoDashboard />
      case 'professor':
        return <CoordenacaoDashboard />
      case 'administracao':
        return <CoordenacaoDashboard />
      default:
        return <EgressoDashboard />
    }
  }

  return renderDashboard()
}

export default Dashboard