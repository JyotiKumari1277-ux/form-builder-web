'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

export default function RespondPage() {
  const params = useParams()
  const id = params.id as string
  const [form, setForm] = useState<any>(null)
  const [answers, setAnswers] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`https://form-builder-api-87q4.onrender.com/forms/${id}/public`)
      .then(r => r.json())
      .then(data => { setForm(data); setLoading(false) })
      .catch(() => { setError('Form load nahi hua'); setLoading(false) })
  }, [id])

  const handleSubmit = async () => {
    try {
      const res = await fetch(`https://form-builder-api-87q4.onrender.com/responses/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      })
      if (!res.ok) throw new Error('Submit failed')
      setSubmitted(true)
    } catch {
      setError('Submit nahi hua, dobara try karo')
    }
  }

  if (loading) return <div className="p-8 text-center text-gray-600">⌛ Loading Form...</div>
  if (error) return <div className="p-8 text-center text-red-500">❌ {error}</div>
  if (!form) return <div className="p-8 text-center text-red-500">❌ Form not found</div>
  if (submitted) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-green-600">Response submit ho gaya!</h2>
        <p className="text-gray-500 mt-2">Thank you for filling the form.</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-md border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          {form.title || 'Untitled Form'}
        </h1>
        <div className="space-y-6">
          {form.fields?.map((field: any) => (
            <div key={field.id} className="flex flex-col gap-2">
              <label className="font-semibold text-gray-700">
                {field.label || 'Unnamed Field'}
              </label>
              {field.type === 'text' && (
                <input
                  type="text"
                  placeholder="Enter text..."
                  className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setAnswers({ ...answers, [field.id]: e.target.value })}
                />
              )}
              {field.type === 'number' && (
                <input
                  type="number"
                  placeholder="Enter number..."
                  className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setAnswers({ ...answers, [field.id]: e.target.value })}
                />
              )}
              {field.type === 'dropdown' && (
                <select
                  className="p-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setAnswers({ ...answers, [field.id]: e.target.value })}
                >
                  <option value="">Select an option</option>
                  {field.options?.map((opt: string, i: number) => (
                    <option key={i} value={opt}>{opt}</option>
                  ))}
                </select>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={handleSubmit}
          className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition"
        >
          Submit Response
        </button>
      </div>
    </div>
  )
}