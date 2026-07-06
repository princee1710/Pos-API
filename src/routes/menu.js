// =======================================================
// src/routes/menu.js
// Mengambil daftar menu dari Cloudflare D1
// Endpoint : GET /api/menu
// =======================================================

export async function getMenu(env) {
  try {

    // Mengambil seluruh data menu
    const { results } = await env.DB
      .prepare(`
        SELECT
          id,
          name,
          description,
          price,
          category,
          icon
        FROM menu
        ORDER BY id ASC
      `)
      .all();

    return new Response(
      JSON.stringify({
        success: true,
        items: results,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );

  } catch (error) {

    return new Response(
      JSON.stringify({
        success: false,
        message: "Gagal mengambil data menu.",
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );

  }
}
