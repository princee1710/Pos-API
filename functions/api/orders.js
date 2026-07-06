export async function onRequestPost(context){
try{
 const body=await context.request.json();
 const {customer,items,total}=body;
 if(!customer||!customer.nama||!customer.telepon) return json({message:"Nama dan nomor WhatsApp wajib diisi."},400);
 if(!Array.isArray(items)||items.length===0) return json({message:"Keranjang tidak boleh kosong."},400);
 const orderId="JWN-"+crypto.randomUUID().replace(/-/g,"").substring(0,6).toUpperCase();
 const createdAt=new Date().toISOString();
 await context.env.DB.prepare(`INSERT INTO orders(order_id,customer_name,customer_phone,items,total,status,created_at) VALUES(?,?,?,?,?,?,?)`)
 .bind(orderId,customer.nama,customer.telepon,JSON.stringify(items),total,"diterima",createdAt).run();
 return json({message:"Pesanan berhasil diterima",orderId},201);
}catch(err){return json({message:err.message},500);}
}
export async function onRequestOptions(){return new Response(null,{status:204,headers:{"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET, POST, OPTIONS","Access-Control-Allow-Headers":"Content-Type"}});}
function json(data,status=200){return new Response(JSON.stringify(data),{status,headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}});}
