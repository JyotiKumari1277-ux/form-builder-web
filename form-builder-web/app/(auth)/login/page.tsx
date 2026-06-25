'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    const res = await api.login({ email, password })
    if (res.accessToken) {
      localStorage.setItem('token', res.accessToken)
      router.push('/dashboard')
    } else {
      setError('Invalid email or password')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
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
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-teal-600 text-white p-3 rounded-lg font-semibold hover:bg-teal-700"
        >
          {loading ? 'Loading...' : 'Login'}
        </button>
        <p className="text-center mt-4 text-sm">
          Account nahi hai? <Link href="/register" className="text-teal-600 font-semibold">Register</Link>
        </p>
      </div>
    </div>
  )
}