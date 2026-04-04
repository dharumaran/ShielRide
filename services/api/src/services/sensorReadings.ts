import { prisma } from '../db.js'
import { fetchOpenWeatherSnapshot } from './openWeatherSensor.js'
import { getMockSensor } from './sensorMock.js'

export type ResolvedSensorReading = {
  id: string
  city: string
  pincode: string | null
  rainfallMmHr: number
  heatIndexC: number
  aqiScore: number
  cancelRatePct: number
  platformStatus: string
  orderDensity: number
  source: 'openweather' | 'cpcb' | 'platform'
  recordedAt: string
}

function openWeatherKey(): string | undefined {
  const k = process.env['OPENWEATHER_API_KEY']?.trim()
  return k || undefined
}

/**
 * Prefer live OpenWeather when `OPENWEATHER_API_KEY` is set (weather + air pollution).
 * Otherwise latest DB row, then deterministic mock drift.
 */
export async function resolveLatestSensorReading(city: string): Promise<ResolvedSensorReading> {
  const key = openWeatherKey()
  if (key) {
    try {
      const live = await fetchOpenWeatherSnapshot(city, key)
      return {
        id: `openweather-${Date.now()}`,
        city: city.trim() || 'Mumbai',
        pincode: null,
        ...live,
        source: 'openweather',
        recordedAt: new Date().toISOString(),
      }
    } catch (err) {
      console.error('[shieldride] OpenWeather failed, falling back to DB/mock:', err)
    }
  }

  const latest = await prisma.sensorReading.findFirst({
    where: { city },
    orderBy: { recordedAt: 'desc' },
    select: {
      id: true,
      city: true,
      pincode: true,
      rainfallMmHr: true,
      heatIndexC: true,
      aqiScore: true,
      cancelRatePct: true,
      platformStatus: true,
      orderDensity: true,
      source: true,
      recordedAt: true,
    },
  })

  if (latest) {
    return {
      ...latest,
      pincode: latest.pincode,
      source: latest.source as ResolvedSensorReading['source'],
      recordedAt: latest.recordedAt.toISOString(),
    }
  }

  const mock = getMockSensor(city)
  return {
    id: 'mock',
    city: city.trim() || 'Mumbai',
    pincode: null,
    ...mock,
    source: 'platform',
    recordedAt: new Date().toISOString(),
  }
}

