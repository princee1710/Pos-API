// =====================================================================
// JAWAIN — script.js
// Semua logika frontend: ambil menu dari backend, kelola keranjang,
// dan kirim pesanan ke backend.
// =====================================================================

// State keranjang disimpan di memori (bukan localStorage,
// supaya kompatibel dengan semua lingkungan)
let cart = [];
let allMenuItems = [];

const rupiah = (angka) =>
  "Rp " + angka.toLocaleString("id-ID");

// ---------------------------------------------------------------------
// 1. AMBIL DATA MENU DARI BACKEND (Cloudflare Pages Function)
// ---------------------------------------------------------------------
async function loadMenu() {
  const grid = document.getElementById("menuGrid");
  try {
    const res = await fetch("/api/menu");
    if (!res.ok) throw new Error("Gagal mengambil menu");
    const data = await res.json();
    allMenuItems = data.items || [];
    renderMenu(allMenuItems);
  } catch (err) {
    grid.innerHTML = `<p class="menu__error">Gagal memuat menu. Pastikan backend (/api/menu) berjalan. (${err.message})</p>`;
  }
}

function renderMenu(items) {
  const grid = document.getElementById("menuGrid");
  if (!items.length) {
    grid.innerHTML = `<p class="menu__loading">Belum ada menu di kategori ini.</p>`;
    return;
  }
  grid.innerHTML = items
    .map(
      (item) => `
      <div class="menu__card" data-category="${item.category}">
        <div class="menu__card__icon">${item.icon || "☕"}</div>
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <div class="menu__card__foot">
          <span class="menu__card__price">${rupiah(item.price)}</span>
          <button class="menu__add" data-id="${item.id}">+ Tambah</button>
        </div>
      </div>`
    )
    .join("");

  grid.querySelectorAll(".menu__add").forEach((btn) => {
    btn.addEventListener("click", () => addToCart(btn.dataset.id));
  });
}

// ---------------------------------------------------------------------
// 2. FILTER KATEGORI MENU
// ---------------------------------------------------------------------
document.getElementById("menuFilter").addEventListener("click", (e) => {
  const btn = e.target.closest(".chip");
  if (!btn) return;
  document
    .querySelectorAll(".chip")
    .forEach((c) => c.classList.remove("is-active"));
  btn.classList.add("is-active");

  const filter = btn.dataset.filter;
  const filtered =
    filter === "all"
      ? allMenuItems
      : allMenuItems.filter((i) => i.category === filter);
  renderMenu(filtered);
});

// ---------------------------------------------------------------------
// 3. LOGIKA KERANJANG
// ---------------------------------------------------------------------
function addToCart(id) {
  const item = allMenuItems.find((i) => String(i.id) === String(id));
  if (!item) return;

  const existing = cart.find((c) => c.id === item.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  renderCart();
  openCart();
}

function changeQty(id, delta) {
  const line = cart.find((c) => c.id === id);
  if (!line) return;
  line.qty += delta;
  if (line.qty <= 0) {
    cart = cart.filter((c) => c.id !== id);
  }
  renderCart();
}

function renderCart() {
  const itemsEl = document.getElementById("cartItems");
  const countEl = document.getElementById("cartCount");
  const totalEl = document.getElementById("cartTotal");

  countEl.textContent = cart.reduce((sum, c) => sum + c.qty, 0);

  if (!cart.length) {
    itemsEl.innerHTML = `<p class="cart__empty">Keranjang masih kosong. Yuk pilih menu dulu ☕</p>`;
    totalEl.textContent = rupiah(0);
    return;
  }

  itemsEl.innerHTML = cart
    .map(
      (c) => `
      <div class="cart__item">
        <div>
          <div class="cart__item__name">${c.name}</div>
          <div class="cart__item__meta">${rupiah(c.price)} x ${c.qty}</div>
        </div>
        <div class="cart__item__actions">
          <button class="qty__btn" data-id="${c.id}" data-delta="-1">−</button>
          <span>${c.qty}</span>
          <button class="qty__btn" data-id="${c.id}" data-delta="1">+</button>
        </div>
      </div>`
    )
    .join("");

  itemsEl.querySelectorAll(".qty__btn").forEach((btn) => {
    btn.addEventListener("click", () =>
      changeQty(btn.dataset.id, Number(btn.dataset.delta))
    );
  });

  const total = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  totalEl.textContent = rupiah(total);
}

// ---------------------------------------------------------------------
// 4. BUKA / TUTUP LACI KERANJANG
// ---------------------------------------------------------------------
const cartDrawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");

function openCart() {
  cartDrawer.classList.add("is-open");
  overlay.classList.add("is-open");
}
function closeCart() {
  cartDrawer.classList.remove("is-open");
  overlay.classList.remove("is-open");
}

document.getElementById("cartBtn").addEventListener("click", openCart);
document.getElementById("cartClose").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

// ---------------------------------------------------------------------
// 5. KIRIM PESANAN KE BACKEND
// ---------------------------------------------------------------------
document.getElementById("orderForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const statusEl = document.getElementById("orderStatus");
  const submitBtn = document.getElementById("submitOrderBtn");

  if (!cart.length) {
    statusEl.textContent = "Keranjang masih kosong, pilih menu dulu ya.";
    statusEl.className = "cart__status is-error";
    return;
  }

  const payload = {
    customer: {
      nama: document.getElementById("namaPemesan").value,
      telepon: document.getElementById("teleponPemesan").value,
      catatan: document.getElementById("catatanPemesan").value,
    },
    items: cart.map((c) => ({ id: c.id, name: c.name, qty: c.qty, price: c.price })),
    total: cart.reduce((sum, c) => sum + c.price * c.qty, 0),
  };

  submitBtn.disabled = true;
  submitBtn.textContent = "Mengirim pesanan...";
  statusEl.textContent = "";

  try {
    const res = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Gagal mengirim pesanan");

    statusEl.textContent = `Pesanan diterima! Kode pesanan: ${data.orderId}`;
    statusEl.className = "cart__status is-success";
    cart = [];
    renderCart();
    e.target.reset();
  } catch (err) {
    statusEl.textContent = `Gagal: ${err.message}`;
    statusEl.className = "cart__status is-error";
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Pesan Sekarang";
  }
});

// ---------------------------------------------------------------------
// 6. NAVBAR MOBILE (burger sederhana -> scroll ke menu)
// ---------------------------------------------------------------------
document.getElementById("burgerBtn").addEventListener("click", () => {
  document.getElementById("navLinks").classList.toggle("is-open");
});

// ---------------------------------------------------------------------
// INIT
// ---------------------------------------------------------------------
loadMenu();
