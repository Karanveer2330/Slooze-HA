'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './context/AuthContext'
import Home from './components/Home'

export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated, logge } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  if (isAuthenticated) {
    return null
  }

  return <Home logged={logge} />
}


