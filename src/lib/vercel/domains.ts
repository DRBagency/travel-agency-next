const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID;
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID;

const BASE_URL = "https://api.vercel.com";

function headers() {
  return {
    Authorization: `Bearer ${VERCEL_TOKEN}`,
    "Content-Type": "application/json",
  };
}

function teamQuery() {
  return VERCEL_TEAM_ID ? `?teamId=${VERCEL_TEAM_ID}` : "";
}

export async function addDomainToVercel(domain: string) {
  if (!VERCEL_TOKEN || !VERCEL_PROJECT_ID) {
    console.error("[Vercel] Missing VERCEL_TOKEN or VERCEL_PROJECT_ID");
    return { added: false, error: "missing_config" };
  }

  const res = await fetch(
    `${BASE_URL}/v10/projects/${VERCEL_PROJECT_ID}/domains${teamQuery()}`,
    {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ name: domain }),
    }
  );

  const data = await res.json();

  // Domain already exists on this project — not an error
  if (res.status === 409) {
    return { added: true, verified: data.verified ?? false, verification: data.verification ?? [] };
  }

  if (!res.ok) {
    console.error("[Vercel] Add domain error:", data);
    return { added: false, error: data.error?.code ?? "unknown", message: data.error?.message };
  }

  return {
    added: true,
    verified: data.verified ?? false,
    verification: data.verification ?? [],
  };
}

export async function verifyDomainOnVercel(domain: string) {
  if (!VERCEL_TOKEN || !VERCEL_PROJECT_ID) {
    return { verified: false, error: "missing_config" };
  }

  const res = await fetch(
    `${BASE_URL}/v9/projects/${VERCEL_PROJECT_ID}/domains/${domain}/verify${teamQuery()}`,
    {
      method: "POST",
      headers: headers(),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    console.error("[Vercel] Verify domain error:", data);
    return { verified: false, error: data.error?.code ?? "unknown" };
  }

  return { verified: data.verified ?? false, verification: data.verification ?? [] };
}

export async function removeDomainFromVercel(domain: string) {
  if (!VERCEL_TOKEN || !VERCEL_PROJECT_ID) {
    return { removed: false, error: "missing_config" };
  }

  const res = await fetch(
    `${BASE_URL}/v9/projects/${VERCEL_PROJECT_ID}/domains/${domain}${teamQuery()}`,
    {
      method: "DELETE",
      headers: headers(),
    }
  );

  if (res.status === 404) {
    // Domain not found — already removed, that's fine
    return { removed: true };
  }

  if (!res.ok) {
    const data = await res.json();
    console.error("[Vercel] Remove domain error:", data);
    return { removed: false, error: data.error?.code ?? "unknown" };
  }

  return { removed: true };
}

export async function getDomainFromVercel(domain: string) {
  if (!VERCEL_TOKEN || !VERCEL_PROJECT_ID) {
    return null;
  }

  const res = await fetch(
    `${BASE_URL}/v9/projects/${VERCEL_PROJECT_ID}/domains/${domain}${teamQuery()}`,
    {
      method: "GET",
      headers: headers(),
    }
  );

  if (!res.ok) return null;
  return res.json();
}
