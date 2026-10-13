// POST /api/register - Registrasi Pengguna Baru ke SQLite (Cloudflare D1)

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json"
};

export async function onRequestOptions() {
  return new Response(null, { headers: corsHeaders, status: 204 });
}

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();
    const name = (body.name || "").trim();
    const email = (body.email || "").trim().toLowerCase();
    const password = (body.password || "").trim();
    const points = parseInt(body.points) || 0;

    if (!name || !email || !password) {
      return new Response(
        JSON.stringify({ success: false, message: "Nama, email, dan password wajib diisi!" }),
        { status: 400, headers: corsHeaders }
      );
    }

    if (!env.DB) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Database D1 belum dihubungkan. Pastikan binding DB sudah disetel di Cloudflare Pages."
        }),
        { status: 500, headers: corsHeaders }
      );
    }

    // Periksa apakah email sudah terdaftar
    const existing = await env.DB.prepare(
      "SELECT id FROM users WHERE LOWER(email) = LOWER(?)"
    ).bind(email).first();

    if (existing) {
      return new Response(
        JSON.stringify({ success: false, message: "Email sudah terdaftar! Silakan login." }),
        { status: 409, headers: corsHeaders }
      );
    }

    const id = "USER_" + Date.now();

    // Masukkan data ke SQLite
    await env.DB.prepare(
      "INSERT INTO users (id, name, email, password, points, created_at, last_login) VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))"
    ).bind(id, name, email, password, points).run();

    return new Response(
      JSON.stringify({
        success: true,
        message: `Pendaftaran berhasil! Selamat datang, ${name} 🎉`,
        user: { id, name, email, points }
      }),
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: "Terjadi error di server: " + error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
}
