import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Layout from './components/Layout/Layout'
import LoginForm from './components/Auth/LoginForm'
import Dashboard from './pages/Dashboard'
import PerfilEgresso from './components/Perfil/PerfilEgresso'
import QuestionariosList from './components/Questionarios/QuestionariosList'
import QuestionariosAlunos from './components/Questionarios/QuestionariosAlunos'
import CadastroQuestionario from './components/Questionarios/CadastroQuestionario'
import EventosList from './components/Eventos/EventosList'
import RelatoriosPedagogicos from './components/Relatorios/RelatoriosPedagogicos'
import RelatorioPerfilEgressos from './components/Relatorios/RelatorioPerfilEgressos'
import RelatorioInsercaoProfissional from './components/Relatorios/RelatorioInsercaoProfissional'
import RelatorioContinuidadeAcademica from './components/Relatorios/RelatorioContinuidadeAcademica'
import RelatorioSatisfacaoPercepcao from './components/Relatorios/RelatorioSatisfacaoPercepcao'
import RelatorioImpactoSocial from './components/Relatorios/RelatorioImpactoSocial'
import CadastroEgresso from './components/Secretaria/CadastroEgresso'
import CadastroCoordenador from './components/Secretaria/CadastroCoordenador'
import GestaoEgressos from './components/Egressos/GestaoEgressos'

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  return <Layout>{children}</Layout>
}

const AppContent: React.FC = () => {
  const { profile } = useAuth()

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/cadastro-egressos" element={
          <ProtectedRoute>
            <CadastroEgresso />
          </ProtectedRoute>
        } />
        <Route path="/cadastro-coordenador" element={
          <ProtectedRoute>
            <CadastroCoordenador />
          </ProtectedRoute>
        } />
        <Route path="/criar-questionario" element={
          <ProtectedRoute>
            <CadastroQuestionario />
          </ProtectedRoute>
        } />
        <Route path="/perfil" element={
          <ProtectedRoute>
            <PerfilEgresso />
          </ProtectedRoute>
        } />
        <Route path="/questionarios" element={
          <ProtectedRoute>
            {profile?.role === 'egresso' ? <QuestionariosList /> : <QuestionariosAlunos />}
          </ProtectedRoute>
        } />
        <Route path="/eventos" element={
          <ProtectedRoute>
            <EventosList />
          </ProtectedRoute>
        } />
        <Route path="/relatorios" element={
          <ProtectedRoute>
            <RelatoriosPedagogicos />
          </ProtectedRoute>
        } />
        <Route path="/egressos" element={
          <ProtectedRoute>
            <GestaoEgressos />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App