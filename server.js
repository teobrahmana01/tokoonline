// server.js
const express = require('express');
const path = require('path');
const app = express();

// Gunakan port dari environment (untuk hosting), fallback ke 5000
const PORT = process.env.PORT || 5000;

// --- Data Produk (Simulasi Database) ---
const products = [
  { id: 101, game: 'Mobile Legends', type: 'Diamond', amount: 86, price: 25000, stock: 9999, imageUrl: 'images/mobile_legends_logo.jpg' },
  { id: 102, game: 'Mobile Legends', type: 'Diamond', amount: 172, price: 50000, stock: 9999, imageUrl: 'images/mobile_legends_logo.jpg' },
  { id: 103, game: 'Mobile Legends', type: 'Diamond', amount: 344, price: 100000, stock: 9999, imageUrl: 'images/mobile_legends_logo.jpg' },
  { id: 104, game: 'Mobile Legends', type: 'Diamond', amount: 515, price: 150000, stock: 9999, imageUrl: 'images/mobile_legends_logo.jpg' },

  { id: 201, game: 'PUBG Mobile', type: 'UC', amount: 250, price: 55000, stock: 9999, imageUrl: 'images/pubgm_logo.jpeg' },
  { id: 202, game: 'PUBG Mobile', type: 'UC', amount: 500, price: 105000, stock: 9999, imageUrl: 'images/pubgm_logo.jpeg' },
  { id: 203, game: 'PUBG Mobile', type: 'UC', amount: 1000, price: 200000, stock: 9999, imageUrl: 'images/pubgm_logo.jpeg' },
  { id: 204, game: 'PUBG Mobile', type: 'UC', amount: 2000, price: 390000, stock: 9999, imageUrl: 'images/pubgm_logo.jpeg' },

  { id: 301, game: 'Point Blank', type: 'Cash', amount: 1200, price: 10000, stock: 9999, imageUrl: 'images/pb_logo.jpg' },
  { id: 302, game: 'Point Blank', type: 'Cash', amount: 6000, price: 50000, stock: 9999, imageUrl: 'images/pb_logo.jpg' },
  { id: 303, game: 'Point Blank', type: 'Cash', amount: 12000, price: 100000, stock: 9999, imageUrl: 'images/pb_logo.jpg' },
  { id: 304, game: 'Point Blank', type: 'Cash', amount: 20000, price: 150000, stock: 9999, imageUrl: 'images/pb_logo.jpg' },

  { id: 401, game: 'Free Fire', type: 'Diamond', amount: 100, price: 15000, stock: 9999, imageUrl: 'images/ff_logo.png' },
  { id: 402, game: 'Free Fire', type: 'Diamond', amount: 500, price: 70000, stock: 9999, imageUrl: 'images/ff_logo.png' },
  { id: 403, game: 'Free Fire', type: 'Diamond', amount: 1000, price: 135000, stock: 9999, imageUrl: 'images/ff_logo.png' },
  { id: 405, game: 'Free Fire', type: 'Diamond', amount: 2000, price: 265000, stock: 9999, imageUrl: 'images/ff_logo.png' },
];

// --- Middleware ---
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- API Routes ---
app.get('/api/products', (req, res) => {
  res.json(products);
});

app.post('/api/checkout', (req, res) => {
  const { items, total } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'Keranjang kosong. Tidak dapat memproses pesanan.' });
  }

  const orderId = 'ORD-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);

  res.json({
    message: 'Pesanan top-up Anda berhasil dibuat dan menunggu pembayaran.',
    orderId,
    total,
  });
});

// --- Jalankan Server ---
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
