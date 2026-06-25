'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async () => {
    setLoading(true)
    setError('')
    const res = await api.register({ name, email, password })
    if (res.message) {
      router.push('/login')
    } else {
      setError('Registration failed, try again')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full border p-3 rounded-lg mb-3"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border p-3 rounded-lg mb-3"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border p-3 rounded-lg mb-4"
        />
        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-teal-600 text-white p-3 rounded-lg font-semibold hover:bg-teal-700"
        >
          {loading ? 'Loading...' : 'Register'}
        </button>
        <p className="text-center mt-4 text-sm">
          Pehle se account hai? <Link href="/login" className="text-teal-600 font-semibold">Login</Link>
        </p>
      </div>
    </div>
  )
}