// =====================================================================
// functions/api/order.js
// Menyimpan pesanan ke Cloudflare D1
// Endpoint: POST /api/order
// =====================================================================

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();

    const { customer, items, total } = body;

    if (!customer || !customer.nama || !customer.telepon) {
      return jsonResponse(
        {
          message: "Nama dan nomor WhatsApp wajib diisi.",
        },
        400
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return jsonResponse(
        {
          message: "Keranjang tidak boleh kosong.",
        },
        400
      );
    }

    const orderId =
      "JWN-" +
      crypto.randomUUID().replace(/-/g, "").substring(0, 6).toUpperCase();

    const createdAt = new Date().toISOString();

    await context.env.DB.prepare(`
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
        "diterima",
        createdAt
      )
      .run();

    return jsonResponse(
      {
        success: true,
        message: "Pesanan berhasil diterima.",
        orderId,
      },
      201
    );
  } catch (err) {
    return jsonResponse(
      {
        success: false,
        message: err.message,
      },
      500
    );
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
