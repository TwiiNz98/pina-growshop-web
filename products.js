// ============================================================
// PRODUCTS MODULE — carga, caché y filtrado de productos
// ============================================================

// Caché en memoria: se llena en el primer fetch y no vuelve a llamar la red
let _cache = null;

/**
 * Devuelve todos los productos.
 * Primero revisa si hay productos guardados por el admin en localStorage.
 * Si no, carga el JSON estático.
 */
export async function fetchProducts() {
  if (_cache) return _cache;

  // Primero: revisar si el admin guardó productos en localStorage
  const stored = localStorage.getItem('piña_products');
  if (stored) {
    try {
      _cache = JSON.parse(stored);
      return _cache;
    } catch {
      // Si el JSON está corrupto, ignorar y cargar el archivo
    }
  }

  // Segundo: cargar el JSON estático
  try {
    const res = await fetch('./data/products.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    _cache = await res.json();
    return _cache;
  } catch (err) {
    console.error('[Products] Error al cargar productos:', err);
    return [];
  }
}

/**
 * Filtra productos por categoría. "all" devuelve todos.
 */
export function filterByCategory(products, category) {
  if (!category || category === 'all') return products;
  return products.filter(p => p.category === category);
}

/**
 * Filtra productos por marca. "all" devuelve todos.
 */
export function filterByBrand(products, brand) {
  if (!brand || brand === 'all') return products;
  return products.filter(p => p.brand === brand);
}

/**
 * Busca en nombre, descripción y tags.
 * Case-insensitive y con normalización de tildes.
 */
export function searchProducts(products, query) {
  if (!query || query.trim() === '') return products;
  const q = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return products.filter(p => {
    const fields = [p.name, p.description, ...(p.tags || [])].join(' ')
      .toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return fields.includes(q);
  });
}

/**
 * Devuelve las marcas únicas presentes en el catálogo.
 */
export function getBrands(products) {
  const brands = new Set(products.map(p => p.brand).filter(Boolean));
  return Array.from(brands).sort();
}

/**
 * Devuelve solo los productos marcados como featured.
 */
export function getFeatured(products) {
  return products.filter(p => p.featured && p.stock > 0);
}

/**
 * Invalida el caché (útil después de guardar desde el admin).
 */
export function invalidateCache() {
  _cache = null;
}
