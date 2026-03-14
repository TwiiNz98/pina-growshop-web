// ============================================================
// UI MODULE — renderizado del DOM. Solo recibe datos, devuelve HTML.
// ============================================================

import { formatPrice, sanitize } from '../utils/helpers.js';

// Icono de categoría por defecto
const CATEGORY_ICONS = {
  smoke:      '🌿',
  cultivo:    '🌱',
  tabaqueria: '🍃',
  aromas:     '✨'
};

// ── Tarjeta de producto ──────────────────────────────────────
export function renderProductCard(product) {
  const discount = product.comparePrice
    ? Math.round((1 - product.price / product.comparePrice) * 100)
    : null;

  const badges = [];
  if (product.new)      badges.push('<span class="badge badge-accent">Nuevo</span>');
  if (discount)         badges.push(`<span class="badge badge-gold">-${discount}%</span>`);
  if (product.stock <= 3 && product.stock > 0)
                        badges.push('<span class="badge badge-red">Últimas unidades</span>');
  if (product.stock === 0) badges.push('<span class="badge badge-red">Sin stock</span>');

  const icon = CATEGORY_ICONS[product.category] || '📦';

  return `
    <article class="product-card reveal" data-id="${sanitize(product.id)}">
      <div class="card-image">
        ${product.image
          ? `<img src="${sanitize(product.image)}" alt="${sanitize(product.name)}" loading="lazy">`
          : `<div class="card-image-placeholder">${icon}</div>`
        }
        ${badges.length ? `<div class="card-badges">${badges.join('')}</div>` : ''}
      </div>
      <div class="card-body">
        <span class="card-category">${sanitize(product.category)}</span>
        <h3 class="card-name">${sanitize(product.name)}</h3>
        <p class="card-desc">${sanitize(product.description)}</p>
        <div class="card-footer">
          <div class="card-prices">
            <span class="price-main">${formatPrice(product.price)}</span>
            ${product.comparePrice ? `<span class="price-compare">${formatPrice(product.comparePrice)}</span>` : ''}
          </div>
          ${product.stock > 0
            ? `<button class="btn btn-primary btn-sm" onclick="window.__addToCart('${sanitize(product.id)}')" aria-label="Añadir ${sanitize(product.name)} al carrito">+ Añadir</button>`
            : `<button class="btn btn-outline btn-sm" disabled>Sin stock</button>`
          }
        </div>
      </div>
    </article>
  `;
}

// ── Grid de productos ────────────────────────────────────────
export function renderProductGrid(products, containerId = 'product-grid') {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (products.length === 0) {
    container.innerHTML = `
      <div class="products-empty">
        <div class="empty-icon">🔍</div>
        <p>No se encontraron productos con esos filtros.</p>
      </div>`;
    return;
  }

  container.innerHTML = products.map(renderProductCard).join('');
}

// ── Drawer del carrito ───────────────────────────────────────
export function renderCartDrawer(cart) {
  const itemsEl = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  const countEl = document.getElementById('cart-item-count');
  const badgeEl = document.getElementById('cart-badge');

  const count = cart.items.reduce((s, i) => s + i.qty, 0);
  const total = cart.items.reduce((s, i) => s + i.price * i.qty, 0);

  // Actualizar badge
  if (badgeEl) {
    badgeEl.textContent = count;
    badgeEl.classList.toggle('visible', count > 0);
  }

  if (countEl) countEl.textContent = count > 0 ? `${count} ${count === 1 ? 'ítem' : 'ítems'}` : '';

  if (!itemsEl) return;

  if (cart.items.length === 0) {
    itemsEl.innerHTML = `
      <div class="cart-empty">
        <div class="empty-icon">🛒</div>
        <p>Tu carrito está vacío</p>
        <button class="btn btn-outline btn-sm" onclick="window.__closeCart()">Ver productos</button>
      </div>`;
  } else {
    const icon = (cat) => CATEGORY_ICONS[cat] || '📦';
    itemsEl.innerHTML = cart.items.map(item => `
      <div class="cart-item" data-id="${sanitize(item.productId)}">
        <div class="cart-item-img">${icon(item.category)}</div>
        <div class="cart-item-info">
          <p class="cart-item-name">${sanitize(item.name)}</p>
          <p class="cart-item-price">${formatPrice(item.price)}</p>
          <div class="cart-item-controls">
            <button class="qty-btn" onclick="window.__updateQty('${sanitize(item.productId)}', ${item.qty - 1})">−</button>
            <span class="qty-value">${item.qty}</span>
            <button class="qty-btn" onclick="window.__updateQty('${sanitize(item.productId)}', ${item.qty + 1})">+</button>
            <button class="cart-remove" onclick="window.__removeFromCart('${sanitize(item.productId)}')">×</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  if (totalEl) totalEl.textContent = formatPrice(total);
}

// ── Toast de notificación ────────────────────────────────────
export function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const icons = { success: '✓', error: '✕', info: 'ℹ' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type] || '✓'}</span><span>${sanitize(message)}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = `toast-out 280ms var(--ease) forwards`;
    toast.addEventListener('animationend', () => toast.remove());
  }, 3000);
}

// ── Header scroll state ──────────────────────────────────────
export function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;
  const update = () => header.classList.toggle('scrolled', window.scrollY > 10);
  window.addEventListener('scroll', update, { passive: true });
  update();
}
