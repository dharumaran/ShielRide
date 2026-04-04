import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { CITIES } from '@/lib/constants'
import { authApi, policiesApi, premiumApi, workersApi } from '@/lib/api'
import { useWorkerStore } from '@/stores/workerStore'
import { motion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

type EntryMode = 'choose' | 'new' | 'existing'
type NewStep = 'register' | 'city' | 'policy' | 'explain' | 'premium' | 'upi' | 'done'
type ExistStep = 'login' | 'profile' | 'pay'

const NEW_STEP_ORDER: NewStep[] = ['register', 'city', 'policy', 'explain', 'premium', 'upi', 'done']

function weekStartIso(): string {
  const d = new Date()
  const day = d.getUTCDay()
  const diff = (day + 6) % 7
  d.setUTCDate(d.getUTCDate() - diff)
  d.setUTCHours(0, 0, 0, 0)
  return d.toISOString()
}

const COVERAGE = [
  { icon: '🌧️', title: 'Rain disruption', line: 'When heavy rain stops you from earning, we step in.' },
  { icon: '🌡️', title: 'Extreme heat', line: 'Dangerous heat that keeps you off the road is covered.' },
  { icon: '🌫️', title: 'Hazardous air', line: 'Very bad air quality that affects your shift counts.' },
  { icon: '📴', title: 'Platform outage', line: 'When the app is down and you cannot work.' },
  { icon: '📉', title: 'Demand crash', line: 'When orders dry up sharply through no fault of yours.' },
] as const

const AI_BULLETS = [
  'Sometimes income stops because of weather or app problems.',
  'We watch those conditions for you—no forms to fill.',
  'If the rules match, money goes straight to your UPI.',
  'No claims line, no paperwork.',
  'You pay a small amount each week only when you stay covered.',
] as const

export function OnboardingPage() {
  const navigate = useNavigate()
  const setSession = useWorkerStore((s) => s.setSession)
  const setStoreCity = useWorkerStore((s) => s.setCity)

  const [entry, setEntry] = useState<EntryMode>('choose')
  const [newStep, setNewStep] = useState<NewStep>('register')
  const [existStep, setExistStep] = useState<ExistStep>('login')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [token, setToken] = useState<string | null>(null)
  const [workerId, setWorkerId] = useState<string | null>(null)
  const [city, setCity] = useState<(typeof CITIES)[number]>('Chennai')
  const [upi, setUpi] = useState('')
  const [weeklyPremium, setWeeklyPremium] = useState<number | null>(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [policyId, setPolicyId] = useState<string | null>(null)

  const newIdx = NEW_STEP_ORDER.indexOf(newStep)
  const progressMax = NEW_STEP_ORDER.length - 1

  const loadPremium = useCallback(async () => {
    setErr(null)
    try {
      const r = await premiumApi.calculate(city)
      setWeeklyPremium(r.weeklyPremiumRupees)
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Could not get price')
      setWeeklyPremium(null)
    }
  }, [city])

  useEffect(() => {
    if (entry !== 'new' || newStep !== 'premium') return
    void loadPremium()
  }, [entry, newStep, loadPremium])

  useEffect(() => {
    if (entry !== 'existing' || existStep !== 'pay') return
    void loadPremium()
  }, [entry, existStep, loadPremium, city])

  async function onSendOtp() {
    setErr(null)
    setBusy(true)
    try {
      await authApi.sendOtp(phone.replace(/\D/g, '').slice(0, 10))
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'OTP send failed')
    } finally {
      setBusy(false)
    }
  }

  async function onVerifyNewUser() {
    const p = phone.replace(/\D/g, '').slice(0, 10)
    if (p.length !== 10) {
      setErr('Enter a 10-digit mobile number')
      return
    }
    setErr(null)
    setBusy(true)
    try {
      const r = await authApi.verifyOtp(p, otp)
      setToken(r.token)
      setSession(r.token, null)
      setPhone(p)
      setNewStep('city')
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Verify failed')
    } finally {
      setBusy(false)
    }
  }

  async function onVerifyExisting() {
    const p = phone.replace(/\D/g, '').slice(0, 10)
    if (p.length !== 10) {
      setErr('Enter a 10-digit mobile number')
      return
    }
    setErr(null)
    setBusy(true)
    try {
      const r = await authApi.verifyOtp(p, otp)
      setToken(r.token)
      setPhone(p)
      if (!r.worker?.id) {
        setErr('No account for this number. Choose New user to register.')
        setBusy(false)
        return
      }
      setWorkerId(r.worker.id)
      setSession(r.token, r.worker.id)
      setStoreCity(r.worker.city)
      setCity((r.worker.city as (typeof CITIES)[number]) ?? 'Chennai')
      const full = await workersApi.get(r.worker.id)
      const active = full.policies[0]
      if (active?.premiumPaidAt) {
        navigate('/dashboard')
        return
      }
      const needCity = !full.city?.trim()
      const needUpi = !full.upiHandle?.trim() || full.upiHandle.length < 3
      setUpi(full.upiHandle || '')
      if (needCity || needUpi) {
        setExistStep('profile')
      } else {
        setExistStep('pay')
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Verify failed')
    } finally {
      setBusy(false)
    }
  }

  async function onSaveExistingProfile() {
    const id = workerId
    if (!id) return
    setErr(null)
    setBusy(true)
    try {
      await workersApi.update(id, { city, upiHandle: upi })
      setStoreCity(city)
      setExistStep('pay')
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Update failed')
    } finally {
      setBusy(false)
    }
  }

  async function onCompleteNewUser() {
    if (!token || weeklyPremium === null) return
    const p = phone
    setErr(null)
    setBusy(true)
    try {
      const w = await workersApi.create({
        phone: p,
        name: name.trim(),
        city,
        email: email.trim() || undefined,
        upiHandle: upi.trim(),
        platform: 'zepto',
        deviceFingerprint: 'pwa-onboard',
      })
      setWorkerId(w.id)
      setSession(token, w.id)
      setStoreCity(city)
      let pid: string
      const workerRes = await workersApi.get(w.id)
      const existing = workerRes.policies[0]
      if (existing && !existing.premiumPaidAt) {
        pid = existing.id
      } else {
        const pol = await policiesApi.create(w.id, weekStartIso())
        pid = pol.id
      }
      await policiesApi.pay(pid, 'upi-onboard-demo')
      setPolicyId(pid)
      setNewStep('done')
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Could not finish signup')
    } finally {
      setBusy(false)
    }
  }

  async function onPayExisting() {
    const wid = workerId
    if (!wid) return
    setErr(null)
    setBusy(true)
    try {
      let pid: string
      const workerRes = await workersApi.get(wid)
      const existing = workerRes.policies[0]
      if (existing && !existing.premiumPaidAt) {
        pid = existing.id
      } else {
        const pol = await policiesApi.create(wid, weekStartIso())
        pid = pol.id
      }
      await policiesApi.pay(pid, 'upi-existing-demo')
      navigate('/dashboard')
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Payment step failed')
    } finally {
      setBusy(false)
    }
  }

  function resetToChoose() {
    setEntry('choose')
    setNewStep('register')
    setExistStep('login')
    setErr(null)
    setToken(null)
    setWorkerId(null)
    setWeeklyPremium(null)
    setPolicyId(null)
  }

  return (
    <div className="mx-auto min-h-screen max-w-lg px-4 py-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="font-display text-xl font-bold text-fg">ShieldRide</h1>
        <p className="text-xs text-fg-muted">Income protection for delivery partners</p>

        {err ? (
          <p className="mt-3 rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">{err}</p>
        ) : null}

        {entry === 'choose' ? (
          <Card className="mt-6 space-y-3">
            <p className="text-center text-sm text-fg-muted">How do you want to continue?</p>
            <Button className="w-full" onClick={() => setEntry('new')}>
              New user
            </Button>
            <Button className="w-full" variant="ghost" onClick={() => setEntry('existing')}>
              Existing user
            </Button>
          </Card>
        ) : null}

        {entry === 'new' ? (
          <>
            <div className="mb-4 mt-6 flex gap-1">
              {NEW_STEP_ORDER.slice(0, -1).map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full ${i <= newIdx ? 'bg-accent' : 'bg-white/10'}`}
                />
              ))}
            </div>
            <button type="button" className="text-xs text-accent" onClick={resetToChoose}>
              ← Back
            </button>

            {newStep === 'register' ? (
              <Card className="mt-4 space-y-3">
                <h2 className="font-display text-base font-semibold text-fg">Your details</h2>
                <label className="block text-xs text-fg-muted">Name</label>
                <input
                  className="w-full rounded-xl border border-dim-border bg-base px-3 py-2.5 text-fg outline-none focus:border-bright-border"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  autoComplete="name"
                />
                <label className="block text-xs text-fg-muted">Mobile</label>
                <input
                  className="w-full rounded-xl border border-dim-border bg-base px-3 py-2.5 font-mono text-fg outline-none focus:border-bright-border"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  inputMode="numeric"
                  placeholder="10-digit number"
                  autoComplete="tel"
                />
                <label className="block text-xs text-fg-muted">Email (optional)</label>
                <input
                  className="w-full rounded-xl border border-dim-border bg-base px-3 py-2.5 text-fg outline-none focus:border-bright-border"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  inputMode="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
                <Button className="w-full" variant="ghost" disabled={busy || phone.length !== 10} onClick={onSendOtp}>
                  Send OTP
                </Button>
                <label className="block text-xs text-fg-muted">OTP</label>
                <input
                  className="w-full rounded-xl border border-dim-border bg-base px-3 py-2.5 font-mono text-fg outline-none focus:border-bright-border"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  inputMode="numeric"
                  placeholder="6-digit code"
                />
                <p className="text-[11px] text-fg-muted">Demo code: 123456</p>
                <Button
                  className="w-full"
                  disabled={busy || name.trim().length < 2 || phone.length !== 10 || otp.length !== 6}
                  onClick={onVerifyNewUser}
                >
                  Continue
                </Button>
              </Card>
            ) : null}

            {newStep === 'city' ? (
              <Card className="mt-4 space-y-4">
                <h2 className="font-display text-base font-semibold text-fg">Your work city</h2>
                <p className="text-xs text-fg-muted">We use this for your weekly price.</p>
                <select
                  className="w-full rounded-xl border border-dim-border bg-base px-3 py-2.5 text-fg outline-none focus:border-bright-border"
                  value={city}
                  onChange={(e) => setCity(e.target.value as (typeof CITIES)[number])}
                >
                  {CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <Button className="w-full" onClick={() => setNewStep('policy')}>
                  Next
                </Button>
              </Card>
            ) : null}

            {newStep === 'policy' ? (
              <Card className="mt-4 space-y-4">
                <h2 className="font-display text-base font-semibold text-fg">🛡️ ShieldRide Income Protection</h2>
                <p className="text-xs text-fg-muted">Coverage includes:</p>
                <ul className="space-y-3">
                  {COVERAGE.map((c) => (
                    <li key={c.title} className="text-sm text-fg">
                      <span className="mr-1">{c.icon}</span>
                      <span className="font-medium">{c.title}</span>
                      <span className="block pl-6 text-xs text-fg-muted">{c.line}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" onClick={() => setNewStep('explain')}>
                  Next
                </Button>
              </Card>
            ) : null}

            {newStep === 'explain' ? (
              <Card className="mt-4 space-y-4">
                <h2 className="font-display text-base font-semibold text-fg">How it works</h2>
                <ul className="list-inside list-disc space-y-2 text-sm text-fg">
                  {AI_BULLETS.map((b) => (
                    <li key={b} className="marker:text-accent">
                      {b}
                    </li>
                  ))}
                </ul>
                <Button className="w-full" onClick={() => setNewStep('premium')}>
                  See my price
                </Button>
              </Card>
            ) : null}

            {newStep === 'premium' ? (
              <Card className="mt-4 space-y-4 text-center">
                <h2 className="font-display text-base font-semibold text-fg">Your weekly price</h2>
                {weeklyPremium === null && !err ? (
                  <p className="text-sm text-fg-muted">Calculating…</p>
                ) : weeklyPremium !== null ? (
                  <>
                    <p className="font-display text-3xl font-bold text-accent">₹{weeklyPremium}</p>
                    <p className="text-xs text-fg-muted">Based on conditions in your city</p>
                    <p className="text-xs text-fg-muted">Usually between ₹20–₹50/week</p>
                  </>
                ) : null}
                <Button className="w-full" variant="ghost" disabled={busy} onClick={() => void loadPremium()}>
                  Refresh price
                </Button>
                <Button className="w-full" disabled={weeklyPremium === null} onClick={() => setNewStep('upi')}>
                  Continue
                </Button>
              </Card>
            ) : null}

            {newStep === 'upi' ? (
              <Card className="mt-4 space-y-4">
                <h2 className="font-display text-base font-semibold text-fg">UPI for payouts</h2>
                <p className="text-xs text-fg-muted">
                  Weekly: <span className="font-mono text-accent">₹{weeklyPremium ?? '—'}</span> · Money lands here when a
                  covered event happens.
                </p>
                <input
                  className="w-full rounded-xl border border-dim-border bg-base px-3 py-2.5 font-mono text-sm text-fg outline-none focus:border-bright-border"
                  value={upi}
                  onChange={(e) => setUpi(e.target.value)}
                  placeholder="yourname@upi"
                  autoComplete="off"
                />
                <Button
                  className="w-full"
                  variant="green"
                  disabled={busy || !upi.trim() || weeklyPremium === null}
                  onClick={() => void onCompleteNewUser()}
                >
                  Confirm & go live
                </Button>
              </Card>
            ) : null}

            {newStep === 'done' ? (
              <Card className="mt-4 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success/20 text-2xl text-success">
                  ✓
                </div>
                <p className="mt-3 text-sm text-fg">You are covered for this week.</p>
                <p className="mt-1 font-mono text-xs text-fg-muted">Ref {policyId?.slice(-8).toUpperCase() ?? 'ACTIVE'}</p>
                <Button className="mt-6 w-full" onClick={() => navigate('/dashboard')}>
                  Open dashboard
                </Button>
              </Card>
            ) : null}
          </>
        ) : null}

        {entry === 'existing' ? (
          <>
            <button type="button" className="mt-6 text-xs text-accent" onClick={resetToChoose}>
              ← Back
            </button>
            {existStep === 'login' ? (
              <Card className="mt-4 space-y-3">
                <h2 className="font-display text-base font-semibold text-fg">Sign in</h2>
                <label className="block text-xs text-fg-muted">Mobile</label>
                <input
                  className="w-full rounded-xl border border-dim-border bg-base px-3 py-2.5 font-mono text-fg outline-none focus:border-bright-border"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  inputMode="numeric"
                />
                <Button className="w-full" variant="ghost" disabled={busy || phone.length !== 10} onClick={onSendOtp}>
                  Send OTP
                </Button>
                <label className="block text-xs text-fg-muted">OTP</label>
                <input
                  className="w-full rounded-xl border border-dim-border bg-base px-3 py-2.5 font-mono text-fg outline-none focus:border-bright-border"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  inputMode="numeric"
                />
                <Button className="w-full" disabled={busy || phone.length !== 10 || otp.length !== 6} onClick={onVerifyExisting}>
                  Sign in
                </Button>
              </Card>
            ) : null}

            {existStep === 'profile' ? (
              <Card className="mt-4 space-y-4">
                <h2 className="font-display text-base font-semibold text-fg">Almost there</h2>
                <p className="text-xs text-fg-muted">We need this to pay you.</p>
                <label className="block text-xs text-fg-muted">City</label>
                <select
                  className="w-full rounded-xl border border-dim-border bg-base px-3 py-2.5 text-fg outline-none focus:border-bright-border"
                  value={city}
                  onChange={(e) => setCity(e.target.value as (typeof CITIES)[number])}
                >
                  {CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <label className="block text-xs text-fg-muted">UPI ID</label>
                <input
                  className="w-full rounded-xl border border-dim-border bg-base px-3 py-2.5 font-mono text-sm text-fg outline-none focus:border-bright-border"
                  value={upi}
                  onChange={(e) => setUpi(e.target.value)}
                />
                <Button className="w-full" disabled={busy || !upi.trim()} onClick={() => void onSaveExistingProfile()}>
                  Continue
                </Button>
              </Card>
            ) : null}

            {existStep === 'pay' ? (
              <Card className="mt-4 space-y-4">
                <h2 className="font-display text-base font-semibold text-fg">Weekly cover</h2>
                {weeklyPremium === null && !err ? (
                  <p className="text-sm text-fg-muted">Getting your price…</p>
                ) : weeklyPremium !== null ? (
                  <p className="font-display text-2xl font-bold text-accent">₹{weeklyPremium} / week</p>
                ) : null}
                <p className="text-xs text-fg-muted">Based on conditions in {city}</p>
                <Button className="w-full" variant="green" disabled={busy || weeklyPremium === null} onClick={() => void onPayExisting()}>
                  Pay with UPI (demo)
                </Button>
              </Card>
            ) : null}
          </>
        ) : null}
      </motion.div>
    </div>
  )
}
