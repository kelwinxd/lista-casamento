import { useState, useEffect } from 'react'

const API = 'https://api-gabiekel.up.railway.app'

const CREDENTIALS = { username: 'gakel', password: 'monamour' }

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --cream: #FAF8F4;
    --sand: #EDE9E0;
    --taupe: #C4B9A8;
    --warm-brown: #8B7355;
    --deep: #3D2E1E;
    --rose: #C9917A;
    --rose-light: #F2E8E4;
    --green: #7A9E7E;
    --green-light: #EEF4EE;
    --red-light: #FAEAEA;
    --red: #C97A7A;
  }

  body {
    background: var(--cream);
    font-family: 'Jost', sans-serif;
    color: var(--deep);
    min-height: 100vh;
  }

  /* ── LOGIN ── */
  .login-wrap {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }

  .login-card {
    background: white;
    border: 1px solid var(--sand);
    border-radius: 2px;
    padding: 3rem 2.5rem 2.5rem;
    width: 100%;
    max-width: 380px;
    text-align: center;
  }

  .login-eyebrow {
    font-size: 10px;
    font-weight: 300;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: var(--rose);
    margin-bottom: 0.75rem;
  }

  .login-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2rem;
    font-weight: 300;
    color: var(--deep);
    margin-bottom: 0.25rem;
  }

  .login-sub {
    font-size: 12px;
    font-weight: 300;
    color: var(--taupe);
    margin-bottom: 2rem;
    letter-spacing: 0.5px;
  }

  .login-divider {
    display: flex; align-items: center; gap: 10px;
    margin: 0 auto 2rem;
    max-width: 160px;
  }
  .login-divider-line { flex: 1; height: 1px; background: var(--sand); }
  .login-divider-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--rose); }

  .login-field { margin-bottom: 1rem; text-align: left; }

  .field-label {
    display: block;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--warm-brown);
    margin-bottom: 6px;
  }

  .field-input {
    background: var(--cream);
    border: 1px solid var(--sand);
    border-radius: 1px;
    padding: 10px 14px;
    font-family: 'Jost', sans-serif;
    font-size: 14px;
    font-weight: 300;
    color: var(--deep);
    outline: none;
    transition: border-color 0.2s;
    width: 100%;
  }

  .field-input:focus { border-color: var(--taupe); background: white; }
  .field-input::placeholder { color: var(--taupe); }

  .login-error {
    font-size: 12px;
    color: var(--red);
    margin-bottom: 1rem;
    font-style: italic;
  }

  .primary-btn {
    width: 100%;
    padding: 13px;
    background: var(--deep);
    color: var(--cream);
    border: none;
    border-radius: 1px;
    font-family: 'Jost', sans-serif;
    font-size: 11px;
    font-weight: 400;
    letter-spacing: 3px;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.2s;
  }
  .primary-btn:hover { background: var(--warm-brown); }
  .primary-btn:disabled { background: var(--taupe); cursor: not-allowed; }

  /* ── ADMIN ── */
  .admin-header {
    background: white;
    border-bottom: 1px solid var(--sand);
    padding: 1rem 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .admin-logo {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.4rem;
    font-weight: 300;
    color: var(--deep);
  }

  .admin-logo em { font-style: italic; color: var(--warm-brown); }

  .admin-badge {
    font-size: 9px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--taupe);
    font-weight: 400;
  }

  .logout-btn {
    background: none;
    border: 1px solid var(--sand);
    border-radius: 1px;
    padding: 7px 16px;
    font-family: 'Jost', sans-serif;
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--taupe);
    cursor: pointer;
    transition: all 0.15s;
  }
  .logout-btn:hover { border-color: var(--taupe); color: var(--deep); }

  .admin-main {
    max-width: 980px;
    margin: 0 auto;
    padding: 2rem 1.5rem 3rem;
  }

  /* Stats row */
  .stats-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-bottom: 2rem;
  }

  .stat-card {
    background: white;
    border: 1px solid var(--sand);
    border-radius: 2px;
    padding: 1.25rem 1.5rem;
  }

  .stat-label {
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--taupe);
    font-weight: 400;
    margin-bottom: 0.5rem;
  }

  .stat-value {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.2rem;
    font-weight: 300;
    color: var(--deep);
    line-height: 1;
  }

  .stat-sub {
    font-size: 11px;
    color: var(--taupe);
    font-weight: 300;
    margin-top: 4px;
  }

  /* Two column layout */
  .admin-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    align-items: start;
  }

  .panel {
    background: white;
    border: 1px solid var(--sand);
    border-radius: 2px;
    overflow: hidden;
  }

  .panel-header {
    padding: 1rem 1.25rem;
    border-bottom: 1px solid var(--sand);
    display: flex;
    align-items: baseline;
    justify-content: space-between;
  }

  .panel-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.1rem;
    font-weight: 400;
    color: var(--deep);
  }

  .panel-count {
    font-size: 11px;
    font-weight: 300;
    color: var(--taupe);
  }

  /* Add gift form */
  .add-gift-form {
    padding: 1rem 1.25rem;
    border-bottom: 1px solid var(--sand);
    display: flex;
    gap: 8px;
  }

  .add-gift-input {
    flex: 1;
    background: var(--cream);
    border: 1px solid var(--sand);
    border-radius: 1px;
    padding: 8px 12px;
    font-family: 'Jost', sans-serif;
    font-size: 13px;
    font-weight: 300;
    color: var(--deep);
    outline: none;
    transition: border-color 0.2s;
  }
  .add-gift-input:focus { border-color: var(--taupe); background: white; }
  .add-gift-input::placeholder { color: var(--taupe); }

  .add-btn {
    background: var(--deep);
    color: var(--cream);
    border: none;
    border-radius: 1px;
    padding: 8px 16px;
    font-family: 'Jost', sans-serif;
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.15s;
    white-space: nowrap;
  }
  .add-btn:hover { background: var(--warm-brown); }
  .add-btn:disabled { background: var(--taupe); cursor: not-allowed; }

  /* Gift rows */
  .gift-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1.25rem;
    border-bottom: 1px solid var(--cream);
    transition: background 0.1s;
  }
  .gift-row:last-child { border-bottom: none; }
  .gift-row:hover { background: var(--cream); }

  .gift-row-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .gift-row-icon { font-size: 16px; flex-shrink: 0; }

  .gift-row-name {
    font-size: 13px;
    font-weight: 400;
    color: var(--deep);
  }

  .gift-status {
    font-size: 10px;
    font-weight: 400;
    letter-spacing: 1px;
    padding: 3px 8px;
    border-radius: 20px;
  }

  .gift-status.chosen {
    background: var(--green-light);
    color: var(--green);
  }

  .gift-status.available {
    background: var(--sand);
    color: var(--taupe);
  }

  .row-delete-btn {
    width: 24px; height: 24px;
    background: none;
    border: 1px solid var(--sand);
    border-radius: 50%;
    color: var(--taupe);
    font-size: 13px;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.15s;
    flex-shrink: 0;
    margin-left: 8px;
  }
  .row-delete-btn:hover { border-color: var(--red); color: var(--red); background: var(--red-light); }

  /* Gifter rows */
  .gifter-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1.25rem;
    border-bottom: 1px solid var(--cream);
    transition: background 0.1s;
  }
  .gifter-row:last-child { border-bottom: none; }
  .gifter-row:hover { background: var(--cream); }

  .gifter-info { display: flex; align-items: center; gap: 10px; }

  .gifter-initial {
    width: 30px; height: 30px;
    background: var(--rose-light);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px;
    font-weight: 500;
    color: var(--rose);
    flex-shrink: 0;
  }

  .gifter-name {
    font-size: 13px;
    font-weight: 400;
    color: var(--deep);
  }

  .gifter-gift-tag {
    font-size: 11px;
    background: var(--rose-light);
    color: var(--rose);
    padding: 3px 8px;
    border-radius: 20px;
    font-weight: 300;
    white-space: nowrap;
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .empty-state {
    padding: 2rem;
    text-align: center;
    color: var(--taupe);
    font-size: 12px;
    font-style: italic;
  }

  .section-label {
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--taupe);
    margin-bottom: 1rem;
  }

  .loading-dots { display: inline-flex; gap: 3px; align-items: center; }
  .loading-dots span {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: var(--taupe);
    animation: dot-bounce 1.2s infinite;
    display: inline-block;
  }
  .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
  .loading-dots span:nth-child(3) { animation-delay: 0.4s; }

  @keyframes dot-bounce {
    0%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-5px); }
  }

  .toast {
    position: fixed;
    bottom: 2rem; left: 50%;
    transform: translateX(-50%) translateY(80px);
    background: var(--deep);
    color: var(--cream);
    padding: 12px 24px;
    border-radius: 2px;
    font-size: 13px;
    font-weight: 300;
    letter-spacing: 0.5px;
    opacity: 0;
    transition: all 0.3s ease;
    z-index: 999;
    white-space: nowrap;
    pointer-events: none;
  }
  .toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }

  @media (max-width: 700px) {
    .admin-grid { grid-template-columns: 1fr; }
    .stats-row { grid-template-columns: 1fr 1fr; }
    .stats-row .stat-card:last-child { grid-column: 1/-1; }
  }
`

const GIFT_ICONS = {
  jogo: '🍽️', faca: '🔪', panela: '🍳', frigideira: '🥘',
  cama: '🛏️', toalha: '🛁', copo: '🥂', taça: '🍷',
  almofada: '🛋️', vaso: '🌺', quadro: '🖼️', tapete: '🏠',
  ventilador: '🌀', liquidificador: '⚡', cafeteira: '☕',
  ferro: '👕', batedeira: '🥣', espelho: '🪞',
  tv: '📺', micro: '📡', ar: '❄️', geladeira: '🧊',
}

function getIcon(name = '') {
  const n = name.toLowerCase()
  for (const [key, icon] of Object.entries(GIFT_ICONS)) {
    if (n.includes(key)) return icon
  }
  return '🎁'
}

function getInitials(name = '') {
  return name.trim().split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
}

// ── LOGIN ─────────────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleLogin() {
    if (username === CREDENTIALS.username && password === CREDENTIALS.password) {
      onLogin()
    } else {
      setError('Usuário ou senha incorretos')
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter') handleLogin()
  }

  return (
    <div className="login-wrap">
      <div className="login-card">
        <p className="login-eyebrow">Área Restrita</p>
        <h1 className="login-title">Painel dos Noivos</h1>
        <p className="login-sub">Gabi &amp; Ekel</p>

        <div className="login-divider">
          <div className="login-divider-line" />
          <div className="login-divider-dot" />
          <div className="login-divider-line" />
        </div>

        <div className="login-field">
          <label className="field-label">Usuário</label>
          <input
            className="field-input"
            type="text"
            placeholder="gakel"
            value={username}
            onChange={e => { setUsername(e.target.value); setError('') }}
            onKeyDown={handleKey}
            autoComplete="username"
          />
        </div>

        <div className="login-field">
          <label className="field-label">Senha</label>
          <input
            className="field-input"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => { setPassword(e.target.value); setError('') }}
            onKeyDown={handleKey}
            autoComplete="current-password"
          />
        </div>

        {error && <p className="login-error">{error}</p>}

        <button className="primary-btn" onClick={handleLogin}>
          Entrar
        </button>
      </div>
    </div>
  )
}

// ── ADMIN PANEL ───────────────────────────────────────────────────────────────

function AdminPanel({ onLogout }) {
  const [gifts, setGifts] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [newGift, setNewGift] = useState('')
  const [adding, setAdding] = useState(false)
  const [toast, setToast] = useState({ visible: false, message: '' })
  const [newPrice, setNewPrice] = useState('')

  function showToast(message) {
    setToast({ visible: true, message })
    setTimeout(() => setToast({ visible: false, message: '' }), 2800)
  }

  async function fetchAll() {
    try {
      const [gRes, uRes] = await Promise.all([
        fetch(`${API}/gifts`),
        fetch(`${API}/users`),
      ])
      setGifts(await gRes.json() || [])
      setUsers(await uRes.json() || [])
    } catch (e) { console.error(e) }
  }

  useEffect(() => {
    fetchAll().finally(() => setLoading(false))
  }, [])

  async function addGift() {
    if (!newGift.trim() || adding) return
    setAdding(true)
    try {
      const res = await fetch(`${API}/gifts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ giftname: newGift.trim(), price: newPrice ? Number(newPrice) : null })
      })
      if (res.ok) {
        setNewGift('')
        setNewPrice('')
        await fetchAll()
        showToast('Presente adicionado!')
      }
    } catch (e) { console.error(e) }
    finally { setAdding(false) }
  }

  async function deleteGift(id) {
    try {
      await fetch(`${API}/gifts/${id}`, { method: 'DELETE' })
      await fetchAll()
      showToast('Presente removido')
    } catch (e) { console.error(e) }
  }

  async function deleteUser(id) {
    try {
      const res = await fetch(`${API}/users/${id}`, { method: 'DELETE' })
      if (res.ok || res.status === 204) {
        await fetchAll()
        showToast('Convidado removido')
      }
    } catch (e) { console.error(e) }
  }

  const chosenCount = gifts.filter(g => g.chosen).length
  const availableCount = gifts.filter(g => !g.chosen).length

  return (
    <>
      <header className="admin-header">
        <div>
          <div className="admin-logo">Gabi <em>&amp;</em> Ekel</div>
          <div className="admin-badge">Painel Admin</div>
        </div>
        <button className="logout-btn" onClick={onLogout}>Sair</button>
      </header>

      <main className="admin-main">

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-label">Presentes escolhidos</div>
            <div className="stat-value">{chosenCount}</div>
            <div className="stat-sub">de {gifts.length} no total</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Ainda disponíveis</div>
            <div className="stat-value">{availableCount}</div>
            <div className="stat-sub">{gifts.length > 0 ? Math.round((availableCount / gifts.length) * 100) : 0}% da lista</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Convidados</div>
            <div className="stat-value">{users.length}</div>
            <div className="stat-sub">{users.length === 1 ? 'pessoa confirmada' : 'pessoas confirmadas'}</div>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div className="loading-dots"><span /><span /><span /></div>
          </div>
        ) : (
          <div className="admin-grid">

            {/* Gifts panel */}
            <div className="panel">
              <div className="panel-header">
                <span className="panel-title">Lista de presentes</span>
                <span className="panel-count">{gifts.length} itens</span>
              </div>

             <div className="add-gift-form">
  <input
    className="add-gift-input"
    type="text"
    placeholder="Nome do presente..."
    value={newGift}
    onChange={e => setNewGift(e.target.value)}
    onKeyDown={e => e.key === 'Enter' && addGift()}
  />
  <input
    className="add-gift-input"
    type="number"
    placeholder="Preço (R$)"
    value={newPrice}
    onChange={e => setNewPrice(e.target.value)}
    onKeyDown={e => e.key === 'Enter' && addGift()}
    style={{ maxWidth: 110 }}
  />
  <button className="add-btn" onClick={addGift} disabled={adding || !newGift.trim()}>
    {adding ? '...' : 'Adicionar'}
  </button>
</div>

              {gifts.length === 0 ? (
                <div className="empty-state">Nenhum presente cadastrado ainda</div>
              ) : gifts.map(g => (
  <div className="gift-row" key={g.id}>
    <div className="gift-row-left">
      <span className="gift-row-icon">{getIcon(g.giftname)}</span>
      <div>
        <span className="gift-row-name">{g.giftname}</span>
        {g.price && (
          <div style={{ fontSize: 11, color: 'var(--warm-brown)', marginTop: 1 }}>
            {Number(g.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </div>
        )}
      </div>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span className={`gift-status ${g.chosen ? 'chosen' : 'available'}`}>
        {g.chosen ? 'escolhido' : 'livre'}
      </span>
      {!g.chosen && (
        <button className="row-delete-btn" onClick={() => deleteGift(g.id)} title="Remover">×</button>
      )}
    </div>
  </div>
))}
            </div>

            {/* Gifters panel */}
            <div className="panel">
              <div className="panel-header">
                <span className="panel-title">Quem vai dar o quê</span>
                <span className="panel-count">{users.length} {users.length === 1 ? 'pessoa' : 'pessoas'}</span>
              </div>

              {users.length === 0 ? (
                <div className="empty-state">Ninguém escolheu um presente ainda</div>
              ) : users.map(u => {
                const giftName = u.gift?.giftname ?? u.gift ?? '—'
                return (
                  <div className="gifter-row" key={u.id}>
                    <div className="gifter-info">
                      <div className="gifter-initial">{getInitials(u.name)}</div>
                      <span className="gifter-name">{u.name}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="gifter-gift-tag" title={giftName}>{giftName}</span>
                      <button className="row-delete-btn" onClick={() => deleteUser(u.id)} title="Remover">×</button>
                    </div>
                  </div>
                )
              })}
            </div>

          </div>
        )}
      </main>

      <div className={`toast ${toast.visible ? 'show' : ''}`}>{toast.message}</div>
    </>
  )
}

// ── ROOT ──────────────────────────────────────────────────────────────────────

export default function Admin() {
  const [loggedIn, setLoggedIn] = useState(false)

  return (
    <>
      <style>{styles}</style>
      {loggedIn
        ? <AdminPanel onLogout={() => setLoggedIn(false)} />
        : <LoginScreen onLogin={() => setLoggedIn(true)} />
      }
    </>
  )
}