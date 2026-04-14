// ✅ SEARCH FUNCTION (UNCHANGED)
function searchPlant(event) {
    event.preventDefault();
    let input = document.getElementById("searchInput").value.toLowerCase();
    let cards = document.querySelectorAll(".card");

    cards.forEach(card => {
        let name = card.querySelector("h3").textContent.toLowerCase();
        if (name.includes(input)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}

// ✅ FIXED: GO TO CART
function goToCart() {
    window.location.href = "cart.html";
}

// ✅ CATEGORY FILTER (UNCHANGED)
function filterPlants(category) {
    let cards = document.querySelectorAll(".card");
    cards.forEach(card => {
        if (category === "all" || card.classList.contains(category)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}

// ✅ FIXED: ADD TO CART - SIMPLIFIED & BULLETPROOF
function addToCart(name, price) {
    // Get current cart
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Check if item exists
    let existing = cart.find(item => item.name === name);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }

    // SAVE TO LOCALSTORAGE
    localStorage.setItem("cart", JSON.stringify(cart));

    // UPDATE CART COUNT ON PAGE
    updateCartCount();

    // NICE FEEDBACK
    let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    alert(`✅ ${name}\nAdded to cart!\n🛒 Total items: ${totalItems}`);
}

// ✅ NEW: UPDATE CART COUNT BADGES
function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    // Update all cart count badges
    let cartBadges = document.querySelectorAll('.cart-count');
    cartBadges.forEach(badge => {
        badge.textContent = totalItems;
        if (totalItems > 0) {
            badge.style.display = 'inline';
            badge.style.background = '#ff4444';
            badge.style.color = 'white';
            badge.style.borderRadius = '50%';
            badge.style.padding = '2px 6px';
            badge.style.fontSize = '12px';
        } else {
            badge.style.display = 'none';
        }
    });
}

// 🔥 CRITICAL: PAGE LOAD - UPDATE CART COUNT IMMEDIATELY
document.addEventListener('DOMContentLoaded', function () {
    updateCartCount();
});

// 🔥 NEW: GO TO CART WITH ANIMATED TRANSITION
function goToCart() {
    // Smooth slide animation
    document.body.style.transition = 'opacity 0.3s';
    document.body.style.opacity = '0.5';
    setTimeout(() => {
        window.location.href = "cart.html";
    }, 200);
}

// 🔥 ENHANCED: BETTER NOTIFICATION (Replace your alert)
function addToCart(name, price) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let existing = cart.find(item => item.name === name);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1,
            image: '' // 🔥 ADDED: For cart display
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();

    // 🔥 BETTER NOTIFICATION (floating)
    showFloatingNotification(`✅ ${name} added! 🛒`);
}

// 🔥 NEW: FLOATING NOTIFICATION
function showFloatingNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px; z-index: 9999;
        background: linear-gradient(135deg, #4caf50, #45a049);
        color: white; padding: 15px 25px; border-radius: 25px;
        font-weight: bold; box-shadow: 0 8px 25px rgba(0,0,0,0.3);
        transform: translateX(400px); transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    `;
    notification.innerHTML = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.style.transform = 'translateX(0)', 100);
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 400);
    }, 3000);
}