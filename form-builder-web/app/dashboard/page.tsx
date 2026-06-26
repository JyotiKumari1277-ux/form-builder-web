'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'

const ACCENTS = ['violet', 'rose', 'amber', 'emerald', 'sky']
const ACCENT_CLASSES: Record<string, { bg: string; text: string; border: string; chip: string }> = {
  violet: { bg: 'bg-violet-50', text: 'text-violet-600', border: 'border-l-violet-400', chip: 'bg-violet-100 text-violet-700' },
  rose: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-l-rose-400', chip: 'bg-rose-100 text-rose-700' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-l-amber-400', chip: 'bg-amber-100 text-amber-700' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-l-emerald-400', chip: 'bg-emerald-100 text-emerald-700' },
  sky: { bg: 'bg-sky-50', text: 'text-sky-600', border: 'border-l-sky-400', chip: 'bg-sky-100 text-sky-700' },
}

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

  const totalFields = forms.reduce((sum, f) => sum + (f.fields?.length || 0), 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-rose-50">
      {/* Navbar */}
      <nav className="bg-white/70 backdrop-blur-sm border-b border-gray-100 px-6 sm:px-8 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-rose-400 rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          <h1 className="text-lg font-bold text-gray-900 tracking-tight">
            Form<span className="text-violet-600">Builder</span>
          </h1>
        </div>
        <button onClick={logout} className="text-sm text-gray-400 hover:text-rose-500 font-medium transition">
          Logout
        </button>
      </nav>

      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-5 mb-10">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">My Forms</h2>
            <p className="text-gray-500">Create, customize and share your forms</p>
          </div>
          <button
            onClick={createForm}
            disabled={creating}
            className="bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition shadow-lg shadow-gray-300/50 flex items-center gap-2 self-start sm:self-auto"
          >
            <span className="text-lg leading-none">+</span> {creating ? 'Creating...' : 'New Form'}
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl p-5 shadow-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Total Forms</p>
            <p className="text-3xl font-bold text-gray-900">{forms.length}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl p-5 shadow-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Total Fields</p>
            <p className="text-3xl font-bold text-gray-900">{totalFields}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl p-5 shadow-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Active Forms</p>
            <p className="text-3xl font-bold text-gray-900">{forms.filter(f => f.fields?.length > 0).length}</p>
          </div>
        </div>

        {/* Forms grid */}
        {loading ? (
          <p className="text-center text-gray-400 py-20">Loading...</p>
        ) : forms.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed border-gray-200 rounded-3xl bg-white/60">
            <div className="w-16 h-16 bg-violet-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📋</span>
            </div>
            <p className="text-lg font-semibold text-gray-700">Koi form nahi hai abhi</p>
            <p className="text-sm text-gray-400 mt-1">New Form button se shuru karo!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {forms.map((form, i) => {
              const accent = ACCENT_CLASSES[ACCENTS[i % ACCENTS.length]]
              return (
                <div
                  key={form._id}
                  className={`bg-white rounded-2xl p-6 border-l-4 ${accent.border} border-t border-r border-b border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200`}
                >
                  <div className="flex items-start justify-between mb-5">
                    <div className={`w-10 h-10 ${accent.bg} rounded-xl flex items-center justify-center text-lg`}>
                      📝
                    </div>
                    <span className={`text-xs font-semibold ${accent.chip} px-2.5 py-1 rounded-full`}>
                      {form.fields?.length || 0} fields
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-5 truncate">{form.title}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/forms/${form._id}/build`)}
                      className="flex-1 bg-gray-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-700 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteForm(form._id)}
                      className="bg-gray-50 text-gray-400 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-rose-50 hover:text-rose-500 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}