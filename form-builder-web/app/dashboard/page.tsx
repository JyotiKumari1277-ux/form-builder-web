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
      <nav className="bg-[#1a1a2e] border-b border-purple-900/30 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          <span className="text-white font-bold text-xl">FormCraft</span>
        </div>
        <button onClick={logout} className="text-gray-400 hover:text-white text-sm transition">Logout</button>
      </nav>

      <div className="max-w-6xl mx-auto p-8">
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

        {loading ? (
          <div className="text-center text-gray-400 py-20">Loading...</div>
        ) : forms.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-purple-900/40 rounded-2xl">
            <p className="text-white text-xl font-semibold">No forms yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {forms.map(form => (
              <div key={form._id} className="bg-[#1a1a2e] border border-purple-900/30 rounded-xl p-5 hover:border-purple-500/50 transition">
                <h3 className="text-white font-semibold text-lg mb-4">{form.title}</h3>
                <div className="flex gap-2">
                  <button onClick={() => router.push(`/forms/${form._id}/build`)} className="flex-1 bg-purple-600/20 text-purple-400 px-3 py-2 rounded-lg text-sm">Edit</button>
                  <button onClick={() => deleteForm(form._id)} className="bg-red-500/10 text-red-400 px-3 py-2 rounded-lg text-sm">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}