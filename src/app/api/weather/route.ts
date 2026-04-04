import { NextResponse } from "next/server";
import { getWeatherForCity } from "@/lib/weather-service";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city") ?? "Chennai";
  const w = await getWeatherForCity(city);
  return NextResponse.json(w);
}
