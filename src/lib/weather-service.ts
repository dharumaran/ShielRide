/**
 * OpenWeatherMap: One Call 3.0 when subscribed, else Current Weather 2.5 (free tier).
 * Env: OPENWEATHERMAP_API_KEY (per .env.local) or OPENWEATHER_API_KEY.
 */

export type WeatherSnapshot = {
  source: "openweather" | "imd_backup" | "mock";
  rainMmPerHr: number;
  tempC: number;
  feelsLikeC: number;
  humidityPct: number;
  heatIndexC: number;
  lat: number;
  lon: number;
  city: string;
  fetchedAt: number;
};

import { heatIndexCelsius } from "./trigger-engine";

export function getOpenWeatherApiKey(): string | undefined {
  return (
    process.env.OPENWEATHERMAP_API_KEY ||
    process.env.OPENWEATHER_API_KEY ||
    undefined
  );
}

/** One Call 3.0 — requires subscription on some accounts */
async function fetchOneCall30(
  lat: number,
  lon: number,
  apiKey: string
): Promise<Partial<WeatherSnapshot> | null> {
  const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily,alerts&appid=${apiKey}&units=metric`;
  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) return null;
  const j = (await res.json()) as {
    current?: {
      temp: number;
      feels_like: number;
      humidity: number;
      rain?: { "1h"?: number };
    };
  };
  const c = j.current;
  if (!c) return null;
  const rain = c.rain?.["1h"] ?? 0;
  const hi = heatIndexCelsius(c.temp, c.humidity);
  return {
    source: "openweather",
    rainMmPerHr: rain,
    tempC: c.temp,
    feelsLikeC: c.feels_like,
    humidityPct: c.humidity,
    heatIndexC: hi,
    fetchedAt: Date.now(),
  };
}

/** Current Weather API 2.5 — works on free tier */
async function fetchCurrentWeather25(
  lat: number,
  lon: number,
  apiKey: string
): Promise<Partial<WeatherSnapshot> | null> {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) return null;
  const j = (await res.json()) as {
    main?: { temp: number; feels_like: number; humidity: number };
    rain?: { "1h"?: number };
  };
  const m = j.main;
  if (!m) return null;
  const rain = j.rain?.["1h"] ?? 0;
  const hi = heatIndexCelsius(m.temp, m.humidity);
  return {
    source: "openweather",
    rainMmPerHr: rain,
    tempC: m.temp,
    feelsLikeC: m.feels_like ?? m.temp,
    humidityPct: m.humidity,
    heatIndexC: hi,
    fetchedAt: Date.now(),
  };
}

export async function fetchOpenWeatherForCoords(params: {
  lat: number;
  lon: number;
}): Promise<Partial<WeatherSnapshot> | null> {
  const key = getOpenWeatherApiKey();
  if (!key) return null;
  const oc = await fetchOneCall30(params.lat, params.lon, key);
  if (oc?.tempC !== undefined) return oc;
  return fetchCurrentWeather25(params.lat, params.lon, key);
}

/** IMD backup — poll every 15 min; mock when not integrated */
export async function fetchImdBackupMock(): Promise<Partial<WeatherSnapshot>> {
  return {
    source: "imd_backup",
    rainMmPerHr: 12 + Math.random() * 8,
    fetchedAt: Date.now(),
  };
}

export function mockChennaiWeather(): WeatherSnapshot {
  const tempC = 32;
  const humidityPct = 78;
  const hi = heatIndexCelsius(tempC, humidityPct);
  return {
    source: "mock",
    rainMmPerHr: 28,
    tempC,
    feelsLikeC: 36,
    humidityPct,
    heatIndexC: hi,
    lat: 13.0827,
    lon: 80.2707,
    city: "Chennai",
    fetchedAt: Date.now(),
  };
}

export async function getWeatherForCity(city: string): Promise<WeatherSnapshot> {
  const coords: Record<string, { lat: number; lon: number }> = {
    Chennai: { lat: 13.0827, lon: 80.2707 },
    Mumbai: { lat: 19.076, lon: 72.8777 },
    Delhi: { lat: 28.6139, lon: 77.209 },
    Bengaluru: { lat: 12.9716, lon: 77.5946 },
  };
  const c = coords[city] ?? coords.Chennai;
  const ow = await fetchOpenWeatherForCoords({ lat: c.lat, lon: c.lon });
  if (ow?.rainMmPerHr !== undefined && ow.tempC !== undefined) {
    return {
      source: ow.source as WeatherSnapshot["source"],
      rainMmPerHr: ow.rainMmPerHr,
      tempC: ow.tempC,
      feelsLikeC: ow.feelsLikeC ?? ow.tempC,
      humidityPct: ow.humidityPct ?? 70,
      heatIndexC:
        ow.heatIndexC ?? heatIndexCelsius(ow.tempC, ow.humidityPct ?? 70),
      lat: c.lat,
      lon: c.lon,
      city,
      fetchedAt: ow.fetchedAt ?? Date.now(),
    };
  }
  const base = mockChennaiWeather();
  return { ...base, lat: c.lat, lon: c.lon, city };
}
