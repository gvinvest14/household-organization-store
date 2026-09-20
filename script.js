const products = [
  {
    id: 1,
    name: "Clear Stack Storage Bins",
    category: "kitchen",
    price: 24,
    rating: 4.9,
    badge: "Best seller",
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    name: "Wooden Closet Organizer",
    category: "closet",
    price: 89,
    rating: 4.8,
    badge: "New",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    name: "Pantry Shelf Risers",
    category: "kitchen",
    price: 32,
    rating: 4.7,
    badge: "Popular",
    image:
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 4,
    name: "Desk Cable Management Kit",
    category: "office",
    price: 27,
    rating: 4.9,
    badge: "Top rated",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 5,
    name: "Entryway Hall Tree",
    category: "entryway",
    price: 110,
    rating: 4.8,
    badge: "Editor pick",
    image:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 6,
    name: "Under-Bed Storage Drawers",
    category: "closet",
    price: 58,
    rating: 4.9,
    badge: "Must have",
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 7,
    name: "Magnetic Label Set",
    category: "kitchen",
    price: 18,
    rating: 4.6,
    badge: "Value",
    image:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 8,
    name: "File Organizer Tray",
    category: "office",
    price: 35,
    rating: 4.8,
    badge: "New",
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80",
  },
];

const productGrid = document.getElementById("product-grid");
const cartItemsEl = document.getElementById("cart-items");
const cartCountEl = document.querySelector(".cart-count");
const subtotalEl = document.getElementById("subtotal");
const cartPanel = document.querySelector(".cart-panel");
const cartOverlay = document.querySelector(".cart-overlay");
const filterButtons = document.querySelectorAll(".filter-btn");

let activeFilter = "all";
let cart = [];

function formatPrice(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function getFilteredProducts() {
  if (activeFilter === "all") return products;
  return products.filter((product) => product.category === activeFilter);
}

function renderProducts() {
  const filteredProducts = getFilteredProducts();

  productGrid.innerHTML = filteredProducts
    .map(
      (product) => `
        <article class="product-card">
          <div class="product-image">
            <img src="${product.image}" alt="${product.name}" />
            <span class="product-badge">${product.badge}</span>
          </div>
          <div class="product-info">
            <div class="product-meta">
              <span class="product-category">${product.category}</span>
              <span class="product-rating">★ ${product.rating}</span>
            </div>
            <h3 class="product-name">${product.name}</h3>
            <div class="product-footer">
              <span class="price">${formatPrice(product.price)}</span>
              <button class="add-to-cart" data-id="${product.id}">Add to cart</button>
            </div>
          </div>
        </article>
      `
    )
    .join("");
}

function addToCart(productId) {
  const selectedProduct = products.find((product) => product.id === Number(productId));
  if (!selectedProduct) return;

  const existingItem = cart.find((item) => item.id === Number(productId));

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...selectedProduct, quantity: 1 });
  }

  updateCart();
  openCart();
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== Number(productId));
  updateCart();
}

function changeQuantity(productId, delta) {
  const item = cart.find((cartItem) => cartItem.id === Number(productId));
  if (!item) return;

  item.quantity += delta;

  if (item.quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  updateCart();
}

function updateCart() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountEl.textContent = totalItems;

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  subtotalEl.textContent = formatPrice(subtotal);

  if (!cart.length) {
    cartItemsEl.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
    return;
  }

  cartItemsEl.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" />
          <div>
            <h4>${item.name}</h4>
            <small>${formatPrice(item.price)} each</small>
            <div class="qty-control">
              <button aria-label="Decrease quantity" data-action="decrease" data-id="${item.id}">−</button>
              <span>${item.quantity}</span>
              <button aria-label="Increase quantity" data-action="increase" data-id="${item.id}">+</button>
            </div>
          </div>
          <div class="item-price">
            <strong>${formatPrice(item.price * item.quantity)}</strong>
            <button class="remove-item" data-id="${item.id}">Remove</button>
          </div>
        </div>
      `
    )
    .join("");
}

function openCart() {
  cartPanel.classList.add("open");
  cartOverlay.classList.add("visible");
}

function closeCart() {
  cartPanel.classList.remove("open");
  cartOverlay.classList.remove("visible");
}

function handleFilterClick(event) {
  const target = event.currentTarget;
  activeFilter = target.dataset.filter;

  filterButtons.forEach((button) => {
    button.classList.toggle("is-active", button === target);
  });

  renderProducts();
}

productGrid.addEventListener("click", (event) => {
  const button = event.target.closest(".add-to-cart");
  if (!button) return;

  addToCart(button.dataset.id);
});

cartItemsEl.addEventListener("click", (event) => {
  const removeButton = event.target.closest(".remove-item");
  if (removeButton) {
    removeFromCart(removeButton.dataset.id);
    return;
  }

  const quantityButton = event.target.closest("[data-action]");
  if (quantityButton) {
    const delta = quantityButton.dataset.action === "increase" ? 1 : -1;
    changeQuantity(quantityButton.dataset.id, delta);
  }
});

document.querySelector(".cart-btn").addEventListener("click", openCart);
document.querySelector(".close-cart").addEventListener("click", closeCart);
document.querySelector(".cart-overlay").addEventListener("click", closeCart);
document.querySelector(".checkout-btn").addEventListener("click", () => {
  if (!cart.length) {
    alert("Your cart is empty. Add a few organization essentials first.");
    return;
  }
  alert("Checkout coming soon! This demo is ready for Stripe or Shopify integration.");
});

filterButtons.forEach((button) => button.addEventListener("click", handleFilterClick));

renderProducts();
updateCart();
