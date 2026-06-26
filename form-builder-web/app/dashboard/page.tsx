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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <nav className="bg-white border-b border-gray-200 px-8 py-5 flex justify-between items-center shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">
          Form<span className="text-indigo-600">Builder</span>
        </h1>
        <button onClick={logout} className="text-sm text-gray-500 hover:text-red-500 transition">
          Logout
        </button>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-10">
        <div className="flex justify-between items-start mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">My Forms</h2>
            <p className="text-gray-500">Create and manage your forms</p>
          </div>
          <button
            onClick={createForm}
            disabled={creating}
            className="bg-gradient-to-r from-indigo-600 to-cyan-600 text-white px-5 py-3 rounded-lg font-semibold hover:opacity-90 transition shadow-md"
          >
            {creating ? 'Creating...' : '+ New Form'}
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : forms.length === 0 ? (
          <div className="text-center py-24 text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl bg-white">
            <p className="text-lg text-gray-600">Koi form nahi hai</p>
            <p className="text-sm mt-1">New Form button se banao!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {forms.map(form => (
              <div
                key={form._id}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
              >
                <h3 className="font-bold text-lg text-gray-900 mb-1">{form.title}</h3>
                <p className="text-sm text-gray-500 mb-5">{form.fields?.length || 0} fields</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => router.push(`/forms/${form._id}/build`)}
                    className="flex-1 bg-indigo-50 text-indigo-700 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-100 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteForm(form._id)}
                    className="bg-red-50 text-red-600 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-red-100 transition"
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