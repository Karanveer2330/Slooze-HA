'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'
import Sign from '../components/Sign'

export default function SignPage() {
  const router = useRouter()
  const { isAuthenticated, setAuth } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/terms')
    }
  }, [isAuthenticated, router])

  if (isAuthenticated) {
    return null
  }

  return <Sign setAuth={setAuth} />
}


