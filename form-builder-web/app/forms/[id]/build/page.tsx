'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

// Modern Slate/Teal theme ke liye classes
export default function BuildPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [title, setTitle] = useState('Untitled Form')
  const [fields, setFields] = useState<any[]>([])
  
  // ... (baki logic wahi rahega)

  return (
    <div className="min-h-screen bg-slate-900 py-10 px-4 text-slate-100">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-10 border-b border-slate-700 pb-6">
          <input 
            value={title} 
            onChange={e => setTitle(e.target.value)}
            className="text-3xl font-light bg-transparent outline-none text-white border-none" 
          />
          <button className="px-6 py-2 bg-teal-500 text-slate-900 rounded-full font-bold hover:bg-teal-400 transition">
            Publish Form
          </button>
        </div>

        {/* Yahan fields ka naya look */}
        <div className="space-y-4">
          {fields.map(field => (
            <div key={field.id} className="bg-slate-800 p-5 rounded-3xl border border-slate-700 shadow-lg">
               {/* Fields ka design yahan thoda minimalist rakhein */}
               <label className="text-teal-400 text-xs font-mono uppercase tracking-widest">
                 {field.type}
               </label>
               <p className="text-xl mt-1">{field.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}