import { useState, useEffect } from 'react'

const API = 'https://api-gabiekel.up.railway.app'

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
    --gold: #B8975A;
  }

  body {
    background: var(--cream);
    font-family: 'Jost', sans-serif;
    color: var(--deep);
    min-height: 100vh;
  }

  .hero {
    text-align: center;
    padding: 3rem 2rem 2rem;
    border-bottom: 1px solid var(--sand);
    position: relative;
    overflow: hidden;
  }

  .hero::before {
    content: '';
    position: absolute;
    top: -60px; left: 50%;
    transform: translateX(-50%);
    width: 300px; height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(201,145,122,0.12) 0%, transparent 70%);
    pointer-events: none;
  }

  .hero-eyebrow {
    font-family: 'Jost', sans-serif;
    font-weight: 300;
    font-size: 11px;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: var(--rose);
    margin-bottom: 1rem;
  }

  .hero-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 3rem;
    font-weight: 300;
    line-height: 1.15;
    color: var(--deep);
    margin-bottom: 0.5rem;
  }

  .hero-title em {
    font-style: italic;
    color: var(--warm-brown);
  }

  .hero-sub {
    font-size: 13px;
    font-weight: 300;
    color: var(--taupe);
    letter-spacing: 1px;
  }

  .divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 1.5rem auto;
    max-width: 200px;
  }

  .divider-line { flex: 1; height: 1px; background: var(--taupe); }
  .divider-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--rose); }

  .main { max-width: 860px; margin: 0 auto; padding: 0 1.5rem 3rem; }

  .form-card {
    background: white;
    border: 1px solid var(--sand);
    border-radius: 2px;
    padding: 2rem 2rem 1.5rem;
    margin: 2rem 0;
  }

  .form-card-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.3rem;
    font-weight: 400;
    color: var(--deep);
    margin-bottom: 1.5rem;
  }

  .section-label {
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--taupe);
    margin-bottom: 1rem;
  }

  .gifts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 10px;
    margin: 1rem 0 2rem;
  }

  .gift-card {
    background: white;
    border: 1.5px solid var(--sand);
    border-radius: 2px;
    padding: 1.1rem 0.9rem;
    cursor: pointer;
    transition: border-color 0.15s, transform 0.15s, background 0.15s;
    text-align: center;
    position: relative;
    user-select: none;
  }

  .gift-price {
  font-size: 11px;
  font-weight: 400;
  color: var(--warm-brown);
  margin-top: 4px;
}

  .gift-card:hover:not(.chosen):not(.selected) {
    border-color: var(--taupe);
    transform: translateY(-2px);
  }

  .gift-card.selected {
    border-color: var(--rose);
    background: var(--rose-light);
  }

  .gift-card.chosen {
    background: var(--sand);
    border-color: var(--sand);
    cursor: not-allowed;
    opacity: 0.65;
  }

  .gift-icon {
    font-size: 22px;
    margin-bottom: 0.5rem;
    display: block;
  }

  .gift-name {
    font-family: 'Jost', sans-serif;
    font-size: 12px;
    font-weight: 400;
    color: var(--deep);
    line-height: 1.3;
  }

  .gift-chosen-tag {
    position: absolute;
    top: 6px; right: 6px;
    width: 16px; height: 16px;
    background: var(--warm-brown);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    color: white;
    font-size: 9px;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .field-group { display: flex; flex-direction: column; gap: 6px; }

  .field-label {
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--warm-brown);
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

  .gift-selected-display {
    background: var(--cream);
    border: 1px solid var(--sand);
    border-radius: 1px;
    padding: 10px 14px;
    font-size: 14px;
    font-weight: 300;
    color: var(--deep);
    min-height: 40px;
    display: flex;
    align-items: center;
  }

  .gift-selected-display.empty { color: var(--taupe); font-style: italic; }

  .submit-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 13px;
    background: var(--deep);
    color: var(--cream);
    border: none;
    border-radius: 1px;
    font-family: 'Jost', sans-serif;
    font-size: 12px;
    font-weight: 400;
    letter-spacing: 3px;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.2s, transform 0.1s;
  }

  .submit-btn:hover:not(:disabled) { background: var(--warm-brown); }
  .submit-btn:active:not(:disabled) { transform: scale(0.99); }
  .submit-btn:disabled { background: var(--taupe); cursor: not-allowed; }

  .gifters-card {
    background: white;
    border: 1px solid var(--sand);
    border-radius: 2px;
    overflow: hidden;
  }

  .gifters-header {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--sand);
    display: flex;
    align-items: baseline;
    gap: 10px;
  }

  .gifters-header-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.1rem;
    font-weight: 400;
    color: var(--deep);
  }

  .gifters-count {
    font-size: 11px;
    font-weight: 300;
    color: var(--taupe);
  }

  .gifter-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.9rem 1.5rem;
    border-bottom: 1px solid var(--cream);
    transition: background 0.12s;
  }

  .gifter-row:last-child { border-bottom: none; }
  .gifter-row:hover { background: var(--cream); }

  .gifter-info { display: flex; align-items: center; }

  .gifter-initial {
    width: 34px; height: 34px;
    background: var(--rose-light);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px;
    font-weight: 500;
    color: var(--rose);
    margin-right: 12px;
    flex-shrink: 0;
  }

  .gifter-left { display: flex; flex-direction: column; gap: 2px; }

  .gifter-name {
    font-size: 14px;
    font-weight: 400;
    color: var(--deep);
  }

  .gifter-gift {
    font-size: 12px;
    font-weight: 300;
    color: var(--warm-brown);
    font-style: italic;
  }

  .delete-btn {
    width: 28px; height: 28px;
    background: none;
    border: 1px solid var(--sand);
    border-radius: 50%;
    color: var(--taupe);
    font-size: 15px;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.15s;
    flex-shrink: 0;
    line-height: 1;
  }

  .delete-btn:hover {
    border-color: var(--rose);
    color: var(--rose);
    background: var(--rose-light);
  }

  .empty-state {
    text-align: center;
    padding: 2.5rem;
    color: var(--taupe);
    font-size: 13px;
    font-weight: 300;
    font-style: italic;
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

  .toast.show {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
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

  @media (max-width: 600px) {
    .hero-title { font-size: 2rem; }
    .form-row { grid-template-columns: 1fr; }
    .gifts-grid { grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); }
  }
`

const GIFT_ICONS = {
  jogo: '🍽️', faca: '🔪', panela: '🍳', frigideira: '🥘',
  cama: '🛏️', toalha: '🛁', copo: '🥂', taça: '🍷',
  almofada: '🛋️', vaso: '🌺', quadro: '🖼️', tapete: '🏠',
  ventilador: '🌀', liquidificador: '⚡', cafeteira: '☕',
  ferro: '👕', batedeira: '🥣', espelho: '🪞',
  tv: '📺', micro: '📡', ar: '❄️', geladeira: '🧊',furadeira:'🛠️',mixer:'🥛'
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

function Toast({ message, visible }) {
  return (
    <div className={`toast ${visible ? 'show' : ''}`}>
      {message}
    </div>
  )
}

function LoadingDots() {
  return (
    <div className="loading-dots">
      <span /><span /><span />
    </div>
  )
}

export default function App() {
  const [gifts, setGifts] = useState([])
  const [users, setUsers] = useState([])
  const [name, setName] = useState('')
  const [selectedGift, setSelectedGift] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState({ visible: false, message: '' })

  async function fetchGifts() {
    try {
      const res = await fetch(`${API}/gifts`)
      const json = await res.json()
      setGifts(json || [])
    } catch (e) { console.error(e) }
  }

  async function fetchUsers() {
    try {
      const res = await fetch(`${API}/users`)
      const json = await res.json()
      setUsers(json || [])
    } catch (e) { console.error(e) }
  }

  useEffect(() => {
    Promise.all([fetchGifts(), fetchUsers()]).finally(() => setLoading(false))
  }, [])

  function showToast(message) {
    setToast({ visible: true, message })
    setTimeout(() => setToast({ visible: false, message: '' }), 2800)
  }

  async function handleSubmit() {
    if (!name.trim() || !selectedGift || submitting) return
    setSubmitting(true)
    try {
      await fetch(`${API}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), gift: selectedGift.giftname })
      })
      await fetch(`${API}/gifts/select`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedGift.id })
      })
      setName('')
      setSelectedGift(null)
      await fetchGifts()
      await fetchUsers()
      showToast('Presente confirmado! Muito obrigado ♡')
    } catch (e) {
      console.error(e)
      showToast('Erro ao confirmar. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  async function removeUser(id) {
    try {
      const res = await fetch(`${API}/users/${id}`, { method: 'DELETE' })
      if (res.status === 204 || res.ok) {
        await fetchUsers()
        await fetchGifts()
        showToast('Removido com sucesso')
      }
    } catch (e) { console.error(e) }
  }

  const canSubmit = name.trim() && selectedGift && !submitting

  return (
    <>
      <style>{styles}</style>

      <header className="hero">
        <p className="hero-eyebrow">Lista de Presentes</p>
        <h1 className="hero-title">Gabi <em>&amp;</em> Kel</h1>
        <p className="hero-sub">Sua presença já é o nosso maior presente</p>
        <div className="divider">
          <div className="divider-line" />
          <div className="divider-dot" />
          <div className="divider-line" />
        </div>
      </header>

      <main className="main">
        <div className="form-card">
          <p className="form-card-title">Escolha um presente</p>

          <p className="section-label">Presentes disponíveis</p>

          <div className="gifts-grid">
            {loading ? (
              <div style={{ gridColumn: '1/-1', padding: '1rem 0' }}>
                <LoadingDots />
              </div>
            ) : gifts.length === 0 ? (
              <div style={{ gridColumn: '1/-1', color: 'var(--taupe)', fontSize: 13, fontStyle: 'italic' }}>
                Nenhum presente disponível
              </div>
            ) : gifts.map(g => (
              <div
                key={g.id}
                className={`gift-card ${g.chosen ? 'chosen' : ''} ${selectedGift?.id === g.id ? 'selected' : ''}`}
                onClick={() => !g.chosen && setSelectedGift(g)}
              >
                {g.chosen && <div className="gift-chosen-tag">✓</div>}
                <span className="gift-icon">{getIcon(g.giftname)}</span>
                <div className="gift-name">{g.giftname}</div>
                {g.price && (
  <div className="gift-price">
    {Number(g.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
  </div>
)}
              </div>
            ))}
          </div>

          <div className="form-row">
            <div className="field-group">
              <label className="field-label">Seu nome</label>
              <input
                className="field-input"
                type="text"
                placeholder="Nome completo"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div className="field-group">
              <label className="field-label">Presente escolhido</label>
              <div className={`gift-selected-display ${selectedGift ? '' : 'empty'}`}>
                {selectedGift ? selectedGift.giftname : 'Selecione um presente acima'}
              </div>
            </div>
          </div>

          <button
            className="submit-btn"
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            {submitting ? 'Enviando...' : 'Confirmar presente'}
          </button>
        </div>

        <div className="gifters-card">
          <div className="gifters-header">
            <span className="gifters-header-title">Quem já escolheu</span>
            <span className="gifters-count">
              {users.length} {users.length === 1 ? 'pessoa' : 'pessoas'}
            </span>
          </div>

          {users.length === 0 ? (
            <div className="empty-state">Nenhum presente escolhido ainda</div>
          ) : users.map(u => {
            const giftName = u.gift?.giftname ?? u.gift ?? '—'
            return (
              <div className="gifter-row" key={u.id}>
                <div className="gifter-info">
                  <div className="gifter-initial">{getInitials(u.name)}</div>
                  <div className="gifter-left">
                    <span className="gifter-name">{u.name}</span>
                    <span className="gifter-gift">{giftName}</span>
                  </div>
                </div>
                <button className="delete-btn" onClick={() => removeUser(u.id)} title="Remover">
                  ×
                </button>
              </div>
            )
          })}
        </div>
      </main>

      <Toast message={toast.message} visible={toast.visible} />
    </>
  )
}