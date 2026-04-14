// 🔥 COMPLETE CART.JS - ALL BUGS FIXED
let cart = [];
let orders = [];
let pendingOrders = [];
let completedOrders = [];
let totalSales = 0;

// 🔥 LOAD EVERYTHING
document.addEventListener('DOMContentLoaded', function () {
    updateCartBadge();
    loadCart();
    loadOrders(); // ✅ FIXED: Load orders FIRST
    updateCurrentTime();
    updateCurrentTimeInterval(); // ✅ AUTO UPDATE TIME
});

// 🔥 TIME FUNCTIONS - FIXED
function updateCurrentTime() {
    const datetimeEl = document.getElementById('local-datetime');
    const cartDateEl = document.getElementById('cart-date');

    const now = new Date();
    const timeString = now.toLocaleString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    if (datetimeEl) datetimeEl.textContent = timeString;
    if (cartDateEl) cartDateEl.textContent = `Order Date: ${timeString}`;
}

// ✅ AUTO UPDATE TIME EVERY SECOND
function updateCurrentTimeInterval() {
    setInterval(updateCurrentTime, 1000);
}

// 🔥 CART FUNCTIONS
function loadCart() {
    cart = JSON.parse(localStorage.getItem('cart') || '[]');
    displayCartItems();
    updateTotal();
}

function displayCartItems() {
    const container = document.getElementById('cart-items');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `
            <div style="text-align:center;padding:40px;color:#999;font-style:italic;">
                <div style="font-size:48px;margin-bottom:20px;">🛒</div>
                <h3>Your cart is empty</h3>
                <a href="products.html" style="background:#4caf50;color:white;padding:12px 30px;border-radius:25px;text-decoration:none;font-weight:bold;">🛍️ Shop Plants</a>
            </div>
        `;
        return;
    }

    container.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <div class="product-info">
                <strong>${item.name}</strong>
                <small>₱${item.price}</small>
            </div>
            <div class="qty-control">
                <button onclick="updateQuantity(${index}, -1)">−</button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity(${index}, 1)">+</button>
            </div>
            <div class="item-total">₱${(item.price * item.quantity).toLocaleString()}</div>
        </div>
    `).join('');
}

function updateQuantity(index, change) {
    if (index >= 0 && index < cart.length) {
        cart[index].quantity += change;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart();
        updateCartBadge();
    }
}

function updateTotal() {
    const totalEl = document.getElementById('total');
    if (!totalEl) return;

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalEl.textContent = total.toLocaleString();
}

function updateCartBadge() {
    const badges = document.querySelectorAll('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    badges.forEach(badge => badge.textContent = totalItems);
}

// 🔥 ORDERS FUNCTIONS - COMPLETELY FIXED
function loadOrders() {
    // ✅ FIXED: Load from localStorage and properly separate
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    pendingOrders = [];
    completedOrders = [];

    savedOrders.forEach(order => {
        if (order.status === 'Completed') {
            completedOrders.push(order);
        } else {
            pendingOrders.push(order);
        }
    });

    orders = [...pendingOrders, ...completedOrders];
    updateCounters();
}

function toggleOrders() {
    const dashboard = document.getElementById('ordersDashboard');
    const toggleText = document.getElementById('ordersToggle');
    const ordersCard = document.getElementById('ordersCard');
    const resetSection = document.getElementById('resetSection');

    if (dashboard.style.display === 'none' || dashboard.style.display === '') {
        dashboard.style.display = 'flex';
        toggleText.innerHTML = '❌ Close Orders';
        ordersCard.style.background = '#e8f5e8';

        loadOrders(); // ✅ RELOAD FRESH DATA
        updateOrdersDisplay();

        if (orders.length > 0) {
            resetSection.style.display = 'block';
        }

    } else {
        dashboard.style.display = 'none';
        resetSection.style.display = 'none';
        toggleText.innerHTML = '👁️ Click to View Orders';
        ordersCard.style.background = '';
    }
}

function updateOrdersDisplay() {
    displayPendingOrders();
    displayCompletedOrders();
}

function displayPendingOrders() {
    const list = document.getElementById('pending-list');
    if (!list) return;

    list.innerHTML = pendingOrders.length ?
        pendingOrders.map((order, i) => `
            <div style="background:#fff3cd;border:2px solid #ff9800;border-radius:12px;padding:20px;margin:10px 0;">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                    <span style="background:#ff9800;color:white;padding:5px 12px;border-radius:20px;font-size:12px;">⏳ PENDING</span>
                    <small style="color:#666;">${order.date}</small>
                </div>
                <p style="margin:8px 0;"><strong>${order.name}</strong> | ${order.phone}</p>
                <p style="margin:8px 0;font-size:14px;">${order.address}</p>
                <p style="margin:12px 0 16px 0;"><strong style="color:#e65100;">₱${order.total}</strong> | <span style="color:#666;">${order.payment}</span></p>
                <button onclick='completeOrder(${i})' style="background:#4caf50;color:white;border:none;padding:12px 24px;border-radius:8px;font-weight:bold;cursor:pointer;font-size:14px;transition:background 0.3s;" onmouseover="this.style.background='#45a049'" onmouseout="this.style.background='#4caf50'">✅ Complete Order</button>
            </div>
        `).join('') : '<p style="text-align:center;color:#999;padding:40px;font-style:italic;">No pending orders 🎉</p>';
}

function displayCompletedOrders() {
    const list = document.getElementById('completed-list');
    const totalBar = document.getElementById('overallTotalBar');

    if (!list || !totalBar) return;

    if (completedOrders.length === 0) {
        list.innerHTML = '<p style="text-align:center;color:#999;padding:60px 20px;font-style:italic;">No completed orders yet<br><small>Complete pending orders to see earnings! 💰</small></p>';
        totalBar.innerHTML = `
            <div>Waiting for your first completed order...</div>
            <div class="grand-total">₱0</div>
        `;
        totalBar.classList.add('empty');
        return;
    }

    list.innerHTML = completedOrders.slice(0, 6).map(order => `
        <div style="background:linear-gradient(135deg, #c8e6c9, #a8e6cf);border:2px solid #4caf50;border-radius:12px;padding:15px;margin:10px 0;display:flex;justify-content:space-between;align-items:center;">
            <div>
                <span style="background:#4caf50;color:white;padding:6px 12px;border-radius:20px;font-size:12px;">✅ DONE</span>
                <div style="margin-top:5px;"><strong>${order.name}</strong></div>
                <small style="color:#666;">${order.date}</small>
            </div>
            <div style="text-align:right;">
                <div style="font-size:22px;font-weight:bold;color:#4caf50;">₱${order.total}</div>
            </div>
        </div>
    `).join('');

    let grandTotal = 0;
    completedOrders.forEach(order => {
        grandTotal += parseFloat(order.total.replace(/,/g, ''));
    });

    totalBar.innerHTML = `
        <div style="font-size:16px;font-weight:bold;">TOTAL EARNINGS</div>
        <div class="grand-total">₱${grandTotal.toLocaleString()}</div>
    `;
    totalBar.classList.remove('empty');
}

function updateCounters() {
    const pendingCount = document.getElementById('pending-count');
    const completedCount = document.getElementById('completed-count');

    if (pendingCount) pendingCount.textContent = pendingOrders.length;
    if (completedCount) completedCount.textContent = completedOrders.length;
}

// ✅ FIXED: completeOrder - NOW SAVES STATUS TO LOCALSTORAGE
function completeOrder(index) {
    if (index >= 0 && index < pendingOrders.length) {
        const order = pendingOrders.splice(index, 1)[0];
        order.status = 'Completed'; // ✅ MARK AS COMPLETED
        completedOrders.push(order);

        // ✅ IMMEDIATELY SAVE TO LOCALSTORAGE
        orders = [...pendingOrders, ...completedOrders];
        localStorage.setItem('orders', JSON.stringify(orders));

        updateCounters();
        displayPendingOrders();
        displayCompletedOrders();
    }
}

function placeOrder() {
    if (cart.length === 0) return alert('Cart empty!');

    const name = document.getElementById('name').value;
    const contact = document.getElementById('contact').value;
    const barangay = document.getElementById('barangay').value;
    const street = document.getElementById('street').value;
    const payment = document.querySelector('input[name="payment"]:checked');

    if (!name || !contact || !barangay || !street || !payment) {
        return alert('Fill all fields!');
    }

    const total = cart.reduce((s, i) => s + (i.price * i.quantity), 0);
    const order = {
        name,
        phone: contact,
        address: `${street}, ${barangay}`,
        payment: payment.value,
        total: total.toLocaleString(),
        items: cart.map(i => `${i.name}x${i.quantity}`).join(', '),
        date: new Date().toLocaleString(),
        status: 'Pending' // ✅ ADD STATUS
    };

    pendingOrders.push(order); // ✅ ADD TO PENDING
    orders = [...pendingOrders, ...completedOrders];
    localStorage.setItem('orders', JSON.stringify(orders)); // ✅ SAVE IMMEDIATELY

    localStorage.removeItem('cart');
    cart = [];
    document.getElementById('name').value = '';
    document.getElementById('contact').value = '';
    document.getElementById('barangay').value = '';
    document.getElementById('street').value = '';

    alert('✅ Order placed!');
    loadCart();
    toggleOrders();
}

function openCart() {
    document.getElementById('cart-section').style.display = 'block';
}

// 🔥 RESET FUNCTIONS
function confirmReset() {
    document.getElementById('resetConfirm').style.display = 'block';
}

function cancelReset() {
    document.getElementById('resetConfirm').style.display = 'none';
}

function performReset() {
    if (confirm('⚠️ PERMANENTLY DELETE ALL ORDERS & CART?')) {
        localStorage.clear();
        orders = [];
        pendingOrders = [];
        completedOrders = [];
        cart = [];

        loadOrders();
        loadCart();
        updateOrdersDisplay();

        document.getElementById('resetSection').style.display = 'none';
        alert('🗑️ ALL DATA RESET! Fresh start complete! ✨');
    }
}