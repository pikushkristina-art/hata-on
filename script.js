const products = [
  {
    id: "mini-ups",
    name: "Mini UPS DC1018P для роутера",
    category: "internet",
    type: "Стабільний інтернет",
    description: "Автоматичне резервне живлення 5/9/12V та POE.",
    price: 1299,
    badge: "ХІТ",
    code: "Wi‑Fi",
    codeSmall: "без пауз",
    colors: ["#dce8d2", "rgba(255,255,255,.74)", "#1b3425"]
  },
  {
    id: "motion-light",
    name: "Світильник 50 LED із датчиком руху",
    category: "light",
    type: "Автономне світло",
    description: "Type‑C, автоматичне ввімкнення та монтаж без свердління.",
    price: 399,
    badge: "ВИБІР ХАТА.ON",
    code: "Light",
    codeSmall: "50 LED",
    colors: ["#f1e5c6", "rgba(255,247,192,.9)", "#755422"]
  },
  {
    id: "usb-blanket",
    name: "USB‑плед із 5 зонами нагріву",
    category: "warmth",
    type: "Тепло",
    description: "Три режими температури, живлення від power bank.",
    price: 999,
    badge: "БЕСТСЕЛЕР",
    code: "Warm",
    codeSmall: "5 зон",
    colors: ["#ead8cc", "rgba(255,235,218,.8)", "#7d482f"]
  },
  {
    id: "awei-pa12",
    name: "Power bank Awei PA12 30 000 mAh",
    category: "power",
    type: "Заряд",
    description: "Швидка зарядка до 22.5W для телефону й USB‑пристроїв.",
    price: 1199,
    badge: "ОПТИМАЛЬНИЙ",
    code: "30K",
    codeSmall: "22.5 W",
    colors: ["#d8dfdc", "rgba(255,255,255,.76)", "#24312a"]
  },
  {
    id: "emergency-light",
    name: "Аварійний світильник 60 LED",
    category: "light",
    type: "Автономне світло",
    description: "Яскраве переносне світло для кімнати, кухні чи укриття.",
    price: 399,
    badge: "ДОСТУПНИЙ",
    code: "60",
    codeSmall: "LED",
    colors: ["#eee8d2", "rgba(255,248,204,.82)", "#74612e"]
  },
  {
    id: "heated-vest",
    name: "Жилет із USB‑підігрівом, 9 зон",
    category: "warmth",
    type: "Тепло",
    description: "Локальний підігрів спини й корпусу вдома та надворі.",
    price: 999,
    badge: "9 ЗОН",
    code: "Heat",
    codeSmall: "жилет",
    colors: ["#dad7d2", "rgba(255,255,255,.68)", "#292929"]
  },
  {
    id: "heated-insoles",
    name: "USB‑устілки з підігрівом",
    category: "warmth",
    type: "Тепло",
    description: "Працюють від power bank — для дому, роботи й прогулянок.",
    price: 449,
    badge: "КОМПАКТНІ",
    code: "Feet",
    codeSmall: "до 45°C*",
    colors: ["#e8d8ca", "rgba(255,240,222,.8)", "#734c37"]
  },
  {
    id: "max-power",
    name: "Power bank 60 000 mAh, PD 65W + DC",
    category: "power",
    type: "Максимальна автономність",
    description: "Для ноутбука, роутера, освітлення та щоденної техніки.",
    price: 4799,
    badge: "MAX",
    code: "65W",
    codeSmall: "PD + DC",
    colors: ["#d4ddd6", "rgba(255,255,255,.66)", "#183023"]
  },
  {
    id: "warm-evening",
    name: "Набір «Теплий вечір»",
    category: "set",
    type: "Готовий набір",
    description: "USB‑плед, Awei PA12 та світильник 50 LED.",
    price: 2199,
    badge: "ЕКОНОМІЯ 398 ₴",
    code: "3×ON",
    codeSmall: "готовий набір",
    colors: ["#e7d2b4", "rgba(255,244,214,.72)", "#67462a"]
  }
];

const formatPrice = (value) => `${new Intl.NumberFormat("uk-UA").format(value)} ₴`;
const productMap = new Map(products.map((product) => [product.id, product]));
const productGrid = document.querySelector("#product-grid");
const cartDrawer = document.querySelector("#cart-drawer");
const drawerBackdrop = document.querySelector("#drawer-backdrop");
const cartItems = document.querySelector("#cart-items");
const cartEmpty = document.querySelector("#cart-empty");
const cartFooter = document.querySelector("#cart-footer");
const cartCount = document.querySelector("#cart-count");
const cartTotal = document.querySelector("#cart-total");
const checkoutDialog = document.querySelector("#checkout-dialog");
const resultDialog = document.querySelector("#result-dialog");
const toast = document.querySelector("#toast");

let cart = loadCart();
let preparedOrder = "";

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem("hata-on-cart") || "{}");
    return Object.fromEntries(Object.entries(saved).filter(([id, quantity]) => productMap.has(id) && quantity > 0));
  } catch {
    return {};
  }
}

function saveCart() {
  localStorage.setItem("hata-on-cart", JSON.stringify(cart));
}

function renderProducts(filter = "all") {
  const list = products.filter((product) => product.category !== "set");
  productGrid.innerHTML = list.map((product) => {
    const hidden = filter !== "all" && product.category !== filter;
    return `
      <article class="product-card" data-category="${product.category}" ${hidden ? "hidden" : ""}>
        <div class="product-visual" style="--visual-bg:${product.colors[0]};--visual-glow:${product.colors[1]};--visual-ink:${product.colors[2]}">
          <span class="product-badge">${product.badge}</span>
          <div class="product-code">${product.code}<small>${product.codeSmall}</small></div>
        </div>
        <div class="product-content">
          <span class="product-type">${product.type}</span>
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <div class="product-buy">
            <span class="product-price">${formatPrice(product.price)}</span>
            <button class="add-button" type="button" data-add-product="${product.id}" aria-label="Додати ${product.name} у кошик">+</button>
          </div>
        </div>
      </article>`;
  }).join("");
}

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  saveCart();
  renderCart();
  showToast("Додано у кошик");
}

function updateQuantity(id, delta) {
  if (!cart[id]) return;
  cart[id] += delta;
  if (cart[id] <= 0) delete cart[id];
  saveCart();
  renderCart();
}

function renderCart() {
  const entries = Object.entries(cart);
  const quantity = entries.reduce((sum, [, count]) => sum + count, 0);
  const total = entries.reduce((sum, [id, count]) => sum + productMap.get(id).price * count, 0);
  cartCount.textContent = quantity;
  cartEmpty.hidden = entries.length > 0;
  cartFooter.hidden = entries.length === 0;
  cartTotal.textContent = formatPrice(total);
  cartItems.innerHTML = entries.map(([id, count]) => {
    const product = productMap.get(id);
    return `
      <div class="cart-item">
        <div class="cart-thumb" style="--thumb:${product.colors[0]}">${product.code}</div>
        <div>
          <h3>${product.name}</h3>
          <b>${formatPrice(product.price * count)}</b>
          <div class="quantity">
            <button type="button" data-cart-change="-1" data-product-id="${id}" aria-label="Зменшити кількість">−</button>
            <span>${count}</span>
            <button type="button" data-cart-change="1" data-product-id="${id}" aria-label="Збільшити кількість">+</button>
          </div>
        </div>
        <button class="remove-item" type="button" data-remove-product="${id}">Видалити</button>
      </div>`;
  }).join("");
}

function openCart() {
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
  drawerBackdrop.hidden = false;
  document.body.classList.add("no-scroll");
  setTimeout(() => document.querySelector("#close-cart").focus(), 50);
}

function closeCart() {
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
  drawerBackdrop.hidden = true;
  document.body.classList.remove("no-scroll");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 1800);
}

function cartSummary() {
  const lines = Object.entries(cart).map(([id, count]) => {
    const product = productMap.get(id);
    return `• ${product.name} × ${count} — ${formatPrice(product.price * count)}`;
  });
  const total = Object.entries(cart).reduce((sum, [id, count]) => sum + productMap.get(id).price * count, 0);
  return { lines, total };
}

function openCheckout() {
  const { lines, total } = cartSummary();
  document.querySelector("#order-preview").innerHTML = `${lines.join("<br>")}<br><br><b>Разом: ${formatPrice(total)}</b>`;
  closeCart();
  checkoutDialog.showModal();
}

function buildOrder(form) {
  const { lines, total } = cartSummary();
  const data = new FormData(form);
  return [
    "Нове замовлення ХАТА.ON",
    "",
    ...lines,
    `Разом: ${formatPrice(total)}`,
    "",
    `Ім’я: ${data.get("name")}`,
    `Телефон: ${data.get("phone")}`,
    `Доставка: ${data.get("delivery")}`,
    data.get("comment") ? `Коментар: ${data.get("comment")}` : "",
    "",
    "Прошу підтвердити наявність і фінальну суму."
  ].filter(Boolean).join("\n");
}

async function copyOrder() {
  try {
    await navigator.clipboard.writeText(preparedOrder);
    document.querySelector("#copy-status").textContent = "Текст скопійовано ✓";
  } catch {
    document.querySelector("#copy-status").textContent = "Не вдалося скопіювати — скористайтеся кнопкою «Поділитися».";
  }
}

async function shareOrder() {
  const telegram = window.HATA_ON_CONFIG?.telegram?.replace(/^@/, "").trim();
  if (telegram) {
    window.open(`https://t.me/${telegram}?text=${encodeURIComponent(preparedOrder)}`, "_blank", "noopener,noreferrer");
    document.querySelector("#copy-status").textContent = "Відкрито чат магазину ✓";
    return;
  }
  if (navigator.share) {
    try {
      await navigator.share({ title: "Замовлення ХАТА.ON", text: preparedOrder });
      document.querySelector("#copy-status").textContent = "Готово — дякуємо!";
      return;
    } catch (error) {
      if (error.name === "AbortError") return;
    }
  }
  await copyOrder();
}

document.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add-product]");
  if (addButton) addToCart(addButton.dataset.addProduct);

  const changeButton = event.target.closest("[data-cart-change]");
  if (changeButton) updateQuantity(changeButton.dataset.productId, Number(changeButton.dataset.cartChange));

  const removeButton = event.target.closest("[data-remove-product]");
  if (removeButton) {
    delete cart[removeButton.dataset.removeProduct];
    saveCart();
    renderCart();
  }
});

document.querySelector("#filters").addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;
  document.querySelectorAll(".filter-button").forEach((item) => item.classList.toggle("active", item === button));
  renderProducts(button.dataset.filter);
});

document.querySelector("#open-cart").addEventListener("click", openCart);
document.querySelector("#close-cart").addEventListener("click", closeCart);
drawerBackdrop.addEventListener("click", closeCart);
document.querySelector("#checkout-button").addEventListener("click", openCheckout);
document.querySelector("#checkout-form").addEventListener("submit", (event) => {
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;
  preparedOrder = buildOrder(event.currentTarget);
  checkoutDialog.close();
  resultDialog.showModal();
});
document.querySelector("#result-close").addEventListener("click", () => resultDialog.close());
document.querySelector("#share-order").addEventListener("click", shareOrder);
document.querySelector("#copy-order").addEventListener("click", copyOrder);
document.querySelector("#contact-button").addEventListener("click", () => {
  const config = window.HATA_ON_CONFIG || {};
  const telegram = config.telegram?.replace(/^@/, "").trim();
  if (telegram) {
    window.open(`https://t.me/${telegram}`, "_blank", "noopener,noreferrer");
    return;
  }
  if (config.phone) {
    window.location.href = `tel:${config.phone}`;
    return;
  }
  if (config.email) {
    window.location.href = `mailto:${config.email}`;
    return;
  }
  showToast("Контакт магазину буде додано перед прийманням замовлень");
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && cartDrawer.classList.contains("open")) closeCart();
});

document.querySelector("#year").textContent = new Date().getFullYear();
renderProducts();
renderCart();

