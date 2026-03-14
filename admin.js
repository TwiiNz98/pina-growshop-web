// admin.js - REFORMULADO
const ADMIN_PASSWORD = 'pinaadmin2025';
const SESSION_KEY = 'piña_session';
let currentProducts = [];

// Autenticación Simple
window.adminLogin = () => {
    const pass = document.getElementById('admin-pass').value;
    if(pass === ADMIN_PASSWORD) {
        sessionStorage.setItem(SESSION_KEY, 'true');
        location.reload();
    } else alert("Error");
};

if(sessionStorage.getItem(SESSION_KEY)) {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('admin-panel').classList.remove('hidden');
    initAdmin();
}

async function initAdmin() {
    const { fetchProducts } = await import('./products.js');
    currentProducts = await fetchProducts();
    renderAdminTable();
}

function renderAdminTable() {
    const container = document.getElementById('products-table');
    container.innerHTML = currentProducts.map((p, i) => `
        <div class="grid grid-cols-4 gap-4 p-4 border-b border-white/5 items-center text-sm">
            <div class="flex items-center gap-3">
                <img src="${p.image}" class="w-10 h-10 rounded bg-black">
                <span class="font-bold">${p.name}</span>
            </div>
            <div class="text-gray-400 capitalize">${p.category}</div>
            <div class="font-mono text-primary">$${p.price}</div>
            <div class="flex justify-end gap-2">
                <button onclick="editProduct(${i})" class="bg-white/5 p-2 rounded hover:bg-primary hover:text-black">✏️</button>
                <button onclick="deleteProduct(${i})" class="bg-white/5 p-2 rounded hover:bg-red-500">🗑️</button>
            </div>
        </div>
    `).join('');
}

window.saveProduct = () => {
    const p = {
        id: document.getElementById('f-id').value,
        name: document.getElementById('f-name').value,
        price: parseInt(document.getElementById('f-price').value),
        comparePrice: parseInt(document.getElementById('f-compare').value) || null,
        stock: parseInt(document.getElementById('f-stock').value),
        category: document.getElementById('f-category').value,
        image: document.getElementById('f-image').value,
        featured: document.getElementById('f-featured').checked,
        new: document.getElementById('f-new').checked,
        description: document.getElementById('f-desc').value
    };

    const editIdx = document.getElementById('edit-index').value;
    if(editIdx === "-1") currentProducts.push(p);
    else currentProducts[editIdx] = p;

    localStorage.setItem('piña_products', JSON.stringify(currentProducts));
    location.reload();
};

window.deleteProduct = (i) => {
    if(confirm("¿Borrar?")) {
        currentProducts.splice(i, 1);
        localStorage.setItem('piña_products', JSON.stringify(currentProducts));
        renderAdminTable();
    }
};
