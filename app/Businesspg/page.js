'use client'

import { useAuth } from '../context/AuthContext'
import Businesspg from '../components/CustomerMo/Businesspg'

export default function BusinesspgPage() {
  const { logi } = useAuth()
  return <Businesspg logi={logi} />
}




