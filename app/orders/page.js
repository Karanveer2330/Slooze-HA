'use client'

import { useAuth } from '../context/AuthContext'
import Orders from '../components/CustomerMo/Orders'

export default function OrdersPage() {
  const { logi } = useAuth()
  return <Orders logi={logi} />
}




