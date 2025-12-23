'use client'

import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function RoleGuard({ children, allowedRoles, redirectTo = '/' }) {
  const { user, hasRole, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || !hasRole(allowedRoles))) {
      router.push(redirectTo)
    }
  }, [user, hasRole, allowedRoles, loading, router, redirectTo])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user || !hasRole(allowedRoles)) {
    return null
  }

  return <>{children}</>
}




import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function RoleGuard({ children, allowedRoles, redirectTo = '/' }) {
  const { user, hasRole, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || !hasRole(allowedRoles))) {
      router.push(redirectTo)
    }
  }, [user, hasRole, allowedRoles, loading, router, redirectTo])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user || !hasRole(allowedRoles)) {
    return null
  }

  return <>{children}</>
}




