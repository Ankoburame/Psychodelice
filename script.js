// Gestion du menu de navigation
const cartSidebar = document.querySelector('.cart-sidebar');
const cartToggle = document.getElementById('cart-toggle');
const closeCart = document.getElementById('close-cart');

// Vérifier si les éléments existent avant d'ajouter les écouteurs d'événements
if (cartToggle) {
    cartToggle.addEventListener('click', () => {
        cartSidebar.classList.add('open');
    });
}

if (closeCart) {
    closeCart.addEventListener('click', () => {
        cartSidebar.classList.remove('open');
    });
}

// Attendre que le DOM soit chargé
document.addEventListener("DOMContentLoaded", () => {
    ready();
    loadCart();
    loadCartTable(); // affichage dans #cart
});

function ready() {
    document.querySelectorAll('.cart-remove').forEach(button => {
        button.addEventListener('click', removeCartItem);
    });

    document.querySelectorAll('.cart-quantity').forEach(input => {
        input.addEventListener('change', quantityChanged);
    });

    document.querySelectorAll('.add-cart').forEach(button => {
        button.addEventListener('click', addCartClicked);
    });
}

// Supprimer un produit du panier
function removeCartItem(event) {
    event.target.closest('.cart-box').remove();
    updateTotal();
    saveCart();
}

// Modifier la quantité de produits
function quantityChanged(event) {
    if (isNaN(event.target.value) || event.target.value <= 0) {
        event.target.value = 1;
    }
    updateTotal();
    saveCart();
}

// Ajouter un produit au panier
function addCartClicked(event) {
    const product = event.target.closest(".single-pro-details");
    const title = product.querySelector("h4").innerText;
    const price = product.querySelector(".product-price").innerText.trim();
    const productImg = document.getElementById("MainImg").src;

    addProductToCart(title, price, productImg);
    updateTotal();
}

function addProductToCart(title, price, productImg) {
    const cartItems = document.querySelector('.cart-content');
    const cartItemNames = cartItems.querySelectorAll('.cart-product-title');

    for (let itemName of cartItemNames) {
        if (itemName.innerText === title) {
            alert('Ce produit est déjà dans votre panier.');
            return;
        }
    }

    const cartShopBox = document.createElement('div');
    cartShopBox.classList.add('cart-box');
    cartShopBox.innerHTML = `
        <img src="${productImg}" alt="" class="cart-img">
        <div class="details-box">
            <div class="cart-product-title">${title}</div>
            <div class="cart-price">${price}</div>
            <input type="number" value="1" class="cart-quantity" min="1">
        </div>
        <i class="fa-solid fa-trash cart-remove"></i>`;

    cartItems.append(cartShopBox);

    cartShopBox.querySelector('.cart-remove').addEventListener('click', removeCartItem);
    cartShopBox.querySelector('.cart-quantity').addEventListener('change', quantityChanged);

    updateTotal();
    saveCart();
}

// Mettre à jour le total
function updateTotal() {
    const cartContent = document.querySelector('.cart-content');
    const cartBoxes = cartContent.querySelectorAll('.cart-box');
    let total = 0;

    cartBoxes.forEach(cartBox => {
        const priceElement = cartBox.querySelector('.cart-price');
        const quantityElement = cartBox.querySelector('.cart-quantity');

        let price = parseFloat(priceElement.innerText.replace('€', '').replace(',', '.'));
        let quantity = parseInt(quantityElement.value);

        if (!isNaN(price) && !isNaN(quantity)) {
            total += price * quantity;
        }
    });

    document.querySelector('.total-price').innerText = `${total.toFixed(2)}€`;
    saveCart();
}

// Sauvegarder le panier
function saveCart() {
    const cartContent = document.querySelector('.cart-content');
    const cartBoxes = cartContent.querySelectorAll('.cart-box');
    let cart = [];

    cartBoxes.forEach(cartBox => {
        let title = cartBox.querySelector('.cart-product-title').innerText;
        let price = cartBox.querySelector('.cart-price').innerText.replace('€', '').replace(',', '.');
        let imgSrc = cartBox.querySelector('.cart-img').src;
        let quantity = cartBox.querySelector('.cart-quantity').value;

        cart.push({
            title,
            price: parseFloat(price),
            imgSrc,
            quantity: parseInt(quantity)
        });
    });

    localStorage.setItem('cart', JSON.stringify(cart));
}

// Charger les éléments du panier dans la sidebar
function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItems = document.querySelector('.cart-content');
    if (!cartItems) return;
    cartItems.innerHTML = "";

    cart.forEach(item => {
        const cartShopBox = document.createElement('div');
        cartShopBox.classList.add('cart-box');
        cartShopBox.innerHTML = `
            <img src="${item.imgSrc}" alt="" class="cart-img">
            <div class="details-box">
                <div class="cart-product-title">${item.title}</div>
                <div class="cart-price">${item.price.toFixed(2)}€</div>
                <input type="number" value="${item.quantity}" class="cart-quantity" min="1">
            </div>
            <i class="fa-solid fa-trash cart-remove"></i>`;

        cartItems.append(cartShopBox);

        cartShopBox.querySelector('.cart-remove').addEventListener('click', removeCartItem);
        cartShopBox.querySelector('.cart-quantity').addEventListener('change', quantityChanged);
    });

    updateTotal();
}

// Charger les éléments du panier dans la section #cart
function loadCartTable() {
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    const cartTableBody = document.querySelector("#cart tbody");
    if (!cartTableBody) return;

    cartTableBody.innerHTML = "";
    let totalPanier = 0;

    cartItems.forEach(item => {
        const row = document.createElement("tr");

        const itemTotal = item.price * item.quantity;
        totalPanier += itemTotal;

        row.innerHTML = `
            <td><i class="fa-regular fa-square-minus"></i></td>
            <td><img src="${item.imgSrc}" width="50" height="50" alt="${item.title}"></td>
            <td>${item.title}</td>
            <td>${item.price.toFixed(2)}€</td>
            <td>${item.quantity}</td>
            <td>${itemTotal.toFixed(2)}€</td>
        `;

        cartTableBody.appendChild(row);
    });
}
