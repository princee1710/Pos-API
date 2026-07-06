// =====================================================================
// functions/api/_utils.js
// File bantuan kecil, dipakai bersama oleh menu.js dan menu/[id].js
// supaya tidak menulis ulang kode yang sama.
// File yang namanya diawali garis bawah "_" TIDAK menjadi endpoint API,
// jadi aman dipakai sebagai file bantuan saja.
// =====================================================================

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export function corsPreflight() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
