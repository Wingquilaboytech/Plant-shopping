"use strict";

const plants = [
  {
    id: 1,
    name: "Lavender",
    description: "Aromatic plant with purple flowers.",
    img: "https://www.alivitpharm.com/wp-content/uploads/2023/02/lavender.png",
    cost: 250,
    type: "Aromatic",
  },
  {
    id: 2,
    name: "Basil",
    description: "Aromatic herb great for cooking.",
    img: "https://th.bing.com/th/id/OIP.24w0iALFesN6gBFsVRV6ZQAAAA?w=264&h=197&c=7&r=0&o=7&pid=1.7&rm=3",
    cost: 150,
    type: "Aromatic",
  },
  {
    id: 3,
    name: "Jasmine",
    description: "Sweetly aromatic plant with white flowers.",
    img: "https://myplantin.com/_next/image?url=https:%2F%2Fstrapi.myplantin.com%2FCommon_Jasmine_d8be45b416.webp&w=1920&q=75",
    cost: 320,
    type: "Aromatic",
  },
  {
    id: 4,
    name: "Aloe Vera",
    description: "Medicinal plant known for soothing skin.",
    img: "https://hips.hearstapps.com/hmg-prod/images/aloe-vera-plant-outside-jpg-1522875135.jpg",
    cost: 180,
    type: "Medicinal",
  },
  {
    id: 5,
    name: "Neem",
    description: "Medicinal plant with antibacterial properties.",
    img: "https://images.freeimages.com/images/large-previews/6b8/neem-tree-1639620.jpg",
    cost: 220,
    type: "Medicinal",
  },
  {
    id: 6,
    name: "Tulsi",
    description: "Medicinal plant considered holy and healing.",
    img: "https://tse2.mm.bing.net/th/id/OIP.C0RFaYOUa35NQbQ1cO3TFgAAAA?r=0&w=300&h=225&rs=1&pid=ImgDetMain&o=7&rm=3",
    cost: 200,
    type: "Medicinal",
  },
];

let cart = {}; // key: plant.id, value: { ...plant, quantity }

const app = document.getElementById("app");
const cartCountEl = document.getElementById("cart-count");
const navLinks = document.querySelectorAll("nav .nav-links a");

function saveCart() {
  localStorage.setItem("paradiseCart", JSON.stringify(cart));
}

function loadCart() {
  const saved = localStorage.getItem("paradiseCart");
  if (saved) {
    cart = JSON.parse(saved);
  }
}

function updateCartCount() {
  const count = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
  cartCountEl.textContent = count;
}

function setActiveLink(page) {
  navLinks.forEach((link) => {
    if (link.dataset.page === page) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

function renderLanding() {
  setActiveLink("landing");
  app.innerHTML = `
    <div class="landing">
      <h1>Welcome to Paradise Nursery!</h1>
      <p>Your one-stop shop for house plants</p>
      <button id="browseBtn">Browse Plants</button>
    </div>
  `;
  document.getElementById("browseBtn").addEventListener("click", () => {
    renderProducts();
  });
}

function renderProducts() {
  setActiveLink("products");

  const aromaticPlants = plants.filter((p) => p.type === "Aromatic");
  const medicinalPlants = plants.filter((p) => p.type === "Medicinal");

  app.innerHTML = `
    <section class="section">
      <h2>Aromatic Plants</h2>
      <div class="plant-grid" id="aromatic-grid"></div>
    </section>
    <section class="section">
      <h2>Medicinal Plants</h2>
      <div class="plant-grid" id="medicinal-grid"></div>
    </section>
  `;

  function createPlantCard(plant) {
    const card = document.createElement("div");
    card.className = "plant-card";
    card.innerHTML = `
      <img src="${plant.img}" alt="${plant.name}" />
      <h3>${plant.name}</h3>
      <p>${plant.description}</p>
      <div class="price">₹${plant.cost}</div>
      <button>Add to Cart</button>
    `;
    const btn = card.querySelector("button");
    btn.onclick = () => {
      addToCart(plant.id);
    };
    return card;
  }

  const aromaticGrid = document.getElementById("aromatic-grid");
  aromaticPlants.forEach((plant) => aromaticGrid.appendChild(createPlantCard(plant)));

  const medicinalGrid = document.getElementById("medicinal-grid");
  medicinalPlants.forEach((plant) => medicinalGrid.appendChild(createPlantCard(plant)));
}

function renderCart() {
  setActiveLink("cart");

  app.innerHTML = `<div class="cart-container"></div>`;
  const container = app.querySelector(".cart-container");

  const cartItems = Object.values(cart);

  if (cartItems.length === 0) {
    container.innerHTML = `<div class="cart-empty">
      Your cart is empty! <a href="#" id="shopNow">Shop now</a>
    </div>`;
    document.getElementById("shopNow").addEventListener("click", (e) => {
      e.preventDefault();
      renderProducts();
    });
    return;
  }

  function createCartCard(item) {
    const card = document.createElement("div");
    card.className = "cart-card";
    card.innerHTML = `
      <img src="${item.img}" alt="${item.name}" />
      <div class="cart-details">
        <h4>${item.name}</h4>
        <div class="unit-price">Unit Price: ₹${item.cost}</div>
        <div class="quantity-controls">
          <button class="dec" ${item.quantity <= 1 ? "disabled" : ""}>-</button>
          <span>${item.quantity}</span>
          <button class="inc">+</button>
        </div>
        <div class="total-price">Total: ₹${item.cost * item.quantity}</div>
        <button class="delete-button">Delete</button>
      </div>
    `;

    const decBtn = card.querySelector(".dec");
    const incBtn = card.querySelector(".inc");
    const deleteBtn = card.querySelector(".delete-button");

    decBtn.onclick = () => updateQuantity(item.id, item.quantity - 1);
    incBtn.onclick = () => updateQuantity(item.id, item.quantity + 1);
    deleteBtn.onclick = () => removeFromCart(item.id);

    return card;
  }

  cartItems.forEach((item) => container.appendChild(createCartCard(item)));

  // Footer with total and buttons
  const footer = document.createElement("div");
  footer.className = "cart-footer";
  const totalCost = cartItems.reduce((sum, item) => sum + item.cost * item.quantity, 0);

  footer.innerHTML = `
    <div>Total Cost: ₹${totalCost}</div>
    <div class="cart-actions">
      <button id="continueShoppingBtn">Continue Shopping</button>
      <button id="checkoutBtn">Checkout</button>
    </div>
  `;
  container.appendChild(footer);

  document.getElementById("continueShoppingBtn").addEventListener("click", () => {
    renderProducts();
  });

  document.getElementById("checkoutBtn").addEventListener("click", () => {
    alert("Thank you for your purchase! Checkout functionality coming soon.");
  });
}

function addToCart(id) {
  const plant = plants.find((p) => p.id === id);
  if (!plant) return;

  if (cart[id]) {
    cart[id].quantity += 1;
  } else {
    cart[id] = { ...plant, quantity: 1 };
  }

  updateCartCount();
  saveCart();
  alert(`Added ${plant.name} to the cart!`);
}

function updateQuantity(id, quantity) {
  if (quantity < 1) return;

  if (cart[id]) {
    cart[id].quantity = quantity;
    // If quantity zero, remove from cart handled outside
  }

  saveCart();
  updateCartCount();
  renderCart();
}

function removeFromCart(id) {
  delete cart[id];
  saveCart();
  updateCartCount();
  renderCart();
}

function handleNavClick(event) {
  event.preventDefault();
  const page = event.target.dataset.page;
  if (!page) return;
  switch (page) {
    case "landing":
      renderLanding();
      break;
    case "products":
      renderProducts();
      break;
    case "cart":
      renderCart();
      break;
  }
}

navLinks.forEach((link) => link.addEventListener("click", handleNavClick));

function init() {
  loadCart();
  updateCartCount();
  renderLanding();
}

init();
