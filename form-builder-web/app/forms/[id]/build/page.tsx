'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

const FIELD_TYPES = [
  { type: 'text', label: '📝 Text Input', color: 'bg-blue-50 hover:bg-blue-100 border-blue-200' },
  { type: 'email', label: '📧 Email', color: 'bg-purple-50 hover:bg-purple-100 border-purple-200' },
  { type: 'number', label: '🔢 Number', color: 'bg-green-50 hover:bg-green-100 border-green-200' },
  { type: 'dropdown', label: '🔽 Dropdown', color: 'bg-yellow-50 hover:bg-yellow-100 border-yellow-200' },
  { type: 'checkbox', label: '☑️ Checkbox', color: 'bg-pink-50 hover:bg-pink-100 border-pink-200' },
  { type: 'radio', label: '🔘 Radio Button', color: 'bg-orange-50 hover:bg-orange-100 border-orange-200' },
  { type: 'date', label: '📅 Date', color: 'bg-teal-50 hover:bg-teal-100 border-teal-200' },
  { type: 'textarea', label: '📄 Text Area', color: 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200' },
]

export default function BuildPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [title, setTitle] = useState('Untitled Form')
  const [fields, setFields] = useState<any[]>([])
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { router.push('/login'); return }
    fetch(`https://form-builder-api-87q4.onrender.com/forms/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        setTitle(data.title || 'Untitled Form')
        setFields(data.fields || [])
      })
  }, [id])

  const addField = (type: string) => {
    const newField: any = {
      id: Date.now().toString(),
      type,
      label: type.charAt(0).toUpperCase() + type.slice(1) + ' Field',
      placeholder: `Enter ${type}...`,
      required: false,
      options: ['dropdown', 'radio', 'checkbox'].includes(type) ? ['Option 1', 'Option 2'] : [],
    }
    setFields([...fields, newField])
  }

  const updateField = (fieldId: string, key: string, value: any) => {
    setFields(fields.map(f => f.id === fieldId ? { ...f, [key]: value } : f))
  }
const removeField = async (fieldId: string) => {
  const updatedFields = fields.filter(f => f.id !== fieldId)
  setFields(updatedFields)
  
  const token = localStorage.getItem('token')
  await fetch(`https://form-builder-api-87q4.onrender.com/forms/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ title, fields: updatedFields }),
  })
}
  const handleSave = async () => {
    const token = localStorage.getItem('token')
    setError('')
    try {
      const res = await fetch(`https://form-builder-api-87q4.onrender.com/forms/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title, fields }),
      })
      if (!res.ok) throw new Error('Save failed')
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError('Failed to save form')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Top Header Bar */}
      <div className="bg-white border-b border-gray-200 shadow-sm px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="text-2xl font-bold text-gray-800 border-b-2 border-transparent focus:border-indigo-400 outline-none bg-transparent flex-1 py-1 transition-colors"
            placeholder="Form Title..."
          />
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-semibold shadow-md hover:shadow-lg transition-all"
          >
            💾 Save Form
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-2.5 bg-gray-200 text-gray-800 font-bold rounded-xl hover:bg-gray-300 transition"
          >
            ← Back
          </button>
          <button
  onClick={() => {
    const publishUrl = window.location.href.replace('/build', '/respond');
    navigator.clipboard.writeText(publishUrl);
    alert("Form published! Link copied.");
  }}
  className="px-6 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
>
  Publish
</button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6">
        {saved && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl font-medium flex items-center gap-2">
            ✅ Form saved successfully in Database!
          </div>
        )}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
            ❌ {error}
          </div>
        )}

        <div className="grid grid-cols-3 gap-6">
          {/* Left Panel - Field Types */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-bold text-gray-500 mb-4 text-sm font-black uppercase tracking-widest text-gray-700">Add Fields</h3>
            <div className="space-y-2">
              {FIELD_TYPES.map(ft => (
                <button
                  key={ft.type}
                  onClick={() => addField(ft.type)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium border transition-all ${ft.color}`}
                >
                  {ft.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right Panel - Canvas */}
          <div className="col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-bold text-gray-500 mb-4 text-sm font-black uppercase tracking-widest text-gray-700">Form Preview</h3>
            {fields.length === 0 ? (
              <div className="text-center py-20 text-gray-300">
                <div className="text-6xl mb-3">📋</div>
                <p className="text-gray-400 font-medium">Left se field add karo</p>
                <p className="text-gray-300 text-sm mt-1">Click on any field type to add it</p>
              </div>
            ) : (
              <div className="space-y-4">
                {fields.map(field => (
                  <div key={field.id} className="border border-gray-100 rounded-xl p-4 bg-gray-50 hover:bg-white hover:shadow-sm transition-all">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-bold text-indigo-500 uppercase tracking-wide bg-indigo-50 px-2 py-1 rounded-lg">{field.type}</span>
                      <button onClick={() => removeField(field.id)} className="text-red-400 text-sm hover:text-red-600 font-medium">✕ Remove</button>
                    </div>
                    <input
                      value={field.label}
                      onChange={e => updateField(field.id, 'label', e.target.value)}
                      className="w-full font-semibold text-gray-700 border-b border-gray-200 mb-3 bg-transparent outline-none py-1 focus:border-indigo-400 transition-colors"
                      placeholder="Field label"
                    />
                    {['dropdown', 'radio', 'checkbox'].includes(field.type) && (
                      <div className="mb-3">
                        <p className="text-xs text-gray-400 mb-1">Options (comma separated):</p>
                        <input
                          value={field.options?.join(', ')}
                          onChange={e => updateField(field.id, 'options', e.target.value.split(',').map((o: string) => o.trim()))}
                          className="w-full text-sm border border-gray-200 rounded-lg p-2 outline-none focus:border-indigo-400"
                          placeholder="Option 1, Option 2, Option 3"
                        />
                      </div>
                    )}
                    <div className="mt-2">
                      {field.type === 'text' && <input type="text" placeholder="Enter text..." className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white" disabled />}
                      {field.type === 'email' && <input type="email" placeholder="Enter email..." className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white" disabled />}
                      {field.type === 'number' && <input type="number" placeholder="Enter number..." className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white" disabled />}
                      {field.type === 'date' && <input type="date" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white" disabled />}
                      {field.type === 'textarea' && <textarea placeholder="Type your message..." className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white" rows={3} disabled />}
                      {field.type === 'dropdown' && (
                        <select className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white" disabled>
                          <option>Select an option</option>
                          {field.options?.map((opt: string, i: number) => <option key={i}>{opt}</option>)}
                        </select>
                      )}
                      {field.type === 'radio' && (
                        <div className="space-y-2">
                          {field.options?.map((opt: string, i: number) => (
                            <label key={i} className="flex items-center gap-2 text-sm text-gray-600"><input type="radio" disabled />{opt}</label>
                          ))}
                        </div>
                      )}
                      {field.type === 'checkbox' && (
                        <div className="space-y-2">
                          {field.options?.map((opt: string, i: number) => (
                            <label key={i} className="flex items-center gap-2 text-sm text-gray-600"><input type="checkbox" disabled />{opt}</label>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Share Link Section */}
        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-bold text-gray-500 mb-3 text-sm font-black uppercase tracking-widest text-gray-700">🔗 Share Link</h3>
          <div className="flex gap-3 items-center">
            <input
              readOnly
              value={`${window.location.origin}/forms/${id}/respond`}
              className="flex-1 border border-gray-200 rounded-xl p-3 text-sm bg-gray-50 text-gray-600"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/forms/${id}/respond`)
                alert('Link copied!')
              }}
              className="px-5 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 text-sm font-semibold shadow-sm transition-all"
            >
              📋 Copy
            </button>
            <button
              onClick={() => router.push(`/forms/${id}/responses`)}
              className="px-5 py-3 bg-violet-500 text-white rounded-xl hover:bg-violet-600 text-sm font-semibold shadow-sm transition-all"
            >
              📊 Responses
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}