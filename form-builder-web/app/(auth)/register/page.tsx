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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl mb-4 shadow-lg">
            <span className="text-white text-2xl font-bold">F</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create account</h1>
          <p className="text-gray-500 text-sm mt-1">Start building your forms today</p>
        </div>

        {error && (
          <p className="text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2 mb-4 text-sm text-center">
            {error}
          </p>
        )}

        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition duration-200 outline-none"
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition duration-200 outline-none"
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full px-4 py-3 mb-6 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition duration-200 outline-none"
        />

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 active:scale-95 transition-all shadow-md"
        >
          {loading ? 'Creating...' : 'Register'}
        </button>

        <p className="text-center mt-6 text-sm text-gray-500">
          Pehle se account hai?{' '}
          <Link href="/login" className="text-indigo-600 font-semibold hover:text-indigo-700">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}