// POST /api/sync - Sinkronisasi Poin Pengguna ke SQLite (Cloudflare D1)

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
    const email = (body.email || "").trim().toLowerCase();
    const points = parseInt(body.points) || 0;

    if (!email) {
      return new Response(
        JSON.stringify({ success: false, message: "Email tidak valid untuk sinkronisasi." }),
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

    // Update poin di SQLite D1
    const result = await env.DB.prepare(
      "UPDATE users SET points = ? WHERE LOWER(email) = LOWER(?)"
    ).bind(points, email).run();

    if (result.meta && result.meta.changes === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "User tidak ditemukan." }),
        { status: 404, headers: corsHeaders }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Poin berhasil disinkronkan ke database SQLite!",
        points
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

