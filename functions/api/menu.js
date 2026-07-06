// =====================================================================
// functions/api/menu.js
// Versi ini SUDAH terhubung ke database Cloudflare D1.
// - GET  /api/menu   -> ambil semua menu dari database
// - POST /api/menu   -> tambah menu baru ke database
//
// PENTING: file ini butuh binding database bernama "DB".
// Cara membuat binding-nya ada di tutorial (bagian "Hubungkan D1 ke Pages").
// =====================================================================

import { json, corsPreflight } from "./_utils.js";

export async function onRequestGet(context) {
  try {
    const { results } = await context.env.DB.prepare(
      "SELECT * FROM menu_items ORDER BY id ASC"
    ).all();

    return json({ items: results });
  } catch (err) {
    return json(
      { message: "Gagal mengambil menu dari database: " + err.message },
      500
    );
  }
}

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const { name, description, price, category, icon } = body;

    if (!name || !price || !category) {
      return json(
        { message: "Field name, price, dan category wajib diisi." },
        400
      );
    }

    const result = await context.env.DB.prepare(
      `INSERT INTO menu_items (name, description, price, category, icon)
       VALUES (?, ?, ?, ?, ?)`
    )
      .bind(name, description || "", price, category, icon || "☕")
      .run();

    return json(
      {
        message: "Menu berhasil ditambahkan",
        id: result.meta.last_row_id,
      },
      201
    );
  } catch (err) {
    return json(
      { message: "Gagal menambah menu: " + err.message },
      500
    );
  }
}

export async function onRequestOptions() {
  return corsPreflight();
}
