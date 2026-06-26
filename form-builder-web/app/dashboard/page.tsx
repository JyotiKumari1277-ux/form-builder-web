'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'

const COLORS = [
  'border-l-violet-400',
  'border-l-pink-400', 
  'border-l-amber-400',
  'border-l-cyan-400',
  'border-l-green-400',
]

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur border-b border-gray-100 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          <span className="font-bold text-gray-800 text-lg">FormBuilder</span>
        </div>
        <button onClick={logout} className="text-sm text-gray-400 hover:text-red-500 transition font-medium">Logout</button>
      </nav>

      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Forms</h1>
            <p className="text-gray-500 mt-1">Create, customize and share your forms</p>
          </div>
          <button
            onClick={createForm}
            disabled={creating}
            className="bg-gray-900 hover:bg-gray-700 text-white px-5 py-2.5 rounded-xl font-semibold transition flex items-center gap-2 shadow-md"
          >
            <span>+</span>
            {creating ? 'Creating...' : 'New Form'}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'TOTAL FORMS', value: forms.length, color: 'text-gray-900' },
            { label: 'TOTAL FIELDS', value: forms.reduce((a, f) => a + (f.fields?.length || 0), 0), color: 'text-gray-900' },
            { label: 'ACTIVE FORMS', value: forms.length, color: 'text-violet-600' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <p className="text-xs font-semibold text-gray-400 tracking-wider">{stat.label}</p>
              <p className={`text-4xl font-bold mt-2 ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Forms Grid */}
        {loading ? (
          <div className="text-center text-gray-400 py-20">Loading...</div>
        ) : forms.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl">
            <div className="text-5xl mb-4">📋</div>
            <p className="text-gray-700 text-xl font-semibold">No forms yet</p>
            <p className="text-gray-400 mt-2">Create your first form to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {forms.map((form, index) => (
              <div key={form._id} className={`bg-white rounded-2xl p-5 border border-gray-100 shadow-sm border-l-4 ${COLORS[index % COLORS.length]} hover:shadow-md transition`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-xl">📝</div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    index % 3 === 0 ? 'bg-violet-100 text-violet-600' :
                    index % 3 === 1 ? 'bg-pink-100 text-pink-600' :
                    'bg-amber-100 text-amber-600'
                  }`}>{form.fields?.length || 0} fields</span>
                </div>
                <h3 className="text-gray-900 font-bold text-lg mb-1">{form.title}</h3>
                <p className="text-gray-400 text-sm mb-4">Click edit to customize</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/forms/${form._id}/build`)}
                    className="flex-1 bg-gray-900 hover:bg-gray-700 text-white px-3 py-2 rounded-xl text-sm font-semibold transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteForm(form._id)}
                    className="text-gray-400 hover:text-red-500 px-3 py-2 rounded-xl text-sm font-medium transition"
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