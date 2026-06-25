const API = 'http://localhost:3001'

export const getToken = () => localStorage.getItem('token')

export const api = {
  register: (data: any) =>
    fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json()),

  login: (data: any) =>
    fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json()),

  getForms: () =>
    fetch(`${API}/forms`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    }).then(r => r.json()),

  createForm: (title: string) =>
    fetch(`${API}/forms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ title }),
    }).then(r => r.json()),

  updateForm: (id: string, data: any) =>
    fetch(`${API}/forms/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify(data),
    }).then(r => r.json()),

  deleteForm: (id: string) =>
    fetch(`${API}/forms/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${getToken()}` },
    }).then(r => r.json()),

  getResponses: (formId: string) =>
    fetch(`${API}/responses/${formId}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    }).then(r => r.json()),

  submitResponse: (formId: string, answers: any) =>
    fetch(`${API}/responses/${formId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers }),
    }).then(r => r.json()),
}