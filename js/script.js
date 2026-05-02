// LOGIN PAGE
const loginForm = document.getElementById("loginForm");
const DEMO_EMAIL = "kasir@gmail.com";
const DEMO_PASSWORD = "12345";

function togglePassword() {
  const passwordInput = document.getElementById("password");
  passwordInput.type =
    passwordInput.type === "password" ? "text" : "password";
}

if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    const btn = loginForm.querySelector("button");
    btn.innerHTML = "Signing in...";
    btn.disabled = true;

    setTimeout(() => {
      if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
        alert("Login successful!");

        window.location.href = "index.html";
      } else {
        alert("Invalid email or password.");
      }

      btn.innerHTML = `<i class="fa-solid fa-right-to-bracket"></i> Sign In`;
      btn.disabled = false;
    }, 1000);
  });
}

const demoBtn = document.querySelector(".btn-demo");

if (demoBtn) {
  demoBtn.addEventListener("click", () => {
    document.getElementById("email").value = DEMO_EMAIL;
    document.getElementById("password").value = DEMO_PASSWORD;
  });
}

// PRODUCT
const products = [
  { id: 1, name: "Espresso", price: 1.2, img: "assets/esspresso.png", category: "minuman" },
  { id: 2, name: "Americano", price: 1.3, img: "assets/americano.jpg", category: "minuman" },
  { id: 3, name: "Latte", price: 1.7, img: "assets/latte.jpg", category: "minuman" },

  { id: 4, name: "Croissant", price: 1.0, img: "assets/croissant.jpg", category: "snack" },
  { id: 5, name: "Waffle", price: 1.3, img: "assets/waffel.jpg", category: "snack" },
  { id: 6, name: "French Fries", price: 1.0, img: "assets/french_fries.jpg", category: "snack" },

  { id: 7, name: "Sandwich", price: 1.3, img: "assets/sandwich.jpg", category: "makanan" },
  { id: 8, name: "Spaghetti", price: 2.0, img: "assets/spaghetti.jpg", category: "makanan" },
  { id: 9, name: "Fried Rice", price: 1.2, img: "assets/nasi_goreng.jpg", category: "makanan" },
  { id: 10, name: "Crispy Chicken", price: 1.3, img: "assets/ayam_geprek.jpg", category: "makanan" },
  { id: 11, name: "Fried Noodles", price: 1.0, img: "assets/mie_goreng.jpg", category: "makanan" }
];


let cart = JSON.parse(localStorage.getItem("cart")) || [];
let currentCategory = "all";
let todaySales = 0;
let totalOrders = 0;


const productList = document.getElementById("productList");
const cartItems = document.getElementById("cartItems");
const totalEl = document.getElementById("total");
const payInput = document.getElementById("pay");
const changeEl = document.getElementById("change");
const discountInput = document.getElementById("diskon");


function formatRupiah(num) {
  return "$ " + num.toLocaleString("en-US");
}


function filterProduct(e, category) {
  currentCategory = category;

  document.querySelectorAll(".filter button").forEach(btn => {
    btn.classList.remove("active");
  });

  e.target.classList.add("active");

  renderProducts();
}


function renderProducts() {
  productList.innerHTML = "";

  let filtered = products;

  if (currentCategory !== "all") {
    filtered = products.filter(p => p.category === currentCategory);
  }

  if (filtered.length === 0) {
    productList.innerHTML = "<p>No Product</p>";
    return;
  }

  filtered.forEach(p => {
    productList.innerHTML += `
      <div class="product">

        <div class="product-img">
          <img src="${p.img}" alt="${p.name}">
        </div>

        <div class="product-info">
          <p class="product-name">${p.name}</p>

          <div class="product-bottom">
            <span class="product-price">${formatRupiah(p.price)}</span>
            <button class="add-btn" onclick="addToCart(${p.id})">+</button>
          </div>
        </div>

      </div>
    `;
  });
}


function addToCart(id) {
  const item = cart.find(i => i.id === id);

  if (item) {
    item.qty++;
  } else {
    const product = products.find(p => p.id === id);
    cart.push({ ...product, qty: 1 });
  }

  saveCart();
  renderCart();
}

function toggleCart() {
  document.querySelector(".cart").classList.toggle("show");
}


function renderCart() {
  cartItems.innerHTML = "";
  let subtotal = 0;

  if (cart.length === 0) {
    cartItems.innerHTML = "<p>Your cart is empty</p>";
  }

  cart.forEach(item => {
    subtotal += item.price * item.qty;

    cartItems.innerHTML += `
      <div class="cart-item">
        <div>
          <p>${item.name}</p>
          <small>${formatRupiah(item.price)}</small>
        </div>

        <div class="qty">
          <button onclick="changeQty(${item.id}, -1)">-</button>
          <span>${item.qty}</span>
          <button onclick="changeQty(${item.id}, 1)">+</button>
        </div>

        <button class="delete-btn" onclick="removeItem(${item.id})">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    `;
  });

  const discountPercent = parseFloat(discountInput.value) || 0;
  const discountAmount = subtotal * (discountPercent / 100);

  const total = subtotal - discountAmount;

  totalEl.innerText = formatRupiah(total);
}


function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);

  item.qty += delta;

  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== id);
  }

  saveCart();
  renderCart();
}


function removeItem(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  renderCart();
}


payInput.addEventListener("input", () => {
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const discountPercent = parseFloat(discountInput.value) || 0;
  const discountAmount = subtotal * (discountPercent / 100);
  const total = subtotal - discountAmount;
  const pay = parseInt(payInput.value) || 0;

  const change = pay - total;

  changeEl.innerText = formatRupiah(change < 0 ? 0 : change);
});

discountInput.addEventListener("input", () => {
  renderCart();

  payInput.dispatchEvent(new Event("input"));
});


function checkout() {
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const discountPercent = parseFloat(discountInput.value) || 0;
  const discountAmount = subtotal * (discountPercent / 100);
  const total = subtotal - discountAmount;

  const pay = parseFloat(payInput.value) || 0;

  if (cart.length === 0) {
    alert("Cart is empty!");
    return;
  }

  if (pay < total) {
    alert("Not enough money!");
    return;
  }

  const change = pay - total;

  todaySales += total;
  totalOrders += 1;

  document.getElementById("todaySales").innerText = "$ " + todaySales.toLocaleString();
  document.getElementById("totalOrders").innerText = totalOrders;

  localStorage.setItem("todaySales", todaySales);
  localStorage.setItem("totalOrders", totalOrders);

  showReceipt(total, pay, change, [...cart]);
}

function resetCart() {
  cart = [];
  saveCart();
  renderCart();

  payInput.value = "";
  changeEl.innerText = "$ 0";
  discountInput.value = 0;
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

const links = document.querySelectorAll(".menu a");
links.forEach(link => {
  if (link.href === window.location.href) {
    link.parentElement.classList.add("active");
  }
});

renderProducts();
renderCart();

document.getElementById("todaySales").innerText = "$ " + todaySales.toLocaleString();
document.getElementById("totalOrders").innerText = totalOrders;


function showReceipt(total, pay, change, items) {
  const modal = document.getElementById("receiptModal");
  const itemsBox = document.getElementById("receiptItems");

  window.lastReceiptItems = items;

  itemsBox.innerHTML = "";

  items.forEach(item => {
    itemsBox.innerHTML += `
      <div>
        <span>${item.name} x${item.qty}</span>
        <span>${formatRupiah(item.price * item.qty)}</span>
      </div>
    `;
  });

  document.getElementById("receiptTotal").innerText = formatRupiah(total);
  document.getElementById("receiptPay").innerText = formatRupiah(pay);
  document.getElementById("receiptChange").innerText = formatRupiah(change);

  modal.classList.add("show");

  cart = [];
  saveCart();
  renderCart();
}

function updateClock() {
  const now = new Date();
  const time = now.toLocaleTimeString();
  document.getElementById("liveClock").innerText = time;
}

setInterval(updateClock, 1000);
updateClock();

function printReceipt() {
  let printWindow = window.open("", "_blank");

  let itemsHTML = "";
  const items = window.lastReceiptItems || [];

  items.forEach(item => {
    itemsHTML += `
      <div class="row">
        <span>${item.name} x${item.qty}</span>
        <span>$ ${(item.price * item.qty).toLocaleString()}</span>
      </div>
    `;
  });

  printWindow.document.write(`
    <html>
      <head>
        <title>Struk</title>
        <style>
          body {
            font-family: monospace;
            padding: 20px;
            max-width: 320px;
            margin: auto;
          }

          h2 {
            text-align: center;
            margin-bottom: 5px;
          }

          .row {
            display: flex;
            justify-content: space-between;
            margin: 4px 0;
          }

          hr {
            border: none;
            border-top: 1px dashed #000;
            margin: 10px 0;
          }
        </style>
      </head>
      <body>

        <h2>NovaPos</h2>
        <p>${new Date().toLocaleString()}</p>
        <p>Cashier: Indah</p>

        <hr>

        ${itemsHTML}

        <hr>

        <div class="row"><b>Total</b><b>${document.getElementById("receiptTotal").innerText}</b></div>
        <div class="row"><span>Cash</span><span>${document.getElementById("receiptPay").innerText}</span></div>
        <div class="row"><span>Change</span><span>${document.getElementById("receiptChange").innerText}</span></div>

        <script>
          window.onload = function() {
            window.print();
            window.close();
          }
        <\/script>

      </body>
    </html>
  `);

  printWindow.document.close();
}

function closeReceipt() {
  const modal = document.getElementById("receiptModal");
  modal.classList.remove("show");
}

function toggleDropdown() {
  document.getElementById("dropdownMenu").classList.toggle("show");
}

window.addEventListener("click", function(e) {
  const dropdown = document.querySelector(".user-dropdown");
  
  if (!dropdown) return;

  if (!dropdown.contains(e.target)) {
    document.getElementById("dropdownMenu").classList.remove("show");
  }
});

// lOGOUT
function logout() {
  alert("Logged out!");
  window.location.href = "login.html";
}