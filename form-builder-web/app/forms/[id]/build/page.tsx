'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

const FIELD_TYPES = [
  { type: 'text', label: 'Text Input' }, { type: 'email', label: 'Email' },
  { type: 'number', label: 'Number' }, { type: 'dropdown', label: 'Dropdown' },
  { type: 'checkbox', label: 'Checkbox' }, { type: 'radio', label: 'Radio' },
  { type: 'date', label: 'Date' }, { type: 'textarea', label: 'Textarea' },
]

export default function BuildPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [title, setTitle] = useState('Untitled Form')
  const [fields, setFields] = useState<any[]>([])
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { router.push('/login'); return }
    fetch(`https://form-builder-api-87q4.onrender.com/forms/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json()).then(data => {
      setTitle(data.title || 'Untitled Form')
      setFields(data.fields || [])
    })
  }, [id])

  const addField = (type: string) => {
    setFields([...fields, { id: Date.now().toString(), type, label: 'New ' + type + ' field', options: ['Option 1', 'Option 2'] }])
  }

  const updateField = (fieldId: string, key: string, value: any) => {
    setFields(fields.map(f => f.id === fieldId ? { ...f, [key]: value } : f))
  }

  const handleSave = async () => {
    const token = localStorage.getItem('token')
    await fetch(`https://form-builder-api-87q4.onrender.com/forms/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title, fields }),
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="min-h-screen bg-slate-900 py-10 px-4 text-slate-100">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-10 border-b border-slate-700 pb-6">
          <input value={title} onChange={e => setTitle(e.target.value)}
            className="text-3xl font-light bg-transparent outline-none text-white w-2/3" />
          <button onClick={handleSave} className="px-6 py-2 bg-teal-500 text-slate-900 rounded-full font-bold hover:bg-teal-400 transition">
            {saved ? 'Saved!' : 'Publish Form'}
          </button>
        </div>
        <div className="space-y-4">
          {fields.map(field => (
            <div key={field.id} className="bg-slate-800 p-5 rounded-3xl border border-slate-700 shadow-lg">
              <label className="text-teal-400 text-xs font-mono uppercase tracking-widest">{field.type}</label>
              <input value={field.label} onChange={e => updateField(field.id, 'label', e.target.value)}
                className="w-full text-xl mt-1 bg-transparent outline-none border-b border-slate-700 focus:border-teal-500" />
            </div>
          ))}
          <button onClick={() => addField('text')} className="w-full py-4 border-2 border-dashed border-slate-700 rounded-3xl text-slate-500 hover:text-teal-400 hover:border-teal-500 transition">
            + Add Field
          </button>
        </div>
      </div>
    </div>
  )
}