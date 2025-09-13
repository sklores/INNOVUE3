// src/lib/color.ts
// Full pastel spectrum (11 stops) from red -> orange -> yellow -> mint -> green -> teal.
// We interpolate in OKLab-ish space using simple per-channel lerp in sRGB (good enough for UI).
// Returns CSS hsl() strings for smooth rendering.

type Stop = { r: number; g: number; b: number };

function hexToRgb(hex: string): Stop {
  const h = hex.replace("#", "");
  const n = parseInt(h, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}
function rgbToHsl({ r, g, b }: Stop): string {
  // sRGB [0,255] -> HSL string
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0; const l = (max + min) / 2;
  const d = max - min;
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      default: h = (r - g) / d + 4; break;
    }
    h *= 60;
  }
  // pastel-ish tweak: clamp saturation/lightness into comfortable ranges
  const hh = Math.round(h);
  const ss = Math.round(Math.min(0.70, Math.max(0.36, s)) * 100);
  const ll = Math.round(Math.min(0.80, Math.max(0.52, l)) * 100);
  return `hsl(${hh} ${ss}% ${ll}%)`;
}

// 11-stop pastel palette (soft, readable on neutral tile backgrounds)
const STOPS_HEX = [
  "#F47B7B", // soft red
  "#F79A78", // peach
  "#F7B36E", // light orange
  "#F6C869", // warm yellow
  "#F3DB78", // pale gold
  "#DBEEA6", // spring
  "#BEEFC0", // mint
  "#9BE8C9", // seafoam
  "#7EDFCC", // aqua mint
  "#65D3C9", // light teal
  "#57C2BB"  // teal/green
];
const STOPS: Stop[] = STOPS_HEX.map(hexToRgb);

// Clamp + lerp helpers
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Interpolate the 11-stop palette
export function spectrumColor(ratio: number): string {
  const t = clamp01(ratio);
  if (STOPS.length === 1) return rgbToHsl(STOPS[0]);
  const seg = (STOPS.length - 1) * t;
  const i = Math.floor(seg);
  const f = seg - i;
  const a = STOPS[i];
  const b = STOPS[Math.min(i + 1, STOPS.length - 1)];
  const mixed: Stop = {
    r: Math.round(lerp(a.r, b.r, f)),
    g: Math.round(lerp(a.g, b.g, f)),
    b: Math.round(lerp(a.b, b.b, f)),
  };
  return rgbToHsl(mixed);
}

// Map a value to a color given a target.
// For higher-is-better metrics.
export function valueToColorUp(value: number, target: number): string {
  const t = target > 0 ? clamp01(value / target) : 0;
  return spectrumColor(t);
}

// For lower-is-better metrics (COGS, Labor, A/P).
export function valueToColorDown(value: number, target: number): string {
  const t = target > 0 ? clamp01(1 - value / target) : 0; // invert
  return spectrumColor(t);
}