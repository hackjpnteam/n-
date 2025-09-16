"use client";

import { useEffect, useState } from "react";

type Member = { _id: string; name?: string };

async function fetchJSON(input: RequestInfo, init?: RequestInit) {
  const res = await fetch(input, {
    credentials: "include",
    cache: "no-store",
    ...init,
  });
  const ct = res.headers.get("content-type") || "";
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${res.statusText} | ${text.slice(0,120)}`);
  }
  if (!ct.includes("application/json")) {
    const text = await res.text().catch(() => "");
    throw new Error(`Expected JSON but got ${ct}. Body: ${text.slice(0,120)}`);
  }
  return res.json();
}

export default function MembersPage() {
  const [data, setData] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchJSON("/api/members")
      .then((r) => setData(r.items ?? []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{whiteSpace: "pre-wrap"}}>Error: {error}</div>;
  if (!data.length) return <div>データがありません（未ログイン/権限不足の可能性）</div>;
  return (
    <ul>{data.map((m) => <li key={m._id}>{m.name ?? m._id}</li>)}</ul>
  );
}