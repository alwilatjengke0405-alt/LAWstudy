// POST /api/login - Login Pengguna menggunakan SQLite (Cloudflare D1)

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
    const emailOrName = (body.email || "").trim().toLowerCase();
    const password = (body.password || "").trim();

    if (!emailOrName || !password) {
      return new Response(
        JSON.stringify({ success: false, message: "Email dan password wajib diisi!" }),
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

    // Cari pengguna di SQLite D1
    const user = await env.DB.prepare(
      "SELECT id, name, email, points FROM users WHERE (LOWER(email) = LOWER(?) OR LOWER(name) = LOWER(?)) AND password = ?"
    ).bind(emailOrName, emailOrName, password).first();

    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: "Email atau password salah!" }),
        { status: 401, headers: corsHeaders }
      );
    }

    // Update waktu login terakhir
    await env.DB.prepare(
      "UPDATE users SET last_login = datetime('now') WHERE id = ?"
    ).bind(user.id).run();

    return new Response(
      JSON.stringify({
        success: true,
        message: `Login berhasil! Halo, ${user.name} 👋`,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          points: user.points || 0
        }
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: "Terjadi error di server: " + error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
}

