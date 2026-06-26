'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

export default function RespondPage() {
  const params = useParams()
  const id = params.id as string
  const [form, setForm] = useState<any>(null)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/forms/${id}/public`)
      .then(r => r.json())
      .then(data => {
        setForm(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  const updateAnswer = (fieldId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [fieldId]: value }))
  }

  const toggleCheckbox = (fieldId: string, option: string) => {
    setAnswers(prev => {
      const current: string[] = prev[fieldId] || []
      const updated = current.includes(option)
        ? current.filter(o => o !== option)
        : [...current, option]
      return { ...prev, [fieldId]: updated }
    })
  }

  const handleSubmit = async () => {
    setError('')
    // Required field check
    for (const field of form.fields || []) {
      if (field.required && !answers[field.id]) {
        setError(`"${field.label}" zaroori hai`)
        return
      }
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/responses/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      })
      if (!res.ok) throw new Error('failed')
      setSubmitted(true)
    } catch {
      setError('Submit failed, try again')
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>
  if (!form) return <div className="min-h-screen flex items-center justify-center text-gray-400">Form not found</div>

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-md">
          <div className="text-4xl mb-3">✅</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Submitted!</h2>
          <p className="text-gray-500">Aapka response save ho gaya hai. Thank you!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-8">{form.title}</h1>

        {error && (
          <p className="text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2 mb-4 text-sm text-center">
            {error}
          </p>
        )}

        <div className="space-y-5">
          {(form.fields || []).map((field: any) => (
            <div key={field.id}>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>

              {field.type === 'text' && (
                <input
                  type="text"
                  placeholder={field.placeholder}
                  value={answers[field.id] || ''}
                  onChange={e => updateAnswer(field.id, e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition"
                />
              )}

              {field.type === 'email' && (
                <input
                  type="email"
                  placeholder={field.placeholder || 'you@example.com'}
                  value={answers[field.id] || ''}
                  onChange={e => updateAnswer(field.id, e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition"
                />
              )}

              {field.type === 'number' && (
                <input
                  type="number"
                  placeholder={field.placeholder}
                  value={answers[field.id] ?? ''}
                  onChange={e => updateAnswer(field.id, e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition"
                />
              )}

              {field.type === 'date' && (
                <input
                  type="date"
                  value={answers[field.id] || ''}
                  onChange={e => updateAnswer(field.id, e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition"
                />
              )}

              {field.type === 'textarea' && (
                <textarea
                  placeholder={field.placeholder}
                  value={answers[field.id] || ''}
                  onChange={e => updateAnswer(field.id, e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition"
                />
              )}

              {field.type === 'dropdown' && (
                <select
                  value={answers[field.id] || ''}
                  onChange={e => updateAnswer(field.id, e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition bg-white"
                >
                  <option value="">Select an option</option>
                  {(field.options || []).map((opt: string, i: number) => (
                    <option key={i} value={opt}>{opt}</option>
                  ))}
                </select>
              )}

              {field.type === 'radio' && (
                <div className="space-y-2">
                  {(field.options || []).map((opt: string, i: number) => (
                    <label key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="radio"
                        name={field.id}
                        value={opt}
                        checked={answers[field.id] === opt}
                        onChange={() => updateAnswer(field.id, opt)}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              )}

              {field.type === 'checkbox' && (
                <div className="space-y-2">
                  {(field.options || []).map((opt: string, i: number) => (
                    <label key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={(answers[field.id] || []).includes(opt)}
                        onChange={() => toggleCheckbox(field.id, opt)}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 active:scale-95 transition-all shadow-md mt-8"
        >
          Submit Response
        </button>
      </div>
    </div>
  )
}