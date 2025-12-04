
let cart = JSON.parse(localStorage.getItem("cateringCart") || "[]");

let totalPrice = 0;


document.addEventListener("DOMContentLoaded", () => {
    initNavToggle();
    updateCartUI();
});

function initNavToggle() {
    const navToggle = document.getElementById("nav-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (navToggle && navLinks) {
        navToggle.addEventListener("click", () => {
            navLinks.classList.toggle("open");
        });
    }
}


function toggleCart(open) {
    const drawer = document.getElementById("cart-drawer");
    const overlay = document.getElementById("cart-overlay");

    if (!drawer || !overlay) return;

    if (open) {
        drawer.classList.add("open");
        overlay.classList.add("open");
    } else {
        drawer.classList.remove("open");
        overlay.classList.remove("open");
    }
}


function addToCart(name, price, qtyId) {
    const qtyInput = document.getElementById(qtyId);
    let quantity = qtyInput ? parseInt(qtyInput.value, 10) : 1;

    if (isNaN(quantity) || quantity <= 0) {
        alert("Please enter a valid quantity.");
        return;
    }

    price = Number(price);

    
    const existingIndex = cart.findIndex(
        item => item.name === name && item.price === price
    );

    if (existingIndex !== -1) {
        cart[existingIndex].quantity += quantity;
    } else {
        cart.push({ name, price, quantity });
    }

    saveCart();
    updateCartUI();
    toggleCart(true); 
}

function removeItem(index) {
    if (index < 0 || index >= cart.length) return;
    cart.splice(index, 1);
    saveCart();
    updateCartUI();
}


function placeOrder() {
    if (!cart.length) {
        alert("Your cart is empty!");
        return;
    }

    const total = calculateTotal();
    alert(`Order placed successfully! Total Amount: Rs ${total.toFixed(2)}`);

    cart = [];
    saveCart();
    updateCartUI();
    toggleCart(false);
}


function updateCartUI() {
    const cartList = document.getElementById("cart-items");
    const totalPriceEl = document.getElementById("total-price");
    const cartCountEl = document.getElementById("cart-count");

    if (!cartList || !totalPriceEl || !cartCountEl) return;

    cartList.innerHTML = "";
    const total = calculateTotal();

    cart.forEach((item, index) => {
        const li = document.createElement("li");
        li.classList.add("cart-item");

        li.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-details">
                    ${item.quantity} x Rs${item.price} = Rs${(item.quantity * item.price).toFixed(2)}
                </div>
            </div>
            <button class="cart-remove-btn" onclick="removeItem(${index})">Remove</button>
        `;

        cartList.appendChild(li);
    });

    totalPriceEl.textContent = total.toFixed(2);
    cartCountEl.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}


function calculateTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function saveCart() {
    localStorage.setItem("cateringCart", JSON.stringify(cart));
}
