'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function ResponsesPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [responses, setResponses] = useState<any[]>([])
  const [form, setForm] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { router.push('/login'); return }

    Promise.all([
      fetch(`https://form-builder-api-87q4.onrender.com/forms/${id}/public`).then(r => r.json()),
      fetch(`https://form-builder-api-87q4.onrender.com/responses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(r => r.json())
    ]).then(([formData, responsesData]) => {
      setForm(formData)
      setResponses(Array.isArray(responsesData) ? responsesData : [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [id])

  if (loading) return <div className="p-8 text-center">⌛ Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {form?.title || 'Form'} — Responses
            </h1>
            <p className="text-gray-500">{responses.length} responses</p>
          </div>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            ← Back
          </button>
        </div>

        {responses.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow">
            <p className="text-gray-400 text-lg">Abhi koi response nahi aaya</p>
            <p className="text-gray-300 mt-2">Share karo form aur responses yahan dikhenge</p>
          </div>
        ) : (
          <div className="space-y-4">
            {responses.map((response, index) => (
              <div key={response._id} className="bg-white p-6 rounded-xl shadow border">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-700">Response #{index + 1}</h3>
                  <span className="text-sm text-gray-400">
                    {new Date(response.createdAt).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="space-y-2">
                  {form?.fields?.map((field: any) => (
                    <div key={field.id} className="flex gap-4 py-2 border-b last:border-0">
                      <span className="font-medium text-gray-600 w-1/3">{field.label}</span>
                      <span className="text-gray-800">
                        {response.answers?.[field.id] || '—'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}