// GET /api/health - Cek Status Backend & Koneksi SQLite (Cloudflare D1)

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json"
};

export async function onRequestOptions() {
  return new Response(null, { headers: corsHeaders, status: 204 });
}

export async function onRequestGet(context) {
  const { env } = context;
  let dbStatus = "not_bound";
  let userCount = 0;

  if (env && env.DB) {
    try {
      const countRes = await env.DB.prepare("SELECT COUNT(*) as total FROM users").first();
      userCount = countRes ? countRes.total : 0;
      dbStatus = "connected";
    } catch (err) {
      dbStatus = "error: " + err.message;
    }
  }

  return new Response(
    JSON.stringify({
      status: "ok",
      service: "LAW Study API",
      database: "Cloudflare D1 (SQLite)",
      dbStatus: dbStatus,
      totalUsers: userCount,
      timestamp: new Date().toISOString()
    }),
    { status: 200, headers: corsHeaders }
  );
}
