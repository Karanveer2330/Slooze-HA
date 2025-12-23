'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import API_URL from '../utils/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const checkAuthenticated = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      if (!token) {
        setIsAuthenticated(false)
        setUser(null)
        setLoading(false)
        return
      }

      const res = await fetch(`${API_URL}/authentication/verify`, {
        method: 'POST',
        headers: { token: token }
      })

      const parseRes = await res.json()
      
      if (parseRes.authenticated && parseRes.user) {
        setIsAuthenticated(true)
        setUser(parseRes.user)
      } else {
        setIsAuthenticated(false)
        setUser(null)
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token')
        }
      }
    } catch (err) {
      console.error(err.message)
      setIsAuthenticated(false)
      setUser(null)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAuthenticated()
  }, [])

  const setAuth = (boolean, userData = null) => {
    setIsAuthenticated(boolean)
    if (userData) {
      setUser(userData)
    } else if (!boolean) {
      setUser(null)
    }
  }

  const hasRole = (roles) => {
    if (!user || !user.role) return false
    const userRole = user.role.toLowerCase()
    if (Array.isArray(roles)) {
      return roles.some(role => userRole === role.toLowerCase())
    }
    return userRole === roles.toLowerCase()
  }

  const canCheckout = () => {
    return hasRole(['admin', 'manager'])
  }

  const canCancelOrder = () => {
    return hasRole(['admin', 'manager'])
  }

  const canManagePayments = () => {
    return hasRole('admin')
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        setAuth,
        hasRole,
        canCheckout,
        canCancelOrder,
        canManagePayments,
        checkAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
