// =======================================================
// src/routes/order.js
// Menyimpan pesanan ke Cloudflare D1
// Endpoint : POST /api/order
// =======================================================

export async function createOrder(request, env) {
  try {

    const body = await request.json();

    const { customer, items, total } = body;

    // ===============================
    // Validasi Data
    // ===============================
    if (!customer) {
      return jsonResponse({
        success: false,
        message: "Data customer tidak ditemukan."
      }, 400);
    }

    if (!customer.nama || customer.nama.trim() === "") {
      return jsonResponse({
        success: false,
        message: "Nama pelanggan wajib diisi."
      }, 400);
    }

    if (!customer.telepon || customer.telepon.trim() === "") {
      return jsonResponse({
        success: false,
        message: "Nomor WhatsApp wajib diisi."
      }, 400);
    }

    if (!Array.isArray(items) || items.length === 0) {
      return jsonResponse({
        success: false,
        message: "Keranjang masih kosong."
      }, 400);
    }

    // ===============================
    // Generate Order ID
    // ===============================
    const orderId =
      "JWN-" +
      crypto.randomUUID()
        .replace(/-/g, "")
        .substring(0, 8)
        .toUpperCase();

    const createdAt = new Date().toISOString();

    // ===============================
    // Simpan ke Database D1
    // ===============================
    await env.DB.prepare(`
      INSERT INTO orders (
        order_id,
        customer_name,
        customer_phone,
        items,
        total,
        status,
        created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
      .bind(
        orderId,
        customer.nama,
        customer.telepon,
        JSON.stringify(items),
        total,
        "Menunggu",
        createdAt
      )
      .run();

    // ===============================
    // Response Berhasil
    // ===============================
    return jsonResponse({
      success: true,
      message: "Pesanan berhasil dibuat.",
      orderId: orderId
    }, 201);

  } catch (error) {

    return jsonResponse({
      success: false,
      message: "Terjadi kesalahan pada server.",
      error: error.message
    }, 500);

  }
}

// ==================================
// Helper Response JSON
// ==================================

function jsonResponse(data, status = 200) {
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    }
  );
}
