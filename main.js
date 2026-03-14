// ============================================================
// MAIN.JS — punto de entrada. Orquesta todos los módulos.
// ============================================================

import { fetchProducts, filterByCategory, filterByBrand, searchProducts, getBrands, getFeatured } from './src/modules/products.js';
import { addItem, removeItem, updateQty, clearCart, onCartChange, getCart } from './src/modules/cart.js';
import { renderProductGrid, renderCartDrawer, showToast, initHeaderScroll } from './src/modules/ui.js';
import { checkAge, confirmAge, denyAge } from './src/modules/ageGate.js';
import { getFilters, setFilter, onFilterChange } from './src/modules/filters.js';
import { debounce, initReveal } from './src/utils/helpers.js';

// ── Exponer funciones globales requeridas por HTML inline ────
// (onclick="..." en HTML necesita estas funciones en window)
window.__addToCart      = addToCart;
window.__removeFromCart = removeFromCart;
window.__updateQty      = handleUpdateQty;
window.__closeCart      = closeCart;
window.confirmAge       = confirmAge;
window.denyAge          = denyAge;

// ── Estado de la app ─────────────────────────────────────────
let allProducts = [];

// ── Inicialización ───────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  checkAge();
  initHeaderScroll();
  initHamburger();
  initCartDrawer();
  initSmoothScroll();
  initReveal();

  // Suscribir carrito a cambios
  onCartChange(state => renderCartDrawer(state));

  // Render inicial del carrito (desde localStorage)
  renderCartDrawer(getCart());

  // Cargar productos
  allProducts = await fetchProducts();
  renderFeatured();
  renderBrands();
  renderProducts();

  // Suscribir filtros a cambios
  onFilterChange(() => renderProducts());

  // Buscador con debounce
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', debounce(e => {
      setFilter('query', e.target.value);
    }, 300));
  }

  // Tabs de categoría
  document.querySelectorAll('.filter-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      setFilter('category', btn.dataset.cat);
    });
  });

  // Cards de categoría del home → filtran productos
  document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
      const cat = card.dataset.cat;
      setFilter('category', cat);
      document.querySelectorAll('.filter-tab').forEach(b => {
        b.classList.toggle('active', b.dataset.cat === cat);
      });
      document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
    });
  });
});

// ── Lógica de productos ──────────────────────────────────────
function renderProducts() {
  const { category, brand, query } = getFilters();
  let filtered = allProducts;
  filtered = filterByCategory(filtered, category);
  filtered = filterByBrand(filtered, brand);
  filtered = searchProducts(filtered, query);
  renderProductGrid(filtered);
  initReveal();
}

function renderFeatured() {
  const featured = getFeatured(allProducts).slice(0, 4);
  renderProductGrid(featured, 'featured-grid');
  initReveal();
}

function renderBrands() {
  const brands = getBrands(allProducts);
  const container = document.getElementById('brands-list');
  if (!container) return;
  container.innerHTML = brands.map(b => `
    <button class="brand-pill" data-brand="${b}" onclick="filterByBrandClick('${b}')">${b}</button>
  `).join('');
}

window.filterByBrandClick = function(brand) {
  document.querySelectorAll('.brand-pill').forEach(p => {
    p.classList.toggle('active', p.dataset.brand === brand);
  });
  setFilter('brand', brand);
  document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
};

// ── Carrito ──────────────────────────────────────────────────
function addToCart(productId) {
  const product = allProducts.find(p => p.id === productId);
  if (!product) return;
  addItem(product);
  showToast(`${product.name} añadido al carrito`);
}

function removeFromCart(productId) {
  removeItem(productId);
}

function handleUpdateQty(productId, qty) {
  updateQty(productId, qty);
}

// ── Cart drawer ──────────────────────────────────────────────
function openCart() {
  document.getElementById('cart-drawer')?.classList.add('open');
  document.getElementById('cart-overlay')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cart-drawer')?.classList.remove('open');
  document.getElementById('cart-overlay')?.classList.remove('open');
  document.body.style.overflow = '';
}

function initCartDrawer() {
  document.getElementById('cart-btn')?.addEventListener('click', openCart);
  document.getElementById('cart-overlay')?.addEventListener('click', closeCart);
  document.getElementById('cart-close')?.addEventListener('click', closeCart);
  document.getElementById('cart-clear')?.addEventListener('click', () => {
    clearCart();
    showToast('Carrito vaciado', 'info');
  });
}

// ── WhatsApp ─────────────────────────────────────────────────
window.openWhatsApp = function(custom = '') {
  const msg = custom || STORE_CONFIG.whatsappMessage;
  const url = `https://wa.me/${STORE_CONFIG.contact.whatsapp}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank', 'noopener');
};

// ── Hamburger mobile ─────────────────────────────────────────
function initHamburger() {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    btn.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      btn.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// ── Smooth scroll para nav ───────────────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}
