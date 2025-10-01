import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { Profile } from '../types'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, fullName: string, role: Profile['role']) => Promise<{ error: any }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getSession = async () => {
      // Check for stored mock session first
      const storedSession = localStorage.getItem('mock_session')
      if (storedSession) {
        try {
          const mockData = JSON.parse(storedSession)
          setSession(mockData.session)
          setUser(mockData.user)
          setProfile(mockData.profile)
          setLoading(false)
          return
        } catch (error) {
          localStorage.removeItem('mock_session')
        }
      }

      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        await fetchProfile(session.user.id)
      }

      setLoading(false)
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)

        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setProfile(null)
        }

        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      // Skip profile fetch if using placeholder Supabase
      if (import.meta.env.VITE_SUPABASE_URL === 'https://placeholder.supabase.co' || 
          !import.meta.env.VITE_SUPABASE_URL) {
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const signIn = async (email: string, password: string) => {
    // Mock authentication for demo purposes when using placeholder
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.co'
    if (supabaseUrl.includes('placeholder') || 
        supabaseUrl === 'https://demo.supabase.co' ||
        supabaseUrl.includes('demo')) {
      
      // Mock user data based on email
      const mockUsers = {
        'egresso@demo.com': {
          id: '11111111-1111-1111-1111-111111111111',
          email: 'egresso@demo.com',
          full_name: 'João Silva',
          role: 'egresso' as const
        },
        'coord@demo.com': {
          id: '22222222-2222-2222-2222-222222222222',
          email: 'coord@demo.com',
          full_name: 'Maria Santos',
          role: 'coordenacao' as const
        },
        'sec@demo.com': {
          id: '33333333-3333-3333-3333-333333333333',
          email: 'sec@demo.com',
          full_name: 'Ana Costa',
          role: 'secretaria' as const
        }
      }

      const mockUser = mockUsers[email as keyof typeof mockUsers]
      if (mockUser && password === 'demo123') {
        // Simulate successful login
        const mockSession = {
          user: {
            id: mockUser.id,
            email: mockUser.email,
            aud: 'authenticated',
            role: 'authenticated',
            email_confirmed_at: new Date().toISOString(),
            phone: '',
            confirmed_at: new Date().toISOString(),
            last_sign_in_at: new Date().toISOString(),
            app_metadata: {},
            user_metadata: {},
            identities: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          access_token: 'mock-token',
          refresh_token: 'mock-refresh-token',
          expires_in: 3600,
          expires_at: Date.now() + 3600000,
          token_type: 'bearer'
        }
        
        setSession(mockSession as any)
        setUser(mockSession.user as any)
        setProfile(mockUser as any)
        
        // Store session in localStorage for persistence
        localStorage.setItem('mock_session', JSON.stringify({
          session: mockSession,
          user: mockSession.user,
          profile: mockUser
        }))
        
        return { error: null }
      } else {
        return { error: { message: 'Invalid credentials' } }
      }
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }

  const signUp = async (email: string, password: string, fullName: string, role: Profile['role']) => {
    // Skip signup for demo
    if (import.meta.env.VITE_SUPABASE_URL === 'https://placeholder.supabase.co' || 
        !import.meta.env.VITE_SUPABASE_URL) {
      return { error: { message: 'Signup not available in demo mode' } }
    }

    const { data, error } = await supabase.auth.signUp({ email, password })

    if (error) return { error }

    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email,
          full_name: fullName,
          role
        })

      if (profileError) return { error: profileError }
    }

    return { error: null }
  }

  const signOut = async () => {
    // Handle mock signout
    if (import.meta.env.VITE_SUPABASE_URL === 'https://placeholder.supabase.co' || 
        !import.meta.env.VITE_SUPABASE_URL) {
      localStorage.removeItem('mock_session')
      setSession(null)
      setUser(null)
      setProfile(null)
      return
    }

    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('No user logged in') }

    // Skip update for demo
    if (import.meta.env.VITE_SUPABASE_URL === 'https://placeholder.supabase.co' || 
        !import.meta.env.VITE_SUPABASE_URL) {
      setProfile(prev => prev ? { ...prev, ...updates } : null)
      return { error: null }
    }

    const { error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', user.id)

    if (!error) {
      setProfile(prev => prev ? { ...prev, ...updates } : null)
    }

    return { error }
  }

  const value = {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}