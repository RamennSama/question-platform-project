const API_BASE = window.API_BASE || 'http://localhost:8080'

function getAuth() {
  const raw = localStorage.getItem('auth')
  if (!raw) return null
  try { return JSON.parse(raw) } catch { return null }
}

function setAuth(auth) { localStorage.setItem('auth', JSON.stringify(auth)) }
function clearAuth() { localStorage.removeItem('auth') }

async function apiFetch(path, { method = 'GET', headers = {}, body, params } = {}) {
  const url = new URL(API_BASE + path)
  if (params) Object.entries(params).forEach(([k,v]) => url.searchParams.set(k, v))
  const auth = getAuth()
  const finalHeaders = { 'Content-Type': 'application/json', ...headers }
  if (auth?.token) finalHeaders['Authorization'] = `Bearer ${auth.token}`

  const res = await fetch(url, { method, headers: finalHeaders, body: body ? JSON.stringify(body) : undefined })
  if (res.status === 401) { clearAuth(); window.location.href = '/static/login.html'; return }
  if (!res.ok) {
    const err = await res.json().catch(()=>({message: res.statusText}))
    throw new Error(err.message || 'Request failed')
  }
  const ct = res.headers.get('content-type') || ''
  return ct.includes('application/json') ? res.json() : res.text()
}

function renderNav() {
  const auth = getAuth()
  const adminLink = document.getElementById('adminLink')
  const loginLink = document.getElementById('loginLink')
  if (auth?.user?.roles?.includes('ADMIN')) adminLink.style.display = 'inline'
  else adminLink.style.display = 'none'
  if (auth) {
    if (loginLink) loginLink.textContent = 'Đăng xuất'
    if (loginLink) loginLink.onclick = (e)=>{ e.preventDefault(); clearAuth(); location.href='/static/login.html' }
  }
}

window.API = { apiFetch, getAuth, setAuth, clearAuth, renderNav }

