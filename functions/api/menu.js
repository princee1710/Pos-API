// =====================================================================
// functions/api/menu.js
// Ini adalah "backend" JAWAIN, dalam bentuk Cloudflare Pages Function.
//
// Cara kerja Cloudflare Pages Functions (untuk pemula):
// - Setiap file di dalam folder /functions otomatis menjadi API endpoint.
// - Nama file & folder = URL-nya.
//   functions/api/menu.js  ->  bisa diakses lewat  /api/menu
//
// File ini akan dipanggil ketika ada request ke: GET /api/menu
// =====================================================================

const MENU_ITEMS = [
  {
    id: "1",
    name: "Kopi Susu Gula Aren",
    description: "Espresso rumahan, susu creamy, manis gula aren asli.",
    price: 22000,
    category: "kopi-susu",
    icon: "🥤",
  },
  {
    id: "2",
    name: "Latte Klasik",
    description: "Perpaduan espresso lembut dan susu steamed yang creamy.",
    price: 25000,
    category: "kopi-susu",
    icon: "☕",
  },
  {
    id: "3",
    name: "Kopi Hitam Tubruk",
    description: "Kopi robusta asli, diseduh tubruk ala kedai kampung.",
    price: 15000,
    category: "kopi-hitam",
    icon: "⚫",
  },
  {
    id: "4",
    name: "Americano",
    description: "Espresso dengan air panas, ringan dan clean di lidah.",
    price: 18000,
    category: "kopi-hitam",
    icon: "🖤",
  },
  {
    id: "5",
    name: "Cokelat Susu",
    description: "Cokelat premium dengan susu full cream, tanpa kopi.",
    price: 20000,
    category: "non-kopi",
    icon: "🍫",
  },
  {
    id: "6",
    name: "Matcha Latte",
    description: "Matcha grade A dengan susu creamy, tidak terlalu manis.",
    price: 24000,
    category: "non-kopi",
    icon: "🍵",
  },
  {
    id: "7",
    name: "Roti Bakar Cokelat Keju",
    description: "Roti bakar hangat dengan cokelat leleh dan taburan keju.",
    price: 17000,
    category: "camilan",
    icon: "🍞",
  },
  {
    id: "8",
    name: "Pisang Goreng Madu",
    description: "Pisang goreng krispi disiram madu asli, teman ngopi santai.",
    price: 15000,
    category: "camilan",
    icon: "🍌",
  },
];

context.env.DB
