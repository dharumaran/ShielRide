import type { RiskScoreResult, TriggerActive } from '@shieldride/shared'
import axios, { type AxiosError, type AxiosResponse } from 'axios'
import type { ApiEnvelope, IncomeDay, PayoutRow, SensorLatest, WorkerProfile } from '@/types'
import { useWorkerStore } from '@/stores/workerStore'

// If VITE_API_URL is set, use it in dev and prod (works even when Vite’s /api proxy isn’t used).
// If unset in dev, use same-origin `/api` so Vite can proxy (good for phone-on-LAN: open http://<PC-IP>:5173).
const envApi = import.meta.env.VITE_API_URL?.trim() ?? ''
const baseURL = envApi !== '' ? envApi : import.meta.env.DEV ? '' : ''

export const api = axios.create({
  baseURL,
  timeout: 25_000,
  // Our API returns JSON envelopes for 4xx/5xx; parse them instead of Axios' generic "status code 404".
  validateStatus: () => true,
})

api.interceptors.request.use((config) => {
  const token = useWorkerStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

function isEnvelope(x: unknown): x is ApiEnvelope<unknown> {
  return (
    typeof x === 'object' &&
    x !== null &&
    'data' in x &&
    'error' in x &&
    'meta' in x
  )
}

export async function unwrap<T>(p: Promise<AxiosResponse<unknown>>): Promise<T> {
  try {
    const res = await p
    const body = res.data

    if (isEnvelope(body)) {
      if (body.error) {
        throw new Error(body.error.message)
      }
      if (body.data === null) {
        throw new Error('Empty response')
      }
      return body.data as T
    }

    if (res.status === 404) {
      throw new Error(
        'API route not found. Use `npm run dev` in apps/web (proxies /api → port 3001), or `vite preview` with the same proxy — not a static file server alone.',
      )
    }
    throw new Error(`Request failed (${res.status})`)
  } catch (e) {
    const ax = e as AxiosError<ApiEnvelope<unknown>>
    if (ax.response?.data && isEnvelope(ax.response.data) && ax.response.data.error) {
      throw new Error(ax.response.data.error.message)
    }
    if (ax.code === 'ERR_NETWORK' || ax.message === 'Network Error') {
      throw new Error(
        'Cannot reach API. Start the backend (port 3001), keep `npm run dev` for the web app, and use the Vite /api proxy in development.',
      )
    }
    throw e
  }
}

export const sensorsApi = {
  latest: (city: string) => unwrap<SensorLatest>(api.get(`/api/sensors/latest?city=${encodeURIComponent(city)}`)),
  risk: (city: string) => unwrap<RiskScoreResult>(api.get(`/api/sensors/risk?city=${encodeURIComponent(city)}`)),
  triggers: (city: string) =>
    unwrap<TriggerActive[]>(api.get(`/api/sensors/triggers?city=${encodeURIComponent(city)}`)),
}

export type VerifyOtpData = {
  token: string
  worker: {
    id: string
    name: string
    city: string
    platform: string
    phone: string
    upiHandle: string
    email: string | null
  } | null
}

export const authApi = {
  sendOtp: (phone: string) => unwrap(api.post('/api/auth/send-otp', { phone })),
  verifyOtp: (phone: string, otp: string) =>
    unwrap<VerifyOtpData>(api.post('/api/auth/verify-otp', { phone, otp })),
}

export const premiumApi = {
  calculate: (city: string) =>
    unwrap<{ weeklyPremiumRupees: number; city: string }>(api.post('/api/premium/calculate', { city })),
}

export const workersApi = {
  get: (id: string) => unwrap<WorkerProfile>(api.get(`/api/workers/${id}`)),
  create: (body: {
    phone: string
    name: string
    city: string
    email?: string
    pincode?: string
    platform?: 'zepto' | 'blinkit' | 'swiggy'
    upiHandle: string
    aadhaarLast4?: string
    baselineIncomeRupees?: number
    deviceFingerprint?: string
  }) =>
    unwrap<{ id: string; name: string; city: string; platform: string; phone: string; email?: string | null; upiHandle?: string }>(
      api.post('/api/workers', body),
    ),
  update: (
    id: string,
    body: Partial<{
      name: string
      city: string
      pincode: string
      upiHandle: string
      email: string
      platform: 'zepto' | 'blinkit' | 'swiggy'
    }>,
  ) =>
    unwrap<{ id: string; name: string; city: string; platform: string; upiHandle: string; email?: string | null; pincode?: string }>(
      api.put(`/api/workers/${id}`, body),
    ),
  income: (id: string) => unwrap<IncomeDay[]>(api.get(`/api/workers/${id}/income`)),
}

export const policiesApi = {
  create: (workerId: string, weekStartIso: string) =>
    unwrap<{ id: string; premiumAmountPaise: number; riskScore: number; status: string; weekStart: string; weekEnd: string }>(
      api.post('/api/policies', { workerId, weekStart: weekStartIso }),
    ),
  pay: (policyId: string, upiRef: string) =>
    unwrap<{ id: string; premiumPaidAt: string | null; status: string; upiRef: string }>(
      api.post(`/api/policies/${policyId}/pay`, { upiRef }),
    ),
}

export const payoutsApi = {
  list: (workerId: string) =>
    unwrap<PayoutRow[]>(api.get(`/api/payouts?workerId=${encodeURIComponent(workerId)}`)),
}
