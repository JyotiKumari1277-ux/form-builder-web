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
    <div className="min-h-screen bg-[#0f0f1a]">
      {/* Navbar */}
      <nav className="bg-[#1a1a2e] border-b border-purple-900/30 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          <span className="text-white font-bold text-xl">FormCraft</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={logout} className="text-gray-400 hover:text-white text-sm transition">Logout</button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">My Forms</h1>
            <p className="text-gray-400 mt-1">Create and manage your forms</p>
          </div>
          <button
            onClick={createForm}
            disabled={creating}
            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-semibold transition flex items-center gap-2"
          >
            <span className="text-lg">+</span>
            {creating ? 'Creating...' : 'New Form'}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-[#1a1a2e] border border-purple-900/30 rounded-xl p-5">
            <p className="text-gray-400 text-sm">Total Forms</p>
            <p className="text-3xl font-bold text-white mt-1">{forms.length}</p>
          </div>
          <div className="bg-[#1a1a2e] border border-purple-900/30 rounded-xl p-5">
            <p className="text-gray-400 text-sm">Total Fields</p>
            <p className="text-3xl font-bold text-white mt-1">{forms.reduce((a, f) => a + (f.fields?.length || 0), 0)}</p>
          </div>
          <div className="bg-[#1a1a2e] border border-purple-900/30 rounded-xl p-5">
            <p className="text-gray-400 text-sm">Active</p>
            <p className="text-3xl font-bold text-purple-400 mt-1">{forms.length}</p>
          </div>
        </div>

        {/* Forms Grid */}
        {loading ? (
          <div className="text-center text-gray-400 py-20">Loading...</div>
        ) : forms.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-purple-900/40 rounded-2xl">
            <div className="text-5xl mb-4">📋</div>
            <p className="text-white text-xl font-semibold">No forms yet</p>
            <p className="text-gray-400 mt-2">Create your first form to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {forms.map(form => (
              <div key={form._id} className="bg-[#1a1a2e] border border-purple-900/30 rounded-xl p-5 hover:border-purple-500/50 transition group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
                    <span className="text-purple-400 text-xl">📝</span>
                  </div>
                  <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded-full">{form.fields?.length || 0} fields</span>
                </div>
                <h3 className="text-white font-semibold text-lg mb-1">{form.title}</h3>
                <p className="text-gray-500 text-sm mb-4">Click edit to customize</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/forms/${form._id}/build`)}
                    className="flex-1 bg-purple-600/20 hover:bg-purple-600 text-purple-400 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteForm(form._id)}
                    className="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition"
                  >
                    Delete
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