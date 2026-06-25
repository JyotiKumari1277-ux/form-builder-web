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
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-teal-600">Form Builder</h1>
        <button onClick={logout} className="text-sm text-gray-500 hover:text-red-500">Logout</button>
      </nav>

      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">My Forms</h2>
          <button
            onClick={createForm}
            disabled={creating}
            className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700"
          >
            {creating ? 'Creating...' : '+ New Form'}
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : forms.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg">Koi form nahi hai</p>
            <p className="text-sm">New Form button se banao!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {forms.map(form => (
              <div key={form._id} className="bg-white p-5 rounded-xl shadow flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg">{form.title}</h3>
                  <p className="text-sm text-gray-400">{form.fields?.length || 0} fields</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/forms/${form._id}/build`)}
                    className="bg-teal-50 text-teal-600 px-3 py-1.5 rounded-lg text-sm hover:bg-teal-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteForm(form._id)}
                    className="bg-red-50 text-red-500 px-3 py-1.5 rounded-lg text-sm hover:bg-red-100"
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