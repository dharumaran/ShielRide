import type { ApiEnvelope } from '@shieldride/shared'

export type { ApiEnvelope }

export type SensorLatest = {
  id: string
  city: string
  pincode: string | null
  rainfallMmHr: number
  heatIndexC: number
  aqiScore: number
  cancelRatePct: number
  platformStatus: string
  orderDensity: number
  source: string
  recordedAt: string
}

export type WorkerProfile = {
  id: string
  name: string
  city: string
  platform: string
  status: string
  phone: string
  email: string | null
  upiHandle: string
  pincode: string
  baselineIncomePaise: number
  policies: Array<{
    id: string
    premiumAmountPaise: number
    riskScore: number
    status: string
    premiumPaidAt: string | null
  }>
}

export type PayoutRow = {
  id: string
  triggerType: string
  payoutAmountPaise: number
  status: string
  createdAt: string
  fraudScore: number
}

export type IncomeDay = { day: string; incomePaise: number }
