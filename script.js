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
document.addEventListener("DOMContentLoaded", ready);

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
    saveCart()
}

// Modifier la quantité de produits
function quantityChanged(event) {
    if (isNaN(event.target.value) || event.target.value <= 0) {
        event.target.value = 1;
    }
    updateTotal();
    saveCart()
}

// Ajouter un produit au panier
function addCartClicked(event) {
    const product = event.target.closest(".single-pro-details");
    const title = product.querySelector("h4").innerText;
    const price = product.querySelector(".product-price").innerText.trim();
    const productImg = document.getElementById("MainImg").src;

    addProductToCart(title, price, productImg);
    updateTotal(); // Assurez-vous que le total est mis à jour après l'ajout
}

function addProductToCart(title, price, productImg) {
    const cartItems = document.querySelector('.cart-content');
    const cartItemNames = cartItems.querySelectorAll('.cart-product-title');

    // Vérifier si le produit est déjà dans le panier
    for (let itemName of cartItemNames) {
        if (itemName.innerText === title) {
            alert('Ce produit est déjà dans votre panier.');
            return;
        }
    }

    // Créer un nouvel élément pour le panier
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

    // Ajouter les événements aux nouveaux éléments du panier
    cartShopBox.querySelector('.cart-remove').addEventListener('click', removeCartItem);
    cartShopBox.querySelector('.cart-quantity').addEventListener('change', quantityChanged);

    updateTotal(); // Mise à jour du total après l'ajout
    saveCart()
}

// Mettre à jour le total
function updateTotal() {
    const cartContent = document.querySelector('.cart-content');
    const cartBoxes = cartContent.querySelectorAll('.cart-box');
    let total = 0;

    cartBoxes.forEach(cartBox => {
        const priceElement = cartBox.querySelector('.cart-price');
        const quantityElement = cartBox.querySelector('.cart-quantity');

        let priceText = priceElement.innerText.replace('€', '').trim();
        let price = parseFloat(priceText.replace(',', '.')); // Corrige les prix avec virgules
        let quantity = parseInt(quantityElement.value);

        console.log("Prix récupéré:", price, "Quantité:", quantity); // Débogage

        if (!isNaN(price) && !isNaN(quantity)) {
            total += price * quantity;
        }
    });

    document.querySelector('.total-price').innerText = `${total.toFixed(2)}€`;
    saveCart(); // Sauvegarde après mise à jour
}


function saveCart() {
    const cartContent = document.querySelector('.cart-content');
    const cartBoxes = cartContent.querySelectorAll('.cart-box');
    let cart = [];

    cartBoxes.forEach(cartBox => {
        let title = cartBox.querySelector('.cart-product-title').innerText;
        let price = cartBox.querySelector('.cart-price').innerText;
        let imgSrc = cartBox.querySelector('.cart-img').src;
        let quantity = cartBox.querySelector('.cart-quantity').value;

        cart.push({ title, price, imgSrc, quantity });
    });

    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItems = document.querySelector('.cart-content');
    cartItems.innerHTML = ""; // Vider le panier avant de recharger

    cart.forEach(item => {
        const cartShopBox = document.createElement('div');
        cartShopBox.classList.add('cart-box');
        cartShopBox.innerHTML = `
            <img src="${item.imgSrc}" alt="" class="cart-img">
            <div class="details-box">
                <div class="cart-product-title">${item.title}</div>
                <div class="cart-price">${item.price}</div>
                <input type="number" value="${item.quantity}" class="cart-quantity" min="1">
            </div>
            <i class="fa-solid fa-trash cart-remove"></i>`;

        cartItems.append(cartShopBox);

        // Ajouter les événements
        cartShopBox.querySelector('.cart-remove').addEventListener('click', removeCartItem);
        cartShopBox.querySelector('.cart-quantity').addEventListener('change', quantityChanged);
    });

    updateTotal();
}

// Charger le panier au démarrage
document.addEventListener("DOMContentLoaded", () => {
    ready();
    loadCart();
});

