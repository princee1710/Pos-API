// =====================================================================
// functions/api/menu/[id].js
// Nama file pakai kurung siku [id] artinya "id" di sini adalah bagian
// yang berubah-ubah di URL. Contoh:
//   /api/menu/3   -> context.params.id akan bernilai "3"
//
// - GET    /api/menu/:id  -> ambil 1 menu berdasarkan id
// - PUT    /api/menu/:id  -> ubah/edit menu berdasarkan id
// - DELETE /api/menu/:id  -> hapus menu berdasarkan id
// =====================================================================

import { json, corsPreflight } from "../_utils.js";

export async function onRequestGet(context) {
  const id = context.params.id;
  try {
    const item = await context.env.DB.prepare(
      "SELECT * FROM menu_items WHERE id = ?"
    )
      .bind(id)
      .first();

    if (!item) return json({ message: "Menu tidak ditemukan" }, 404);
    return json(item);
  } catch (err) {
    return json({ message: "Gagal mengambil menu: " + err.message }, 500);
  }
}

export async function onRequestPut(context) {
  const id = context.params.id;
  try {
    const body = await context.request.json();
    const { name, description, price, category, icon } = body;

    if (!name || !price || !category) {
      return json(
        { message: "Field name, price, dan category wajib diisi." },
        400
      );
    }

    await context.env.DB.prepare(
      `UPDATE menu_items
       SET name = ?, description = ?, price = ?, category = ?, icon = ?
       WHERE id = ?`
    )
      .bind(name, description || "", price, category, icon || "☕", id)
      .run();

    return json({ message: "Menu berhasil diubah", id });
  } catch (err) {
    return json({ message: "Gagal mengubah menu: " + err.message }, 500);
  }
}

export async function onRequestDelete(context) {
  const id = context.params.id;
  try {
    await context.env.DB.prepare("DELETE FROM menu_items WHERE id = ?")
      .bind(id)
      .run();

    return json({ message: "Menu berhasil dihapus", id });
  } catch (err) {
    return json({ message: "Gagal menghapus menu: " + err.message }, 500);
  }
}

export async function onRequestOptions() {
  return corsPreflight();
}
