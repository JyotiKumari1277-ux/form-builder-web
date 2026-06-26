'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Form {
  _id: string
  title: string
  createdAt: string
  views: number
}

export default function DashboardPage() {
  const router = useRouter()
  const [forms, setForms] = useState<Form[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { router.push('/login'); return }
    fetchForms(token)
  }, [])

  const fetchForms = async (token: string) => {
    try {
      const res = await fetch('https://form-builder-api-87q4.onrender.com/forms', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setForms(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const createForm = async () => {
    const token = localStorage.getItem('token')
    const res = await fetch('https://form-builder-api-87q4.onrender.com/forms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: 'Untitled Form' }),
    })
    const data = await res.json()
    router.push(`/forms/${data._id}/build`)
  }

  const deleteForm = async (id: string) => {
    const token = localStorage.getItem('token')
    await fetch(`https://form-builder-api-87q4.onrender.com/forms/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    setForms(forms.filter(f => f._id !== id))
  }

  const logout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Navbar */}
      <div className="bg-white border-b border-gray-100 shadow-sm px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow">
              <span className="text-lg">📋</span>
            </div>
            <h1 className="text-xl font-black text-gray-800">FormBuilder</h1>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 text-sm text-gray-500 hover:text-red-500 font-medium transition-colors"
          >
            Logout →
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black text-gray-800">My Forms</h2>
            <p className="text-gray-400 mt-1">{forms.length} forms created</p>
          </div>
          <button
            onClick={createForm}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            + New Form
          </button>
        </div>

        {/* Forms Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-3">⏳</div>
            <p className="text-gray-400">Loading your forms...</p>
          </div>
        ) : forms.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-gray-600 mb-2">Koi form nahi hai abhi</h3>
            <p className="text-gray-400 mb-6">Apna pehla form banao!</p>
            <button
              onClick={createForm}
              className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl shadow hover:bg-indigo-700 transition-all"
            >
              + Create First Form
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {forms.map(form => (
              <div
                key={form._id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-6 group"
              >
                {/* Form Icon */}
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-xl">📄</span>
                </div>

                <h3 className="font-bold text-gray-800 text-lg mb-1 truncate">{form.title}</h3>
                <p className="text-xs text-gray-400 mb-4">
                  {new Date(form.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>

                <div className="flex items-center gap-2 pt-4 border-t border-gray-50">
                  <button
                    onClick={() => router.push(`/forms/${form._id}/build`)}
                    className="flex-1 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-xl text-sm transition-all"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => router.push(`/forms/${form._id}/responses`)}
                    className="flex-1 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold rounded-xl text-sm transition-all"
                  >
                    📊 Responses
                  </button>
                  <button
                    onClick={() => deleteForm(form._id)}
                    className="py-2 px-3 bg-red-50 hover:bg-red-100 text-red-500 font-semibold rounded-xl text-sm transition-all"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}