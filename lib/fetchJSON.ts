export async function fetchJSON(input: RequestInfo, init?: RequestInit) {
  const res = await fetch(input, { credentials: "include", cache: "no-store", ...init });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${res.statusText} | ${text.slice(0,120)}`);
  }
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    const text = await res.text().catch(() => "");
    throw new Error(`Expected JSON but got ${ct}. Body: ${text.slice(0,120)}`);
  }
  return res.json();
}