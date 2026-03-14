// ============================================================
// ADMIN.JS — lógica completa del panel de administración
// ============================================================

const ADMIN_PASSWORD = 'pinaadmin2025';
const SESSION_KEY    = 'piña_admin_session';
const PRODUCTS_KEY   = 'piña_products';

// ── Autenticación ────────────────────────────────────────────
function adminLogin() {
  const pass = document.getElementById('admin-pass').value;
  if (pass === ADMIN_PASSWORD) {
    sessionStorage.setItem(SESSION_KEY, 'true');
    document.getElementById('login-screen').style.display  = 'none';
    document.getElementById('admin-panel').style.display   = 'flex';
    initAdmin();
  } else {
    document.getElementById('login-error').style.display = 'block';
    document.getElementById('admin-pass').value = '';
  }
}

function adminLogout() {
  sessionStorage.removeItem(SESSION_KEY);
  location.reload();
}

document.getElementById('admin-pass')?.addEventListener('keydown', e => {
  if (e.key === 'Enter') adminLogin();
});

// Verificar sesión al cargar
if (sessionStorage.getItem(SESSION_KEY) === 'true') {
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('admin-panel').style.display  = 'flex';
  initAdmin();
}

// ── Inicialización ───────────────────────────────────────────
async function initAdmin() {
  const products = await loadProducts();
  updateStats(products);
  renderProductTable(products);
}

async function loadProducts() {
  // Primero localStorage, luego JSON estático
  const stored = localStorage.getItem(PRODUCTS_KEY);
  if (stored) {
    try { return JSON.parse(stored); } catch {}
  }
  try {
    const res = await fetch('../data/products.json');
    const data = await res.json();
    return data;
  } catch {
    return [];
  }
}

function saveProducts(products) {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

// ── Estadísticas ─────────────────────────────────────────────
function updateStats(products) {
  document.getElementById('stat-total').textContent    = products.length;
  document.getElementById('stat-featured').textContent = products.filter(p => p.featured).length;
  document.getElementById('stat-low').textContent      = products.filter(p => p.stock > 0 && p.stock <= 3).length;
  document.getElementById('stat-nostock').textContent  = products.filter(p => p.stock === 0).length;
}

// ── Tabla de productos ───────────────────────────────────────
const ICONS = { smoke:'🌿', cultivo:'🌱', tabaqueria:'🍃', aromas:'✨' };

function renderProductTable(products) {
  const container = document.getElementById('products-table');
  if (!container) return;
  if (products.length === 0) {
    container.innerHTML = '<p style="color:var(--text-3);text-align:center;padding:40px;">No hay productos.</p>';
    return;
  }
  container.innerHTML = products.map((p, idx) => `
    <div class="product-row">
      <div class="row-icon">${ICONS[p.category] || '📦'}</div>
      <div class="row-info">
        <div class="row-name">${escHtml(p.name)}</div>
        <div class="row-meta">${p.category} · ${p.brand || 'Sin marca'} · Stock: ${p.stock} ${p.featured ? '· ⭐' : ''} ${p.new ? '· Nuevo' : ''}</div>
      </div>
      <div class="row-price">${formatCLP(p.price)}</div>
      <div class="row-actions">
        <button class="abtn abtn-outline abtn-sm" onclick="editProduct(${idx})">Editar</button>
        <button class="abtn abtn-danger abtn-sm" onclick="deleteProduct(${idx})">Eliminar</button>
      </div>
    </div>
  `).join('');
}

function filterAdminProducts(query) {
  const cat = document.getElementById('admin-cat-filter').value;
  loadProducts().then(products => {
    let filtered = products;
    if (cat !== 'all') filtered = filtered.filter(p => p.category === cat);
    if (query.trim()) {
      const q = query.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.brand || '').toLowerCase().includes(q)
      );
    }
    renderProductTable(filtered);
  });
}

// ── Secciones ────────────────────────────────────────────────
function showSection(name) {
  ['dashboard', 'products', 'add'].forEach(s => {
    document.getElementById(`sec-${s}`).style.display = s === name ? 'block' : 'none';
  });
  document.querySelectorAll('.sidebar-link').forEach(l => {
    l.classList.toggle('active', l.getAttribute('onclick')?.includes(name));
  });
  if (name === 'products') loadProducts().then(renderProductTable);
  if (name === 'dashboard') loadProducts().then(p => { updateStats(p); });
}

// ── Formulario ───────────────────────────────────────────────
let _editingIndex = null;

function autoSlug() {
  const nameVal = document.getElementById('f-name').value;
  const slug = nameVal
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-');
  document.getElementById('f-id').value = slug;
}

function clearForm() {
  _editingIndex = null;
  document.getElementById('form-title').textContent = 'Agregar producto';
  ['name','id','desc','longdesc','price','compare','category','brand','image','tags'].forEach(f => {
    document.getElementById(`f-${f}`).value = '';
  });
  document.getElementById('f-stock').value   = '0';
  document.getElementById('f-featured').checked = false;
  document.getElementById('f-new').checked      = false;
  document.getElementById('form-error').style.display = 'none';
}

async function editProduct(idx) {
  const products = await loadProducts();
  const p = products[idx];
  if (!p) return;
  _editingIndex = idx;
  document.getElementById('form-title').textContent = 'Editar producto';

  document.getElementById('f-name').value     = p.name || '';
  document.getElementById('f-id').value       = p.id || '';
  document.getElementById('f-desc').value     = p.description || '';
  document.getElementById('f-longdesc').value = p.longDesc || '';
  document.getElementById('f-price').value    = p.price || '';
  document.getElementById('f-compare').value  = p.comparePrice || '';
  document.getElementById('f-category').value = p.category || '';
  document.getElementById('f-brand').value    = p.brand || '';
  document.getElementById('f-image').value    = p.image || '';
  document.getElementById('f-stock').value    = p.stock ?? 0;
  document.getElementById('f-tags').value     = (p.tags || []).join(', ');
  document.getElementById('f-featured').checked = !!p.featured;
  document.getElementById('f-new').checked      = !!p.new;

  showSection('add');
}

async function saveProduct() {
  const errorEl = document.getElementById('form-error');
  errorEl.style.display = 'none';

  const name     = document.getElementById('f-name').value.trim();
  const id       = document.getElementById('f-id').value.trim();
  const desc     = document.getElementById('f-desc').value.trim();
  const price    = parseFloat(document.getElementById('f-price').value);
  const category = document.getElementById('f-category').value;

  // Validación
  if (!name || !id || !desc || !category || isNaN(price) || price <= 0) {
    errorEl.textContent = '⚠️ Nombre, ID, descripción, categoría y precio son obligatorios.';
    errorEl.style.display = 'block';
    return;
  }

  const product = {
    id,
    name,
    slug:         id,
    description:  desc,
    longDesc:     document.getElementById('f-longdesc').value.trim(),
    price,
    comparePrice: parseFloat(document.getElementById('f-compare').value) || null,
    category,
    brand:        document.getElementById('f-brand').value.trim(),
    image:        document.getElementById('f-image').value.trim(),
    stock:        parseInt(document.getElementById('f-stock').value) || 0,
    tags:         document.getElementById('f-tags').value.split(',').map(t => t.trim()).filter(Boolean),
    featured:     document.getElementById('f-featured').checked,
    new:          document.getElementById('f-new').checked
  };

  const products = await loadProducts();

  if (_editingIndex !== null) {
    products[_editingIndex] = product;
  } else {
    // Verificar ID duplicado
    if (products.find(p => p.id === id)) {
      errorEl.textContent = '⚠️ Ya existe un producto con ese ID. Cambia el ID o edita el existente.';
      errorEl.style.display = 'block';
      return;
    }
    products.push(product);
  }

  saveProducts(products);
  clearForm();
  showSection('dashboard');
  updateStats(products);
  alert(`✅ Producto "${product.name}" guardado. La tienda se actualizará automáticamente.`);
}

async function deleteProduct(idx) {
  if (!confirm('¿Eliminar este producto? Esta acción no se puede deshacer.')) return;
  const products = await loadProducts();
  const name = products[idx]?.name || 'Producto';
  products.splice(idx, 1);
  saveProducts(products);
  renderProductTable(products);
  updateStats(products);
}

// ── Exportar / Restaurar ─────────────────────────────────────
async function exportProducts() {
  const products = await loadProducts();
  const blob = new Blob([JSON.stringify(products, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'products.json';
  a.click();
  URL.revokeObjectURL(url);
}

async function resetToDefault() {
  if (!confirm('¿Restaurar los productos del archivo original? Se perderán todos los cambios del admin.')) return;
  localStorage.removeItem(PRODUCTS_KEY);
  const products = await loadProducts();
  updateStats(products);
  renderProductTable(products);
  alert('✅ Productos restaurados desde el archivo original.');
}

// ── Helpers ──────────────────────────────────────────────────
function formatCLP(n) {
  return new Intl.NumberFormat('es-CL', { style:'currency', currency:'CLP', minimumFractionDigits:0 }).format(n);
}
function escHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}
