'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'
import EntryLogin from '../components/CustomerMo/EntryLogin'

export default function EloginPage() {
  const router = useRouter()
  const { isAuthenticated, logi, setAuth } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/termsm')
    }
  }, [isAuthenticated, router])

  if (isAuthenticated) {
    return null
  }

  return <EntryLogin logi={logi} setAuth={setAuth} />
}


