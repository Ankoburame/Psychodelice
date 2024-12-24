const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');
const cartSidebar = document.querySelector('.cart-sidebar');
const cartToggle = document.getElementById('cart-toggle');
const closeCart = document.getElementById('close-cart');

if (bar) {
    bar.addEventListener('click', () => {
        nav.classList.add('active');
    })
}

if (close) {
    close.addEventListener('click', () =>{
        nav.classList.remove('active');
    })
}

// Ouvrir la sidebar
cartToggle.addEventListener('click', () => {
    cartSidebar.classList.add('open');
});

// Fermer la sidebar
closeCart.addEventListener('click', () => {
    cartSidebar.classList.remove('open');
});
