'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'
import Login from '../components/Login'

export default function LoginPage() {
  const router = useRouter()
  const { isAuthenticated, setAuth } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/PPMenu')
    }
  }, [isAuthenticated, router])

  if (isAuthenticated) {
    return null
  }

  return <Login setAuth={setAuth} />
}

