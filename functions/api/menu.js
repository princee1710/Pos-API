export async function onRequestGet(context) {
  try {
    const { results } = await context.env.DB.prepare(
      "SELECT * FROM menu ORDER BY id ASC"
    ).all();

    return new Response(JSON.stringify({ items: results }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({message: err.message}), {
      status:500,
      headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}
    });
  }
}
