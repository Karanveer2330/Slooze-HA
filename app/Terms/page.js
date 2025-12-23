'use client'

import { useAuth } from '../context/AuthContext'
import Terms from '../components/Terms'

export default function TermsPage() {
  const { onInput, changeit, tick } = useAuth()
  return <Terms onInput={onInput} changeit={changeit} tick={tick} />
}




