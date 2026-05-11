import { useState, useEffect } from 'react'
import "./client.css"

const API = 'https://api-gabiekel.up.railway.app'

const GIFT_ICONS = {
   faca: '🔪', panela: '🍳', frigideira: '🥘',
  cama: '🛏️', toalha: '🛁', copo: '🥂', taça: '🍷',
  almofada: '🛋️', vaso: '🌺', quadro: '🖼️', tapete: '🏠',
  ventilador: '🌀', liquidificador: '⚡', cafeteira: '☕',
  ferro: '👕', batedeira: '🥣', espelho: '🪞',
  tv: '📺', micro: '📡', ar: '❄️', geladeira: '🧊', furadeira: '🛠️', mixer: '🥛', air:'♨️'
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
  return <div className={`toast ${visible ? 'show' : ''}`}>{message}</div>
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
  const [pixModal, setPixModal] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    document.title = 'Lista Casamento | Gakel'
  }, [])

  async function fetchUsers() {
    try {
      const res = await fetch(`${API}/users`)
      const json = await res.json()
      setUsers(Array.isArray(json) ? json : json.rows ?? [])
    } catch (e) { console.error(e) }
  }

  async function fetchGifts() {
    try {
      const res = await fetch(`${API}/gifts`)
      const json = await res.json()
      setGifts(Array.isArray(json) ? json : json.rows ?? [])
    } catch (e) { console.error(e) }
  }

  useEffect(() => {
    Promise.all([fetchGifts(), fetchUsers()]).finally(() => setLoading(false))
  }, [])

  function showToast(message) {
    setToast({ visible: true, message })
    setTimeout(() => setToast({ visible: false, message: '' }), 2800)
  }

  function handleSubmit() {
    if (!name.trim() || !selectedGift || submitting) return
    setPixModal({ gift: selectedGift, nome: name.trim() })
  }

  async function confirmGift(tipo) {
    if (!pixModal || submitting) return
    setSubmitting(true)
    try {
      await fetch(`${API}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: pixModal.nome,
          gift: pixModal.gift.giftname,
          tipo
        })
      })
      await fetch(`${API}/gifts/select`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: pixModal.gift.id })
      })
      setPixModal(null)
      setCopied(false)
      setName('')
      setSelectedGift(null)
      await fetchGifts()
      await fetchUsers()
      showToast(tipo === 'pix' ? 'Muito obrigado! ♡' : 'Presente reservado ♡')
    } catch (e) {
      console.error(e)
      showToast('Erro ao confirmar. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  function handleCopy() {
    if (!pixModal?.gift?.codigopix) return
    navigator.clipboard.writeText(pixModal.gift.codigopix)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const canSubmit = name.trim() && selectedGift && !submitting

  return (
    <>
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
          <p className="instructions-card">Clique no presente que quiser dar e preencha com seu nome!</p>
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

                {/* Marca — discreta, abaixo do nome */}
                {g.marca && (
                  <div className="gift-brand">{g.marca}</div>
                )}

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
            const giftName = u.gift ?? '—'
            return (
              <div className="gifter-row" key={u.id}>
                <div className="gifter-info">
                  <div className="gifter-initial">{getInitials(u.name)}</div>
                  <div className="gifter-left">
                    <span className="gifter-name">{u.name}</span>
                    <span className="gifter-gift">{giftName}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </main>

      {/* ── Modal Pix ── */}
      {pixModal && (
        <div className="modal-overlay">
          <div className="modal-box">

            {/* Fechar */}
            <button
              onClick={() => setPixModal(null)}
              style={{
                position: 'absolute',
                top: 12, right: 14,
                background: 'none',
                border: 'none',
                fontSize: 20,
                color: 'var(--taupe)',
                cursor: 'pointer',
                lineHeight: 1
              }}
            >
              ×
            </button>

            <p className="modal-eyebrow">Confirmar presente</p>
            <p className="modal-gift-name">{pixModal.gift.giftname}</p>

            {/* Marca no modal */}
            {pixModal.gift.marca && (
              <p className="modal-brand">{pixModal.gift.marca}</p>
            )}

            <p className="modal-subtitle">Escaneie o QR Code ou copie o código Pix</p>

            {/* QR Code */}
            <div className="modal-qr">
              {pixModal.gift.qrcode
                ? <img src={pixModal.gift.qrcode} alt="QR Code Pix" width={200} height={200} />
                : <div style={{ width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--taupe)', fontSize: 13, fontStyle: 'italic' }}>
                    QR Code não disponível
                  </div>
              }
            </div>

            <p className="modal-price">
              {Number(pixModal.gift.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>

            {/* Código Pix */}
            {pixModal.gift.codigopix && (
              <div className="modal-pix-row">
                <span className="modal-pix-code">{pixModal.gift.codigopix}</span>
                <button className="modal-copy-btn" onClick={handleCopy}>
                  {copied ? 'Copiado!' : 'Copiar'}
                </button>
              </div>
            )}

            {/* Link do produto — botão discreto */}
            {pixModal.gift.link && (
              <a
                href={pixModal.gift.link}
                target="_blank"
                rel="noopener noreferrer"
                className="modal-product-link"
              >
                Ver produto →
              </a>
            )}

            <div className="modal-actions">
              <button
                className="modal-btn-secondary"
                onClick={() => confirmGift('fisico')}
                disabled={submitting}
              >
                Vou levar físico
              </button>
              <button
                className="modal-btn-primary"
                onClick={() => confirmGift('pix')}
                disabled={submitting}
              >
                {submitting ? '...' : 'Já paguei ✓'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast message={toast.message} visible={toast.visible} />
    </>
  )
}