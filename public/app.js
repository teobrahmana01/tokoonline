// public/app.js - KODE PERBAIKAN FINAL

let cart = []; 

function updateCartCount() {
    // Hitung total item berdasarkan kuantitas, bukan hanya jumlah jenis item (panjang array)
    const count = cart.reduce((total, item) => total + (item.qty || 1), 0); 
    
    // Memperbarui hitungan di header (tombol Keranjang)
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = count;
    }
    
    // Memperbarui hitungan 'Total Item' di modal
    const summaryCountElement = document.getElementById('summary-count');
    if (summaryCountElement) {
        summaryCountElement.textContent = count;
    }
}

function calculateTotal() {
    // Menghitung total harga berdasarkan harga * kuantitas
    return cart.reduce((total, item) => total + (Number(item.price) || 0) * (item.qty || 1), 0);
}

function renderCartModal() {
    const cartItemsElement = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');

    // Kunci: Panggil updateCartCount() di awal renderModal untuk sinkronisasi hitungan
    updateCartCount(); 
    
    cartItemsElement.innerHTML = ''; 

    if (cart.length === 0) {
        cartItemsElement.innerHTML = '<p>Keranjang kosong. Tambahkan paket top-up!</p>';
    } else {
        cart.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'cart-item';
            
            const formattedPrice = ((Number(item.price) || 0) * (item.qty || 1)).toLocaleString('id-ID');
            
            itemDiv.innerHTML = `
                <span>**${item.game}** (${item.amount} ${item.type})</span>
                <span>Jumlah: ${item.qty || 1} | ID: ${item.playerId}</span>
                <span style="font-weight: bold;">Rp${formattedPrice}</span>
            `;
            cartItemsElement.appendChild(itemDiv);
        });
    }

    const total = calculateTotal();
    cartTotalElement.textContent = total.toLocaleString('id-ID');
}

function getPlayerId(gameName) {
    let inputId = '';
    
    if (gameName.includes('Mobile Legends')) {
        inputId = 'player-id-ml';
    } else if (gameName.includes('PUBG Mobile')) {
        inputId = 'player-id-pubgm';
    } else if (gameName.includes('Point Blank')) {
        inputId = 'player-id-pb';
    } else if (gameName.includes('Free Fire'))   {
        inputId = 'player-id-ff';

    } else {
        return '';
    }
    
    const inputElement = document.getElementById(inputId);
    return inputElement ? inputElement.value.trim() : '';
}

function addToCart(product) {
    const playerId = getPlayerId(product.game);

    if (!playerId) {
        alert(`❌ Mohon masukkan ID Pemain untuk ${product.game} di kolom input di atas terlebih dahulu!`);
        return;
    }
    
    // Perbaikan: Cek item berdasarkan game, amount, dan price agar item dianggap sama
    const existingIndex = cart.findIndex(item => 
        item.game === product.game && 
        item.amount === product.amount &&
        item.price === product.price
    );
    
    const newItem = { 
        ...product, 
        qty: 1, // Tambahkan properti kuantitas
        playerId: playerId 
    };

    if (existingIndex > -1) {
        // Jika item sudah ada, TINGKATKAN KUANTITAS
        cart[existingIndex].qty += 1;
        // Perbarui ID pemain (jika pengguna mengubahnya)
        cart[existingIndex].playerId = playerId; 
    } else {
        // Jika item baru, tambahkan
        cart.push(newItem);
    }
    
    alert(`✅ Paket ${product.game} berhasil ditambahkan/diperbarui di keranjang!`); 
    
    updateCartCount();
    // Tidak perlu memanggil renderCartModal di sini, cukup di tombol header
}

function renderProduct(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-game', product.game.split(' ')[0]); 
    
    card.innerHTML = `
        <img src="${product.imageUrl || 'images/logo.png'}" alt="Logo ${product.game}" class="game-logo"> 
        <h3>${product.game}</h3>
        <p>Paket: **${product.amount} ${product.type}**</p>
        <p>Harga: **Rp${(Number(product.price) || 0).toLocaleString('id-ID')}**</p>
        <button class="add-to-cart-btn" data-product='${JSON.stringify(product)}'>Tambah Keranjang</button>
    `;

    const button = card.querySelector('.add-to-cart-btn');
    button.addEventListener('click', (e) => {
        const productData = JSON.parse(e.currentTarget.dataset.product);
        addToCart(productData);
    });

    return card;
}

async function fetchAndDisplayProducts() {
    const productListElement = document.getElementById('product-list');
    
    productListElement.innerHTML = ''; 
    
    try {
        const response = await fetch('/api/products');
        
        if (!response.ok) {
            throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
        
        const products = await response.json();

        if (Array.isArray(products) && products.length > 0) { 
            products.forEach(product => {
                productListElement.appendChild(renderProduct(product));
            });
        } else {
            productListElement.innerHTML += '<p>Belum ada produk top-up yang tersedia.</p>';
        }

    } catch (error) {
        console.error('Gagal mengambil atau merender produk:', error);
        productListElement.innerHTML += '<p style="color: red;">❌ Maaf, produk tidak dapat dimuat saat ini. Cek koneksi server Anda.</p>';
    }
}


// --- EVENT LISTENERS (MODAL & CHECKOUT) ---

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('cart-modal');
    const btn = document.getElementById('show-cart-btn');
    // Pastikan Anda menambahkan class="close-btn" di HTML modal
    const closeSpan = document.querySelector('.modal-content .close-btn'); 
    const checkoutBtn = document.getElementById('checkout-btn');

    // Event listener untuk tombol keranjang di header (membuka modal)
    if (btn) {
        btn.onclick = function() {
            renderCartModal(); 
            modal.style.display = "block";
        }
    }

    // Event listener untuk tombol silang (Close)
    if (closeSpan) {
        closeSpan.onclick = function() {
            modal.style.display = "none";
        }
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Event listener untuk tombol Checkout
    if (checkoutBtn) {
        checkoutBtn.onclick = async function() {
            if (cart.length === 0) {
                alert("Keranjang Anda masih kosong! Tambahkan paket top-up.");
                return;
            }
    
            const total = calculateTotal();
    
            const confirmCheckout = confirm(`Anda akan Checkout ${cart.reduce((total, item) => total + (item.qty || 1), 0)} item dengan total Rp${total.toLocaleString('id-ID')}. Lanjutkan?`);
            
            if (!confirmCheckout) {
                return; 
            }
    
            try {
                // ... (Kode Checkout)
                const response = await fetch('/api/checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        items: cart, 
                        total: total 
                    })
                });
                
                const result = await response.json();
                
                if (!response.ok) {
                    throw new Error(result.message || `Checkout gagal. Kode status: ${response.status}`);
                }
    
                alert(`✅ Checkout Berhasil!\n\nID Pesanan: ${result.orderId}\nTotal Pembayaran: Rp${total.toLocaleString('id-ID')}\n\n${result.message || 'Terima kasih atas pesanan Anda.'}`);
                
                // Reset keranjang setelah checkout
                cart = [];
                updateCartCount();
                modal.style.display = "none";
                
            } catch (error) {
                console.error('Gagal saat checkout:', error);
                alert(`❌ Gagal memproses pesanan: ${error.message || 'Cek koneksi server.'}`);
            }
        }
    }

    fetchAndDisplayProducts();
    updateCartCount(); // Inisialisasi hitungan saat halaman dimuat (agar tidak 0)
});