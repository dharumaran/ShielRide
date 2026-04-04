import type { PlatformStatus } from '@shieldride/shared'

const OW_GEO = 'https://api.openweathermap.org/geo/1.0/direct'
const OW_WEATHER = 'https://api.openweathermap.org/data/2.5/weather'
const OW_AIR = 'https://api.openweathermap.org/data/2.5/air_pollution'

export type OpenWeatherSnapshot = {
  rainfallMmHr: number
  heatIndexC: number
  aqiScore: number
  cancelRatePct: number
  platformStatus: PlatformStatus
  orderDensity: number
}

function pm25ToAqi(pm25: number): number {
  if (!Number.isFinite(pm25) || pm25 < 0) return 0
  const segments: [number, number, number, number][] = [
    [0, 12, 0, 50],
    [12.1, 35.4, 51, 100],
    [35.5, 55.4, 101, 150],
    [55.5, 150.4, 151, 200],
    [150.5, 250.4, 201, 300],
    [250.5, 350.4, 301, 400],
    [350.5, 500.4, 401, 500],
  ]
  for (const [cLo, cHi, iLo, iHi] of segments) {
    if (pm25 <= cHi) {
      const aqi = ((iHi - iLo) / (cHi - cLo)) * (pm25 - cLo) + iLo
      return Math.round(Math.min(500, Math.max(0, aqi)))
    }
  }
  return 500
}

/** OpenWeather `main.aqi`: 1 good … 5 hazardous — rough PM2.5-ish fallback when components missing */
function owMainAqiToScore(mainAqi: number): number {
  const map: Record<number, number> = { 1: 45, 2: 95, 3: 145, 4: 220, 5: 380 }
  return map[mainAqi] ?? 120
}

function geocodeQuery(city: string): string {
  const t = city.trim()
  if (!t) return 'Mumbai,IN'
  if (/,[a-zA-Z]{2}\s*$/.test(t)) return t
  return `${t},IN`
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`OpenWeather HTTP ${res.status}: ${text.slice(0, 200)}`)
  }
  return res.json() as Promise<T>
}

type GeoHit = { lat: number; lon: number; name: string; country: string }
type WeatherRes = {
  rain?: { '1h'?: number; '3h'?: number }
  snow?: { '1h'?: number; '3h'?: number }
  main: { feels_like: number; temp: number; humidity: number }
  weather?: { main: string }[]
}
type AirRes = {
  list: {
    main: { aqi: number }
    components: { pm2_5: number; pm10: number }
  }[]
}

function rainfallFromWeather(w: WeatherRes): number {
  const r1 = w.rain?.['1h']
  const r3 = w.rain?.['3h']
  const s1 = w.snow?.['1h']
  const s3 = w.snow?.['3h']
  let mm = 0
  if (typeof r1 === 'number') mm += r1
  else if (typeof r3 === 'number') mm += r3 / 3
  if (typeof s1 === 'number') mm += s1 * 0.1
  else if (typeof s3 === 'number') mm += (s3 * 0.1) / 3
  return Math.round(mm * 10) / 10
}

function demandHeuristics(rainfallMmHr: number, heatIndexC: number, aqi: number): {
  cancelRatePct: number
  orderDensity: number
  platformStatus: PlatformStatus
} {
  let cancel = 11 + rainfallMmHr * 0.35 + Math.max(0, heatIndexC - 36) * 1.1 + Math.max(0, aqi - 150) * 0.02
  cancel = Math.min(48, Math.max(4, Math.round(cancel * 10) / 10))
  const density = Math.min(12, Math.max(2, 8.2 - rainfallMmHr * 0.06 - Math.max(0, aqi - 200) * 0.01))
  let platformStatus: PlatformStatus = 'online'
  if (rainfallMmHr > 55 || heatIndexC > 44 || aqi > 320) platformStatus = 'degraded'
  return { cancelRatePct: cancel, orderDensity: Math.round(density * 10) / 10, platformStatus }
}

/**
 * Live weather + air quality from OpenWeather (same API key for Current Weather and Air Pollution).
 */
export async function fetchOpenWeatherSnapshot(city: string, apiKey: string): Promise<OpenWeatherSnapshot> {
  const q = geocodeQuery(city)
  const geoUrl = `${OW_GEO}?q=${encodeURIComponent(q)}&limit=1&appid=${apiKey}`
  const geo = await fetchJson<GeoHit[]>(geoUrl)
  const hit = geo[0]
  if (!hit) {
    throw new Error(`OpenWeather: no coordinates for "${q}"`)
  }

  const lat = hit.lat
  const lon = hit.lon
  const weatherUrl = `${OW_WEATHER}?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
  const airUrl = `${OW_AIR}?lat=${lat}&lon=${lon}&appid=${apiKey}`

  const [w, air] = await Promise.all([fetchJson<WeatherRes>(weatherUrl), fetchJson<AirRes>(airUrl)])

  const rainfallMmHr = rainfallFromWeather(w)
  const heatIndexC = Math.round(w.main.feels_like * 10) / 10

  const comp = air.list[0]?.components
  const mainAqi = air.list[0]?.main?.aqi
  let aqiScore = 75
  if (comp && typeof comp.pm2_5 === 'number' && comp.pm2_5 >= 0) {
    aqiScore = pm25ToAqi(comp.pm2_5)
  } else if (typeof mainAqi === 'number') {
    aqiScore = owMainAqiToScore(mainAqi)
  }

  const { cancelRatePct, orderDensity, platformStatus } = demandHeuristics(rainfallMmHr, heatIndexC, aqiScore)

  return {
    rainfallMmHr,
    heatIndexC,
    aqiScore,
    cancelRatePct,
    platformStatus,
    orderDensity,
  }
}
