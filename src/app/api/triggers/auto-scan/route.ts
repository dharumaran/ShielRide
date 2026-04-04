import { NextResponse } from "next/server";
import { getWeatherForCity } from "@/lib/weather-service";
import { heatIndexCelsius } from "@/lib/trigger-engine";
import { logTriggerEvaluations } from "@/lib/db-queries";

const TH_RAIN = 35;
const TH_HEAT = 42;
const TH_AQI = 300;

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const city = String(body.city ?? "Chennai");
  const w = await getWeatherForCity(city);
  const rainPct = Math.min(100, (w.rainMmPerHr / TH_RAIN) * 100);
  const heatMetric = Math.max(w.feelsLikeC, w.heatIndexC ?? heatIndexCelsius(w.tempC, w.humidityPct));
  const heatPct = Math.min(100, (heatMetric / TH_HEAT) * 100);
  const aqiMock = city === "Chennai" ? 180 : 220;
  const aqiPct = Math.min(100, (aqiMock / TH_AQI) * 100);
  const outageMin = 45;
  const outagePct = Math.min(100, (outageMin / 90) * 100);
  const cancelRate = 0.32;
  const demandPct = Math.min(100, (cancelRate / 0.45) * 100);

  const triggers = [
    {
      type: "RAINFALL",
      current: w.rainMmPerHr,
      threshold: TH_RAIN,
      unit: " mm/hr",
      pct: rainPct,
      source: w.source === "openweather" ? "OpenWeatherMap Live" : "IMD Backup / Mock",
    },
    {
      type: "HEAT",
      current: heatMetric,
      threshold: TH_HEAT,
      unit: "°C index",
      pct: heatPct,
      source: "OpenWeatherMap feels_like / HI",
    },
    {
      type: "AQI",
      current: aqiMock,
      threshold: TH_AQI,
      unit: " AQI",
      pct: aqiPct,
      source: "CPCB Mock",
    },
    {
      type: "OUTAGE",
      current: outageMin,
      threshold: 90,
      unit: " min",
      pct: outagePct,
      source: "Platform + Downdetector mock",
    },
    {
      type: "DEMAND_COLLAPSE",
      current: Math.round(cancelRate * 100),
      threshold: 45,
      unit: "% canc.",
      pct: demandPct,
      source: "Platform order feed (simulated)",
      moat: true,
    },
  ];

  void logTriggerEvaluations(
    triggers.map((t) => ({
      city,
      trigger_type: t.type,
      current_value: t.current,
      threshold: t.threshold,
      pct_to_trigger: t.pct,
      outcome: t.pct >= 100 ? "FIRED" : "NOT_FIRED",
      payload: {
        source: "source" in t ? (t as { source?: string }).source : undefined,
        weather: { source: w.source, rain: w.rainMmPerHr },
      },
    }))
  );

  return NextResponse.json({ city, evaluatedAt: Date.now(), weather: w, triggers });
}
