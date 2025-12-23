'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'
import Dashboard from '../components/Dashboard'

export default function DashboardPage() {
  const router = useRouter()
  const { isAuthenticated, setAuth } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  return <Dashboard setAuth={setAuth} />
}




