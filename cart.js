// ============================================================
// CART MODULE — estado del carrito con persistencia en localStorage
// ============================================================

const CART_KEY = 'piña_cart';

// ── Estado interno ──────────────────────────────────────────
function loadState() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : { items: [] };
  } catch {
    return { items: [] };
  }
}

function saveState(state) {
  localStorage.setItem(CART_KEY, JSON.stringify(state));
}

// ── API pública ─────────────────────────────────────────────

/** Devuelve el estado completo del carrito */
export function getCart() {
  return loadState();
}

/** Agrega un producto. Si ya existe, aumenta cantidad. */
export function addItem(product) {
  const state = loadState();
  const existing = state.items.find(i => i.productId === product.id);

  if (existing) {
    existing.qty += 1;
  } else {
    state.items.push({
      productId: product.id,
      name:      product.name,
      price:     product.price,
      image:     product.image || '',
      category:  product.category,
      qty:       1
    });
  }

  saveState(state);
  _notify();
  return state;
}

/** Elimina un producto del carrito por su ID */
export function removeItem(productId) {
  const state = loadState();
  state.items = state.items.filter(i => i.productId !== productId);
  saveState(state);
  _notify();
  return state;
}

/** Actualiza la cantidad de un producto. Si qty <= 0, lo elimina. */
export function updateQty(productId, qty) {
  const state = loadState();
  if (qty <= 0) {
    return removeItem(productId);
  }
  const item = state.items.find(i => i.productId === productId);
  if (item) item.qty = qty;
  saveState(state);
  _notify();
  return state;
}

/** Vacía el carrito completamente */
export function clearCart() {
  const state = { items: [] };
  saveState(state);
  _notify();
  return state;
}

/** Cantidad total de ítems (suma de todas las qty) */
export function getCount() {
  return loadState().items.reduce((sum, i) => sum + i.qty, 0);
}

/** Total monetario del carrito */
export function getTotal() {
  return loadState().items.reduce((sum, i) => sum + i.price * i.qty, 0);
}

// ── Sistema de suscripción reactivo ─────────────────────────
const _listeners = new Set();

export function onCartChange(fn) {
  _listeners.add(fn);
  return () => _listeners.delete(fn); // devuelve función para desuscribirse
}

function _notify() {
  const state = loadState();
  _listeners.forEach(fn => fn(state));
}
