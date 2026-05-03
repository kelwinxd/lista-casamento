import { useState, useEffect, useRef } from 'react'
import "./admin.css"

const API = 'https://api-gabiekel.up.railway.app'

const CREDENTIALS = { username: 'gakel', password: 'monamour' }

const GIFT_ICONS = {
  jogo: '🍽️', faca: '🔪', panela: '🍳', frigideira: '🥘',
  cama: '🛏️', toalha: '🛁', copo: '🥂', taça: '🍷',
  almofada: '🛋️', vaso: '🌺', quadro: '🖼️', tapete: '🏠',
  ventilador: '🌀', liquidificador: '⚡', cafeteira: '☕',
  ferro: '👕', batedeira: '🥣', espelho: '🪞',
  tv: '📺', micro: '📡', ar: '❄️', geladeira: '🧊', furadeira: '🛠️', mixer: '🥛'
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

  return (
    <div className="login-wrap">
      <div className="login-card">
        <p className="login-eyebrow">Área Restrita</p>
        <h1 className="login-title">Painel dos Noivos</h1>
        <p className="login-sub">Gabi &amp; Kel</p>
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
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
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
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            autoComplete="current-password"
          />
        </div>
        {error && <p className="login-error">{error}</p>}
        <button className="primary-btn" onClick={handleLogin}>Entrar</button>
      </div>
    </div>
  )
}

// ── GIFT ROW COM EDIÇÃO + UPLOAD ──────────────────────────────────────────────

function GiftRow({ gift, onSave, onDelete, showToast }) {
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState(gift.giftname)
  const [editPrice, setEditPrice] = useState(gift.price ?? '')
  const [editChosen, setEditChosen] = useState(gift.chosen)
  const [editCodigoPix, setEditCodigoPix] = useState(gift.codigopix ?? '')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef()

  function openEdit() {
    setEditName(gift.giftname)
    setEditPrice(gift.price ?? '')
    setEditChosen(gift.chosen)
    setEditCodigoPix(gift.codigopix ?? '')
    setFile(null)
    setPreview(null)
    setEditing(true)
  }

  function handleFileChange(e) {
    const f = e.target.files[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  async function handleSave() {
    if (!editName.trim() || saving) return
    setSaving(true)
    try {
      // 1. Salva nome, preço, chosen e codigopix via PATCH
      await onSave(gift.id, {
        giftname: editName.trim(),
        price: editPrice !== '' ? Number(editPrice) : null,
        chosen: editChosen,
        codigopix: editCodigoPix || null
      })

      // 2. Se tem imagem nova, faz upload separado para o Cloudinary
      if (file) {
        const formData = new FormData()
        formData.append('qrcode', file)
        const res = await fetch(`${API}/gifts/${gift.id}/upload`, {
          method: 'POST',
          body: formData
        })
        if (!res.ok) {
          showToast('Dados salvos, mas erro no upload da imagem.')
          setSaving(false)
          setEditing(false)
          return
        }
      }

      setEditing(false)
      setFile(null)
      setPreview(null)
    } catch (e) {
      console.error(e)
      showToast('Erro ao salvar.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="gift-row">
      <div className="gift-row-inner">
        <div className="gift-row-left">
          <span className="gift-row-icon">{getIcon(gift.giftname)}</span>
          <div>
            <div className="gift-row-name">{gift.giftname}</div>
            {gift.price && (
              <div className="gift-row-price">
                {Number(gift.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
            )}
            {/* Indicadores de QR Code e Pix preenchidos */}
            <div style={{ display: 'flex', gap: 8, marginTop: 3 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: gift.qrcode ? '#7A9E7E' : '#EDE9E0', flexShrink: 0 }} />
                <span style={{ fontSize: 10, color: '#C4B9A8' }}>QR</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: gift.codigopix ? '#7A9E7E' : '#EDE9E0', flexShrink: 0 }} />
                <span style={{ fontSize: 10, color: '#C4B9A8' }}>Pix</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className={`gift-status ${gift.chosen ? 'chosen' : 'available'}`}>
            {gift.chosen ? 'escolhido' : 'livre'}
          </span>
          <button
            className="icon-btn"
            onClick={() => editing ? setEditing(false) : openEdit()}
            title="Editar"
          >
            {editing ? '✕' : '✎'}
          </button>
          {!gift.chosen && (
            <button className="icon-btn danger" onClick={() => onDelete(gift.id)} title="Remover">
              ×
            </button>
          )}
        </div>
      </div>

      {editing && (
        <div className="edit-row">
          {/* Nome e preço */}
          <div className="edit-row-fields">
            <input
              className="edit-input name"
              type="text"
              placeholder="Nome do presente"
              value={editName}
              onChange={e => setEditName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              autoFocus
            />
            <input
              className="edit-input price"
              type="number"
              placeholder="Preço (R$)"
              value={editPrice}
              onChange={e => setEditPrice(e.target.value)}
            />
          </div>

          {/* Código Pix */}
          <input
            className="edit-input"
            style={{ width: '100%' }}
            type="text"
            placeholder="Código Pix (copia e cola)"
            value={editCodigoPix}
            onChange={e => setEditCodigoPix(e.target.value)}
          />

          {/* Upload QR Code */}
          <div
            style={{
              border: `1.5px dashed ${file ? '#7A9E7E' : '#EDE9E0'}`,
              borderRadius: 2,
              padding: 12,
              cursor: 'pointer',
              textAlign: 'center',
              position: 'relative',
              background: file ? '#EEF4EE' : 'white',
              transition: 'all 0.15s'
            }}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              ref={fileRef}
              style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
            />
            {preview ? (
              <>
                <img src={preview} alt="preview" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 2, marginBottom: 4 }} />
                <p style={{ fontSize: 11, color: '#7A9E7E', fontWeight: 500, pointerEvents: 'none' }}>Imagem selecionada ✓</p>
              </>
            ) : gift.qrcode ? (
              <>
                <img src={gift.qrcode} alt="QR atual" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 2, marginBottom: 4 }} />
                <p style={{ fontSize: 11, color: '#C4B9A8', pointerEvents: 'none' }}>Clique para trocar o QR Code</p>
              </>
            ) : (
              <p style={{ fontSize: 11, color: '#C4B9A8', pointerEvents: 'none' }}>📷 Clique para fazer upload do QR Code</p>
            )}
          </div>

          <div className="edit-row-bottom">
            <label className="chosen-toggle" onClick={() => setEditChosen(v => !v)}>
              <div className={`toggle-track ${editChosen ? 'on' : ''}`}>
                <div className="toggle-thumb" />
              </div>
              {editChosen ? 'Marcado como escolhido' : 'Marcar como escolhido'}
            </label>
            <div className="edit-actions">
              <button className="edit-btn cancel" onClick={() => setEditing(false)}>
                Cancelar
              </button>
              <button
                className="edit-btn save"
                onClick={handleSave}
                disabled={saving || !editName.trim()}
              >
                {saving ? '...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── ADMIN PANEL ───────────────────────────────────────────────────────────────

function AdminPanel({ onLogout }) {
const [gifts, setGifts] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [newGift, setNewGift] = useState('')
  const [newPrice, setNewPrice] = useState('')
  const [newMarca, setNewMarca] = useState('')
  const [newLink, setNewLink] = useState('')
  const [newCodigoPix, setNewCodigoPix] = useState('')
  const [newQrFile, setNewQrFile] = useState(null)
  const [newQrPreview, setNewQrPreview] = useState(null)
  const [adding, setAdding] = useState(false)
  const [toast, setToast] = useState({ visible: false, message: '' })
  const newQrRef = useRef()

  useEffect(() => { document.title = 'Admin Casamento' }, [])

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
      const gData = await gRes.json()
      const uData = await uRes.json()
      setGifts(Array.isArray(gData) ? gData : gData.rows ?? [])
      setUsers(Array.isArray(uData) ? uData : uData.rows ?? [])
    } catch (e) { console.error(e) }
  }

  useEffect(() => {
    fetchAll().finally(() => setLoading(false))
  }, [])

  async function addGift() {
    if (!newGift.trim() || adding) return
    setAdding(true)
    try {
      // 1. Cria o presente com os campos básicos
      const res = await fetch(`${API}/gifts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          giftname: newGift.trim(),
          price: newPrice ? Number(newPrice) : null,
          marca: newMarca.trim() || null,
          link: newLink.trim() || null,
        })
      })
      if (!res.ok) { showToast('Erro ao adicionar presente.'); return }
      const created = await res.json()

      // 2. Se tem código pix, salva via PATCH
      if (newCodigoPix.trim()) {
        await fetch(`${API}/gifts/${created.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ codigopix: newCodigoPix.trim() })
        })
      }

      // 3. Se tem imagem de QR Code, faz upload separado
      if (newQrFile) {
        const formData = new FormData()
        formData.append('qrcode', newQrFile)
        const upRes = await fetch(`${API}/gifts/${created.id}/upload`, {
          method: 'POST',
          body: formData
        })
        if (!upRes.ok) showToast('Presente adicionado, mas erro no upload do QR Code.')
      }

      // 4. Limpa os campos
      setNewGift('')
      setNewPrice('')
      setNewMarca('')
      setNewLink('')
      setNewCodigoPix('')
      setNewQrFile(null)
      setNewQrPreview(null)
      await fetchAll()
      showToast('Presente adicionado!')
    } catch (e) {
      console.error(e)
      showToast('Erro ao adicionar presente.')
    } finally {
      setAdding(false)
    }
  }

  async function saveGift(id, data) {
    try {
      const res = await fetch(`${API}/gifts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (res.ok) {
        await fetchAll()
        showToast('Presente atualizado!')
      } else {
        showToast('Erro ao atualizar.')
      }
    } catch (e) {
      console.error(e)
      showToast('Erro ao atualizar.')
    }
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
      const res = await fetch(`${API}/givers/${id}`, { method: 'DELETE' })
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
          <div className="admin-logo">Gabi <em>&amp;</em> Kel</div>
          <div className="admin-badge">Painel Admin</div>
        </div>
        <button className="logout-btn" onClick={onLogout}>Sair</button>
      </header>

      <main className="admin-main">
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
            <div className="panel">
              <div className="panel-header">
                <span className="panel-title">Lista de presentes</span>
                <span className="panel-count">{gifts.length} itens</span>
              </div>

              <div className="add-gift-form">

        {/* Linha 1: nome + preço */}
        <div className="add-gift-row">
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
            style={{ maxWidth: 110 }}
          />
        </div>

        {/* Linha 2: marca + link */}
        <div className="add-gift-row">
          <input
            className="add-gift-input"
            type="text"
            placeholder="Marca (ex: Tramontina)"
            value={newMarca}
            onChange={e => setNewMarca(e.target.value)}
            style={{ maxWidth: 160 }}
          />
          <input
            className="add-gift-input"
            type="url"
            placeholder="Link (https://...)"
            value={newLink}
            onChange={e => setNewLink(e.target.value)}
            style={{ flex: 1 }}
          />
        </div>

        {/* Linha 3: código pix */}
        <input
          className="add-gift-input"
          type="text"
          placeholder="Código Pix (copia e cola)"
          value={newCodigoPix}
          onChange={e => setNewCodigoPix(e.target.value)}
          style={{ width: '100%' }}
        />

        {/* Linha 4: upload QR Code */}
        <div
          style={{
            border: `1.5px dashed ${newQrFile ? '#7A9E7E' : '#EDE9E0'}`,
            borderRadius: 2,
            padding: 12,
            cursor: 'pointer',
            textAlign: 'center',
            position: 'relative',
            background: newQrFile ? '#EEF4EE' : 'white',
            transition: 'all 0.15s'
          }}
        >
          <input
            type="file"
            accept="image/*"
            ref={newQrRef}
            onChange={e => {
              const f = e.target.files[0]
              if (!f) return
              setNewQrFile(f)
              setNewQrPreview(URL.createObjectURL(f))
            }}
            style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
          />
          {newQrPreview ? (
            <>
              <img src={newQrPreview} alt="preview" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 2, marginBottom: 4 }} />
              <p style={{ fontSize: 11, color: '#7A9E7E', fontWeight: 500, pointerEvents: 'none' }}>Imagem selecionada ✓</p>
            </>
          ) : (
            <p style={{ fontSize: 11, color: '#C4B9A8', pointerEvents: 'none' }}>📷 Clique para fazer upload do QR Code</p>
          )}
        </div>

        {/* Botão */}
        <button className="add-btn" onClick={addGift} disabled={adding || !newGift.trim()}>
          {adding ? '...' : 'Adicionar'}
        </button>

             </div>

              {gifts.length === 0 ? (
                <div className="empty-state">Nenhum presente cadastrado ainda</div>
              ) : gifts.map(g => (
                <GiftRow
                  key={g.id}
                  gift={g}
                  onSave={saveGift}
                  onDelete={deleteGift}
                  showToast={showToast}
                />
              ))}
            </div>

            <div className="panel">
              <div className="panel-header">
                <span className="panel-title">Quem vai dar o quê</span>
                <span className="panel-count">{users.length} {users.length === 1 ? 'pessoa' : 'pessoas'}</span>
              </div>

              {users.length === 0 ? (
                <div className="empty-state">Ninguém escolheu um presente ainda</div>
              ) : users.map(u => {
                const giftName = u.gift ?? '—'
                return (
                  <div className="gifter-row" key={u.id}>
                    <div className="gifter-info">
                      <div className="gifter-initial">{getInitials(u.name)}</div>
                      <span className="gifter-name">{u.name}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="gifter-gift-tag" title={giftName}>{giftName}</span>
                      <button className="icon-btn danger" onClick={() => deleteUser(u.id)} title="Remover">×</button>
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
      {loggedIn
        ? <AdminPanel onLogout={() => setLoggedIn(false)} />
        : <LoginScreen onLogin={() => setLoggedIn(true)} />
      }
    </>
  )
}