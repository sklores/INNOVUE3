// Open-Meteo current weather client (no API key needed).
// Falls back gracefully on any error.

export type Weather = {
    tempC: number | null;     // temperature °C
    condition: string;        // human label, e.g., "Cloudy"
    code: number | null;      // WMO weather_code
    isDay: boolean | null;    // 1 = day, 0 = night
    updated: number;          // epoch ms
  };
  
  type FetchOpts = {
    latitude?: number;
    longitude?: number;
    // If you want °F instead, set "unit" to "fahrenheit"
    unit?: "celsius" | "fahrenheit";
  };
  
  // Simple WMO → label table (trimmed to common cases)
  const WMO: Record<number, string> = {
    0: "Clear",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Cloudy",
    45: "Fog",
    48: "Depositing rime",
    51: "Drizzle",
    53: "Drizzle",
    55: "Drizzle",
    61: "Rain",
    63: "Rain",
    65: "Rain",
    71: "Snow",
    73: "Snow",
    75: "Snow",
    80: "Showers",
    81: "Showers",
    82: "Showers",
    95: "Thunderstorm",
    96: "Thunderstorm",
    99: "Thunderstorm",
  };
  
  const DEFAULT_LAT = 38.9072;   // Washington, DC
  const DEFAULT_LON = -77.0369;
  
  export async function fetchWeather(opts: FetchOpts = {}): Promise<Weather> {
    const lat = Number.isFinite(opts.latitude) ? Number(opts.latitude) : DEFAULT_LAT;
    const lon = Number.isFinite(opts.longitude) ? Number(opts.longitude) : DEFAULT_LON;
    const unit = opts.unit === "fahrenheit" ? "fahrenheit" : "celsius";
  
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,weather_code,is_day` +
      `&temperature_unit=${unit === "fahrenheit" ? "fahrenheit" : "celsius"}`;
  
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const json = await res.json();
  
      const code = Number(json?.current?.weather_code ?? null);
      const isDay = json?.current?.is_day ?? null;
      const t = json?.current?.temperature_2m;
      const tempC =
        unit === "fahrenheit"
          ? // If °F requested, convert back to C for a consistent internal field (optional)
            Math.round(((Number(t) - 32) * 5) / 9 * 10) / 10
          : Number.isFinite(Number(t))
          ? Number(t)
          : null;
  
      return {
        tempC: Number.isFinite(tempC as number) ? (tempC as number) : null,
        condition: code in WMO ? WMO[code] : "—",
        code: Number.isFinite(code) ? code : null,
        isDay: isDay === 1 ? true : isDay === 0 ? false : null,
        updated: Date.now(),
      };
    } catch (e) {
      console.error("open-meteo fetch failed:", e);
      return {
        tempC: null,
        condition: "—",
        code: null,
        isDay: null,
        updated: Date.now(),
      };
    }
  }