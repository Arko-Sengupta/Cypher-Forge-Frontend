import { useState, useEffect, useCallback } from 'react'
import { GeneratePasswordApi } from './Routes/Api'
import StaticData from './Data/StaticData.json'
import {
  Shield,
  Copy,
  Check,
  RefreshCw,
  Clock,
  ChevronDown,
  ChevronUp,
  X,
  AlertTriangle,
  Zap,
} from 'lucide-react'

const App = () => {
  const [password, setPassword] = useState('')
  const [length, setLength] = useState(StaticData.Controls.DefaultLength)
  const [options, setOptions] = useState({
    include_uppercase: true,
    include_lowercase: true,
    include_digits: true,
    include_special: true,
  })
  const [strength, setStrength] = useState('')
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])
  const [historyOpen, setHistoryOpen] = useState(false)
  const [toast, setToast] = useState('')
  const [alert, setAlert] = useState(null)

  const activeCount = Object.values(options).filter(Boolean).length

  const ShowToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  const ShowAlert = (message) => {
    setAlert({ title: StaticData.Alert.ErrorTitle, message })
  }

  const DismissAlert = () => {
    setAlert(null)
  }

  const GeneratePassword = useCallback(async () => {
    setLoading(true)
    setAlert(null)
    try {
      const data = await GeneratePasswordApi(length, options)
      setPassword(data.password)
      setStrength(data.strength)
      setHistory((prev) => [
        { password: data.password, strength: data.strength },
        ...prev.slice(0, 4),
      ])
    } catch (e) {
      const isConnectionError = !e.message || e.message === StaticData.Api.GeneratePasswordError
      ShowAlert(
        isConnectionError
          ? StaticData.Alert.ConnectionError
          : (e.message || StaticData.Alert.GenerationError)
      )
    } finally {
      setLoading(false)
    }
  }, [length, options])

  useEffect(() => {
    GeneratePassword()
  }, [])

  useEffect(() => {
    const Handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
        e.preventDefault()
        GeneratePassword()
      }
    }
    window.addEventListener('keydown', Handler)
    return () => window.removeEventListener('keydown', Handler)
  }, [GeneratePassword])

  const CopyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      ShowToast(StaticData.Toast.CopiedMessage)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      ShowToast(StaticData.Toast.CopyFailedMessage)
    }
  }

  const ToggleOption = (key) => {
    if (options[key] && activeCount <= 1) return
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const MaskPassword = (pwd) => {
    if (pwd.length <= 6) return pwd
    return pwd.slice(0, 3) + '\u2022'.repeat(pwd.length - 6) + pwd.slice(-3)
  }

  const strengthClass = strength.toLowerCase().replace(' ', '-')

  return (
    <div className="app">
      <header className="header">
        <div className="icon">
          <Shield size={28} strokeWidth={1.8} />
        </div>
        <h1>{StaticData.Header.Title}</h1>
        <p>{StaticData.Header.Subtitle}</p>
      </header>

      {alert && (
        <div className="alert alert-error">
          <AlertTriangle size={18} strokeWidth={2} className="alert-icon" />
          <div className="alert-content">
            <span className="alert-title">{alert.title}</span>
            <span className="alert-message">{alert.message}</span>
          </div>
          <button className="alert-dismiss" onClick={DismissAlert}>
            <X size={16} strokeWidth={2} />
          </button>
        </div>
      )}

      <div className="password-card">
        <div className="password-display">
          <div className={`password-text ${!password ? 'placeholder' : ''}`}>
            {password || StaticData.PasswordDisplay.Placeholder}
          </div>
          <div className="password-actions">
            <button
              className={`action-btn ${copied ? 'copied' : ''}`}
              onClick={() => password && CopyToClipboard(password)}
              title={StaticData.PasswordDisplay.CopyTitle}
              disabled={!password}
            >
              {copied ? <Check size={16} strokeWidth={2.5} /> : <Copy size={16} strokeWidth={2} />}
            </button>
            <button
              className="action-btn"
              onClick={GeneratePassword}
              title={StaticData.PasswordDisplay.RegenerateTitle}
              disabled={loading}
            >
              <RefreshCw size={16} strokeWidth={2} className={loading ? 'icon-spin' : ''} />
            </button>
          </div>
        </div>
        {strength && (
          <span className={`strength-badge ${strengthClass}`}>{strength}</span>
        )}
      </div>

      <div className="controls">
        <div className="length-control">
          <div className="length-label">
            <span>{StaticData.Controls.LengthLabel}</span>
            <span className="length-value">{length}</span>
          </div>
          <input
            type="range"
            min={StaticData.Controls.MinLength}
            max={StaticData.Controls.MaxLength}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
          />
          <div className="length-range-labels">
            <span>{StaticData.Controls.MinLength}</span>
            <span>{StaticData.Controls.MaxLength}</span>
          </div>
        </div>

        <div className="toggle-grid">
          {StaticData.CharTypes.map(({ Key, Label, Example }) => {
            const isActive = options[Key]
            const isLastActive = isActive && activeCount <= 1
            return (
              <div
                key={Key}
                className={`toggle-item ${isActive ? 'active' : ''} ${isLastActive ? 'last-active' : ''}`}
                onClick={() => ToggleOption(Key)}
              >
                <div className="toggle-switch-row">
                  <div className={`toggle-switch ${isActive ? 'on' : ''}`}>
                    <div className="toggle-thumb" />
                  </div>
                </div>
                <label>{Label}</label>
                <span>{Example}</span>
              </div>
            )
          })}
        </div>
      </div>

      <button
        className="generate-btn"
        onClick={GeneratePassword}
        disabled={loading}
      >
        {loading ? (
          <span className="loading-content">
            <span className="spinner" />
            {StaticData.GenerateButton.LoadingLabel}
          </span>
        ) : (
          <span className="generate-btn-content">
            <Zap size={18} strokeWidth={2} />
            {StaticData.GenerateButton.Label}
          </span>
        )}
      </button>
      <div className="shortcut-hint">
        {StaticData.ShortcutHint.Prefix} <kbd>{StaticData.ShortcutHint.Key1}</kbd> {StaticData.ShortcutHint.Separator} <kbd>{StaticData.ShortcutHint.Key2}</kbd> {StaticData.ShortcutHint.Suffix}
      </div>

      {history.length > 0 && (
        <div className="history-section">
          <div
            className="history-header"
            onClick={() => setHistoryOpen((p) => !p)}
          >
            <h3>
              <Clock size={15} strokeWidth={2} className="history-icon" />
              {StaticData.History.Title}
            </h3>
            <span className="history-toggle">
              {historyOpen ? (
                <><ChevronUp size={14} strokeWidth={2} /> {StaticData.History.HideLabel}</>
              ) : (
                <><ChevronDown size={14} strokeWidth={2} /> {StaticData.History.ShowLabel}</>
              )}
            </span>
          </div>
          {historyOpen && (
            <>
              <div className="history-list">
                {history.map((item, i) => (
                  <div className="history-item" key={i}>
                    <span className="history-password">
                      {MaskPassword(item.password)}
                    </span>
                    <span
                      className={`strength-badge small ${item.strength.toLowerCase().replace(' ', '-')}`}
                    >
                      {item.strength}
                    </span>
                    <button
                      className="action-btn small"
                      onClick={() => CopyToClipboard(item.password)}
                      title={StaticData.History.CopyTitle}
                    >
                      <Copy size={14} strokeWidth={2} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                className="clear-history"
                onClick={() => {
                  setHistory([])
                  setHistoryOpen(false)
                }}
              >
                {StaticData.History.ClearLabel}
              </button>
            </>
          )}
        </div>
      )}

      <footer className="footer">
        {StaticData.Footer.Text}
      </footer>

      {toast && (
        <div className="toast">
          <Check size={16} strokeWidth={2.5} className="toast-icon" />
          {toast}
        </div>
      )}
    </div>
  )
}

export default App
