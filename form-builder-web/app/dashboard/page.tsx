'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'

export default function DashboardPage() {
  const router = useRouter()
  const [forms, setForms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { router.push('/login'); return }
    loadForms()
  }, [])

  const loadForms = async () => {
    const data = await api.getForms()
    setForms(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  const createForm = async () => {
    setCreating(true)
    const form = await api.createForm('Untitled Form')
    if (form._id) router.push(`/forms/${form._id}/build`)
    setCreating(false)
  }

  const deleteForm = async (id: string) => {
    if (!confirm('Delete karna chahte ho?')) return
    await api.deleteForm(id)
    loadForms()
  }

  const logout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  return (
    <div className="min-h-screen" style={{background: 'linear-gradient(135deg, #f0f4ff 0%, #faf0ff 100%)'}}>
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm px-8 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📋</span>
          <h1 className="text-xl font-black text-transparent bg-clip-text" style={{backgroundImage: 'linear-gradient(90deg, #6366f1, #a855f7)'}}>
            Form Builder
          </h1>
        </div>
        <button onClick={logout} className="text-sm text-gray-400 hover:text-red-400 transition font-medium">
          Logout →
        </button>
      </nav>

      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-black text-gray-800">My Forms</h2>
            <p className="text-gray-400 mt-1">Create and manage your forms</p>
          </div>
          <button
            onClick={createForm}
            disabled={creating}
            className="px-6 py-3 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
            style={{background: 'linear-gradient(135deg, #6366f1, #a855f7)'}}
          >
            {creating ? '⏳ Creating...' : '+ New Form'}
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400 text-lg">⏳ Loading...</div>
        ) : forms.length === 0 ? (
          <div className="text-center py-24 bg-white/60 rounded-3xl border border-white shadow-sm">
            <p className="text-5xl mb-4">📭</p>
            <p className="text-xl font-bold text-gray-500">Koi form nahi hai</p>
            <p className="text-gray-400 mt-2">New Form button se banao!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forms.map(form => (
              <div key={form._id}
                className="bg-white/70 backdrop-blur-sm p-6 rounded-3xl shadow-sm border border-white hover:shadow-md transition-all hover:scale-[1.02]">
                <div className="mb-4">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-3 text-xl"
                    style={{background: 'linear-gradient(135deg, #e0e7ff, #f3e8ff)'}}>
                    📝
                  </div>
                  <h3 className="font-black text-gray-800 text-lg">{form.title}</h3>
                  <p className="text-sm text-gray-400 mt-1">{form.fields?.length || 0} fields</p>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => router.push(`/forms/${form._id}/build`)}
                    className="flex-1 py-2 rounded-xl text-sm font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => deleteForm(form._id)}
                    className="flex-1 py-2 rounded-xl text-sm font-bold text-red-400 bg-red-50 hover:bg-red-100 transition"
                  >
                    🗑️ Delete
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