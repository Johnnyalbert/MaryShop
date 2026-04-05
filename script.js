// ==================== PRODUCTOS =================
const products = [
    { id: 1, name: "Crema blanqueadora para el rostro", price: 1800, image: "https://xqjnrnyutghzxuamrnkb.supabase.co/storage/v1/object/public/MaryImg/Crema%20blanqueadora%20para%20el%20rostro.jpg", description: "Unifica el tono, reduce manchas", category: "crema" },
    { id: 2, name: "Limpiador de vitamina C", price: 1500, image: "https://xqjnrnyutghzxuamrnkb.supabase.co/storage/v1/object/public/MaryImg/Limpiador%20de%20vitamina%20c.jpg", description: "Limpieza suave + efecto luminoso", category: "limpiador" },
    { id: 3, name: "Mascarilla peel off de Granada", price: 3000, image: "https://xqjnrnyutghzxuamrnkb.supabase.co/storage/v1/object/public/MaryImg/Mascarillas%20peel%20off%20de%20Granada.jpg", description: "Antioxidantes, hidratación y luminosidad", category: "mascarilla" },
    { id: 4, name: "Serum blanqueador de vitamina C", price: 2200, image: "https://xqjnrnyutghzxuamrnkb.supabase.co/storage/v1/object/public/MaryImg/Serum%20blanqueador%20de%20vitamina%20c.jpg", description: "Aclara, ilumina y previene arrugas", category: "serum" },
    { id: 5, name: "Serum de baba de caracol 100ml", price: 2500, image: "https://xqjnrnyutghzxuamrnkb.supabase.co/storage/v1/object/public/MaryImg/Serum%20de%20baba%20de%20caracol%20100ml.jpg", description: "Rejuvenece, repara y regenera la piel", category: "serum" },
    { id: 6, name: "Serum de Granada 100ml", price: 2500, image: "https://xqjnrnyutghzxuamrnkb.supabase.co/storage/v1/object/public/MaryImg/Serum%20de%20Granada%20100ml.jpg", description: "Hidratación profunda y antioxidante", category: "serum" }
];

// ============== VARIABLES GLOBALES ======
let cart = JSON.parse(localStorage.getItem('marysCart')) || [];
let currentFilter = "all";
let searchTerm = "";

// =============== FRASES ROTATIVAS ===========
const phrases = [
    " El maquillaje es el arte de realzar la belleza interior",
    "Una mujer con maquillaje es como una obra de arte",
    "El rubor es la sonrisa de las mejillas",
    "Los ojos son el espejo del alma, resáltalos",
    "La belleza comienza en el momento que decides ser tú misma",
    "El maquillaje no cambia quién eres, solo muestra quién quieres ser",
    "Una pizca de brillo nunca está de más",
"No eres fea, solo que no has comprado un producto en Mary's Make up"
];

let phraseIndex = 0;
const phraseEl = document.getElementById('rotatingPhrase');

function rotatePhrase() {
    if (!phraseEl) return;
    phraseEl.style.opacity = '0';
    setTimeout(() => {
        phraseIndex = (phraseIndex + 1) % phrases.length;
        phraseEl.textContent = phrases[phraseIndex];
        phraseEl.style.opacity = '1';
    }, 400);
}
setInterval(rotatePhrase, 7000);

// ==================== FUNCIONES DEL CARRITO ====================
function saveCart() {
    localStorage.setItem('marysCart', JSON.stringify(cart));
    updateCartUI();
}

function updateCartUI() {
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').innerText = cartCount;

    const cartItemsDiv = document.getElementById('cartItems');
    const cartTotalSpan = document.getElementById('cartTotal');
    
    if(cart.length === 0) {
        cartItemsDiv.innerHTML = '<p style="text-align:center; color:#f5a0b9; padding:20px;">✨ Tu necesitas un poco de magia aquí ✨</p>';
        cartTotalSpan.innerText = 'Total: $0 CUP';
        return;
    }

    cartItemsDiv.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        total += item.price * item.quantity;
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <img src="${item.image}" class="cart-item-img" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p style="color:#e91e63;">$${item.price.toFixed(2)} CUP x ${item.quantity}</p>
                <small style="color:#d4af37;">Subtotal: $${(item.price * item.quantity).toFixed(2)} CUP</small>
            </div>
            <button onclick="removeFromCart(${item.id})" style="background:#e91e63; border:none; color:white; padding:0.5rem 1rem; border-radius:1rem; cursor:pointer; font-weight:600;">Eliminar</button>
        `;
        cartItemsDiv.appendChild(itemDiv);
    });
    cartTotalSpan.innerText = `Total: $${total.toFixed(2)} CUP`;
}

function addToCart(product) {
    const existing = cart.find(item => item.id === product.id);
    if(existing) {
        existing.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    saveCart();
    showToast(`${product.name} agregado a tu neceser`);
}

window.removeFromCart = function(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    if(cart.length === 0) {
        document.getElementById('cartSidebar').classList.remove('open');
        document.getElementById('overlay').classList.remove('active');
    }
};

function clearCart() {
    if(cart.length === 0) {
        showToast("⚠️ El carrito ya está vacío");
        return;
    }
    cart = [];
    saveCart();
    showToast("🧹 Carrito vaciado correctamente");
    document.getElementById('cartSidebar').classList.remove('open');
    document.getElementById('overlay').classList.remove('active');
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.innerText = `💄 ${message}`;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

// ==================== RENDERIZADO DE PRODUCTOS ====================
function renderProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    
    let filtered = products;
    if (currentFilter !== 'all') {
        filtered = filtered.filter(p => p.category === currentFilter);
    }
    if (searchTerm.trim() !== '') {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(p => p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term));
    }
    
    if (filtered.length === 0) {
        grid.innerHTML = '<div style="text-align:center; padding:50px; color:#e91e63;">😢 No encontramos productos que coincidan con tu búsqueda</div>';
        return;
    }
    
    grid.innerHTML = '';
    filtered.forEach((product, index) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.style.animationDelay = `${index * 0.05}s`;
        card.innerHTML = `
            <img src="${product.image}" class="product-img" alt="${product.name}" onerror="this.src='https://placehold.co/300x250?text=Imagen+no+disponible'">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p style="color:#f5a0b9; font-size:0.85rem; margin-bottom:10px;">${product.description}</p>
                <div class="product-price">$${product.price.toFixed(2)} CUP</div>
                <button class="add-to-cart" data-id="${product.id}">
                    <i class="fas fa-cart-plus"></i> Añadir al carrito
                </button>
            </div>
        `;
        grid.appendChild(card);
        const btn = card.querySelector('.add-to-cart');
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            addToCart(product);
            animateButton(btn);
        });
    });
}

function animateButton(btn) {
    btn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        btn.style.transform = 'scale(1)';
    }, 150);
}

// ==================== FILTROS Y BÚSQUEDA ====================
function setupFilters() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    const applyFilters = () => {
        searchTerm = searchInput.value;
        renderProducts();
    };
    
    searchBtn.addEventListener('click', applyFilters);
    searchInput.addEventListener('keyup', (e) => { if(e.key === 'Enter') applyFilters(); });
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderProducts();
        });
    });
}

// ==================== WHATSAPP Y MODAL ====================
function openCheckoutModal() {
    if(cart.length === 0) {
        showToast("¡Agrega productos a tu neceser primero!");
        return;
    }
    document.getElementById('modal').classList.add('active');
}

function sendOrderToWhatsApp() {
    const name = document.getElementById('customerName').value.trim();
    const address = document.getElementById('customerAddress').value.trim();
    const phone = document.getElementById('customerPhone').value.trim();

    if(name === "" || address === "") {
        showToast("⚠️ Por favor, completa tu nombre y dirección");
        return;
    }
    
    let message = "💄 *NUEVO PEDIDO - Mary's Make Up* 💄%0A%0A";
    message += `👤 *Cliente:* ${name}%0A`;
    message += `📍 *Dirección:* ${address}%0A`;
    if(phone) message += `📞 *Teléfono:* ${phone}%0A`;
    message += `%0A📦 *PRODUCTOS:*%0A`;
    
    let total = 0;
    cart.forEach(item => {
        message += `✨ ${item.name} x${item.quantity} → $${(item.price * item.quantity).toFixed(2)} CUP%0A`;
        total += item.price * item.quantity;
    });
    
    message += `%0A💰 *TOTAL: $${total.toFixed(2)} CUP*%0A%0A`;
    message += `🙏 ¡Gracias por tu compra! 💖`;
    
    document.getElementById('modal').classList.remove('active');
    document.getElementById('cartSidebar').classList.remove('open');
    document.getElementById('overlay').classList.remove('active');
    document.getElementById('customerName').value = '';
    document.getElementById('customerAddress').value = '';
    document.getElementById('customerPhone').value = '';
    
    cart = [];
    saveCart();
    
    window.open(`https://wa.me/5351949771?text=${message}`, '_blank');
}

// ==================== EVENTOS ====================
document.getElementById('cartIcon').addEventListener('click', () => {
    document.getElementById('cartSidebar').classList.add('open');
    document.getElementById('overlay').classList.add('active');
});

document.getElementById('closeCartBtn').addEventListener('click', () => {
    document.getElementById('cartSidebar').classList.remove('open');
    document.getElementById('overlay').classList.remove('active');
});

document.getElementById('overlay').addEventListener('click', () => {
    document.getElementById('cartSidebar').classList.remove('open');
    document.getElementById('overlay').classList.remove('active');
});

document.getElementById('checkoutBtn').addEventListener('click', openCheckoutModal);
document.getElementById('clearCartBtn').addEventListener('click', clearCart);

document.getElementById('confirmModal').addEventListener('click', sendOrderToWhatsApp);
document.getElementById('cancelModal').addEventListener('click', () => {
    document.getElementById('modal').classList.remove('active');
    document.getElementById('customerName').value = '';
    document.getElementById('customerAddress').value = '';
    document.getElementById('customerPhone').value = '';
});

// ==================== INICIALIZAR ====================
setupFilters();
renderProducts();
updateCartUI();

