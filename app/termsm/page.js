'use client'

import { useAuth } from '../context/AuthContext'
import Termsm from '../components/CustomerMo/Termsm'

export default function TermsmPage() {
  const { loggedin, tick, onInput, logi } = useAuth()
  return <Termsm loggedin={loggedin} tick={tick} onInput={onInput} logi={logi} />
}




