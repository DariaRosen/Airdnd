const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3030/api'

export const httpService = { get, post, put, del }

function get(resource, params) {
  const url = new URL(`${BASE_URL}/${resource}`)
  if (params) Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v)
  })
  return _request(url, { method: 'GET' })
}

function post(resource, data) {
  return _request(`${BASE_URL}/${resource}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
}

function put(resource, data) {
  return _request(`${BASE_URL}/${resource}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
}

function del(resource) {
  return _request(`${BASE_URL}/${resource}`, { method: 'DELETE' })
}

async function _request(input, options) {
  // חשוב: אין credentials פה
  const res = await fetch(input, { ...options })
  const isJson = res.headers.get('content-type')?.includes('application/json')
  if (!res.ok) {
    let msg = `HTTP ${res.status}`
    try {
      const body = isJson ? await res.json() : await res.text()
      msg += ` | ${typeof body === 'string' ? body : JSON.stringify(body)}`
    } catch (_) {}
    throw new Error(msg)
  }
  if (res.status === 204) return null
  return isJson ? await res.json() : await res.text()
}
