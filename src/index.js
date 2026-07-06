import { getMenu } from "./routes/menu.js";
import { createOrder } from "./routes/order.js";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // ==========================
    // CORS
    // ==========================
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(),
      });
    }

    try {

      // ==========================
      // GET /api/menu
      // ==========================
      if (
        request.method === "GET" &&
        url.pathname === "/api/menu"
      ) {
        return await getMenu(env);
      }

      // ==========================
      // POST /api/order
      // ==========================
      if (
        request.method === "POST" &&
        url.pathname === "/api/order"
      ) {
        return await createOrder(request, env);
      }

      // ==========================
      // Route Tidak Ditemukan
      // ==========================
      return json(
        {
          success: false,
          message: "Endpoint tidak ditemukan."
        },
        404
      );

    } catch (err) {

      return json(
        {
          success: false,
          message: err.message
        },
        500
      );

    }
  },
};

function json(data, status = 200) {
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: {
        ...corsHeaders(),
        "Content-Type": "application/json",
      },
    }
  );
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}
