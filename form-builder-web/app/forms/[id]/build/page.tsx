'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

const FIELD_TYPES = [
  { type: 'text', label: '📝 Text Input' },
  { type: 'email', label: '📧 Email' },
  { type: 'number', label: '🔢 Number' },
  { type: 'dropdown', label: '🔽 Dropdown' },
  { type: 'checkbox', label: '☑️ Checkbox' },
  { type: 'radio', label: '🔘 Radio' },
  { type: 'date', label: '📅 Date' },
  { type: 'textarea', label: '📄 Textarea' },
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
    fetch(`http://localhost:3001/forms/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json()).then(data => {
      setTitle(data.title || 'Untitled Form')
      setFields(data.fields || [])
    })
  }, [id])

  const addField = (type: string) => {
    setFields([...fields, {
      id: Date.now().toString(),
      type,
      label: type.charAt(0).toUpperCase() + type.slice(1) + ' Field',
      placeholder: `Enter ${type}...`,
      required: false,
      options: ['dropdown','radio','checkbox'].includes(type) ? ['Option 1','Option 2'] : [],
    }])
  }

  const updateField = (fieldId: string, key: string, value: any) => {
    setFields(fields.map(f => f.id === fieldId ? { ...f, [key]: value } : f))
  }

  const removeField = (fieldId: string) => {
    setFields(fields.filter(f => f.id !== fieldId))
  }

  const handleSave = async () => {
    const token = localStorage.getItem('token')
    setError('')
    try {
      const res = await fetch(`http://localhost:3001/forms/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title, fields }),
      })
      if (!res.ok) throw new Error('failed')
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch { setError('Save failed') }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <input value={title} onChange={e => setTitle(e.target.value)}
            className="text-2xl font-bold border-b-2 border-gray-300 outline-none bg-transparent flex-1 py-1" />
          <button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">💾 Save</button>
          <button onClick={() => router.push('/dashboard')} className="px-4 py-2 bg-gray-200 rounded-lg">Back</button>
        </div>

        {saved && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">✅ Saved!</div>}
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}

        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="font-bold text-gray-700 mb-3 text-sm uppercase">Add Fields</h3>
            <div className="space-y-2">
              {FIELD_TYPES.map(ft => (
                <button key={ft.type} onClick={() => addField(ft.type)}
                  className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-blue-50 hover:text-blue-700 rounded-lg text-sm font-medium">
                  {ft.label}
                </button>
              ))}
            </div>
          </div>

          <div className="col-span-2 bg-white rounded-xl shadow p-4">
            <h3 className="font-bold text-gray-700 mb-3 text-sm uppercase">Form Preview</h3>
            {fields.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <p className="text-4xl mb-2">📋</p>
                <p>Left se field add karo</p>
              </div>
            ) : (
              <div className="space-y-4">
                {fields.map(field => (
                  <div key={field.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-blue-600 uppercase">{field.type}</span>
                      <button onClick={() => removeField(field.id)} className="text-red-500 text-sm">Remove</button>
                    </div>
                    <input value={field.label} onChange={e => updateField(field.id, 'label', e.target.value)}
                      className="w-full font-medium border-b border-gray-300 mb-2 bg-transparent outline-none py-1"
                      placeholder="Field label" />
                    {['dropdown','radio','checkbox'].includes(field.type) && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 mb-1">Options (comma separated):</p>
                        <input value={field.options?.join(', ')}
                          onChange={e => updateField(field.id, 'options', e.target.value.split(',').map((o: string) => o.trim()))}
                          className="w-full text-sm border rounded p-2 outline-none" placeholder="Option 1, Option 2" />
                      </div>
                    )}
                    <div className="mt-3">
                      {field.type === 'text' && <input type="text" placeholder={field.placeholder} className="w-full border rounded p-2 text-sm bg-white" disabled />}
                      {field.type === 'email' && <input type="email" placeholder="Enter email..." className="w-full border rounded p-2 text-sm bg-white" disabled />}
                      {field.type === 'number' && <input type="number" placeholder={field.placeholder} className="w-full border rounded p-2 text-sm bg-white" disabled />}
                      {field.type === 'date' && <input type="date" className="w-full border rounded p-2 text-sm bg-white" disabled />}
                      {field.type === 'textarea' && <textarea placeholder="Type here..." className="w-full border rounded p-2 text-sm bg-white" rows={3} disabled />}
                      {field.type === 'dropdown' && (
                        <select className="w-full border rounded p-2 text-sm bg-white" disabled>
                          <option>Select an option</option>
                          {field.options?.map((opt: string, i: number) => <option key={i}>{opt}</option>)}
                        </select>
                      )}
                      {field.type === 'radio' && (
                        <div className="space-y-1">
                          {field.options?.map((opt: string, i: number) => (
                            <label key={i} className="flex items-center gap-2 text-sm">
                              <input type="radio" disabled />{opt}
                            </label>
                          ))}
                        </div>
                      )}
                      {field.type === 'checkbox' && (
                        <div className="space-y-1">
                          {field.options?.map((opt: string, i: number) => (
                            <label key={i} className="flex items-center gap-2 text-sm">
                              <input type="checkbox" disabled />{opt}
                            </label>
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

        <div className="mt-6 bg-white rounded-xl shadow p-4">
          <h3 className="font-bold text-gray-700 mb-2">🔗 Share Link</h3>
          <div className="flex gap-3 items-center">
            <input readOnly
              value={typeof window !== 'undefined' ? `${window.location.origin}/forms/${id}/respond` : ''}
              className="flex-1 border rounded-lg p-2 text-sm bg-gray-50" />
            <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/forms/${id}/respond`); alert('Copied!') }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm">📋 Copy</button>
            <button onClick={() => router.push(`/forms/${id}/responses`)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm">📊 Responses</button>
          </div>
        </div>
      </div>
    </div>
  )
}