export async function fetchJSON(input: RequestInfo, init?: RequestInit) {
  const res = await fetch(input, { credentials: "include", cache: "no-store", ...init });
  const ct = res.headers.get("content-type") || "";
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${res.statusText} | CT=${ct} | Body=${text.slice(0,200)}`);
  }
  if (!ct.includes("application/json")) {
    const text = await res.text().catch(() => "");
    throw new Error(`Expected JSON but got ${ct} | Body=${text.slice(0,200)}`);
  }
  return res.json();
}