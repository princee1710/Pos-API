// =====================================================================
// functions/api/order.js
// Endpoint ini menerima pesanan dari frontend.
// Bisa diakses lewat: POST /api/order
//
// CATATAN UNTUK PEMULA:
// Cloudflare Pages Functions bersifat "tanpa server" (serverless) dan
// TIDAK punya penyimpanan permanen bawaan. Di kode ini, pesanan hanya
// divalidasi lalu dikembalikan sebagai konfirmasi (dengan kode unik).
//
// Kalau nanti kamu mau pesanan benar-benar TERSIMPAN (misalnya supaya
// bisa dilihat di dashboard admin), kamu tinggal tambahkan Cloudflare
// KV atau Cloudflare D1 (database gratis dari Cloudflare). Ini dijelaskan
// di README.md bagian "Langkah Lanjutan".
// =====================================================================

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const { customer, items, total } = body;

    // Validasi sederhana
    if (!customer || !customer.nama || !customer.telepon) {
      return jsonResponse(
        { message: "Nama dan nomor WhatsApp wajib diisi." },
        400
      );
    }
    if (!Array.isArray(items) || items.length === 0) {
      return jsonResponse(
        { message: "Keranjang tidak boleh kosong." },
        400
      );
    }

    // Buat kode pesanan unik sederhana, misal: JWN-7K2P9X
    const orderId = "JWN-" + crypto.randomUUID().slice(0, 6).toUpperCase();

    const order = {
      orderId,
      customer,
      items,
      total,
      status: "diterima",
      createdAt: new Date().toISOString(),
    };

    // --- Jika suatu saat sudah pasang Cloudflare KV, contoh simpannya: ---
    // await context.env.JAWAIN_ORDERS.put(orderId, JSON.stringify(order));

    return jsonResponse(
      {
        message: "Pesanan berhasil diterima",
        orderId,
        order,
      },
      201
    );
  } catch (err) {
    return jsonResponse(
      { message: "Format data tidak valid: " + err.message },
      400
    );
  }
}

// Tangani preflight CORS (kalau frontend & backend beda domain)
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
