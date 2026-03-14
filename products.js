// products.js - Lógica de productos estilo Piña GrowShop

let _cache = null;

export async function fetchProducts() {
    if (_cache) return _cache;
    
    // Intentar cargar desde localStorage (por si el admin editó algo)
    const stored = localStorage.getItem('piña_products');
    if (stored) {
        try {
            _cache = JSON.parse(stored);
            return _cache;
        } catch (e) { console.error("Error en JSON local"); }
    }

    // Cargar el archivo JSON (ajustado a la raíz para GitHub Pages)
    try {
        const res = await fetch('./products.json'); 
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        _cache = await res.json();
        return _cache;
    } catch (err) {
        console.error('Error al cargar productos:', err);
        return [];
    }
}

// Función para renderizar los productos en el HTML
export function renderProducts(products, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = products.map(p => {
        const hasDiscount = p.comparePrice && p.comparePrice > p.price;
        const discountBadge = hasDiscount ? `<span class="bg-red-500 text-white text-[10px] px-2 py-1 rounded-full absolute top-4 left-4 z-10 font-bold">OFERTA</span>` : '';
        const newBadge = p.new ? `<span class="bg-primary text-black text-[10px] px-2 py-1 rounded-full absolute top-4 right-4 z-10 font-bold">NUEVO</span>` : '';

        return `
        <div class="group bg-[#141b15] border border-white/5 rounded-[2rem] overflow-hidden hover:border-primary/40 transition-all duration-500 relative">
            ${discountBadge}
            ${newBadge}
            
            <div class="aspect-square bg-black/20 flex items-center justify-center p-6 overflow-hidden">
                <img src="${p.image || 'https://via.placeholder.com/300?text=Pina+Grow'}" 
                     alt="${p.name}" 
                     class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500">
            </div>

            <div class="p-6">
                <span class="text-primary text-[10px] font-bold uppercase tracking-widest">${p.category}</span>
                <h4 class="text-xl font-bold mt-1 mb-2 group-hover:text-primary transition-colors">${p.name}</h4>
                <p class="text-gray-500 text-xs line-clamp-2 mb-4">${p.description}</p>
                
                <div class="flex items-center justify-between mt-auto">
                    <div>
                        <span class="text-2xl font-bold text-white">$${p.price.toLocaleString('es-CL')}</span>
                        ${hasDiscount ? `<span class="block text-xs text-gray-500 line-through">$${p.comparePrice.toLocaleString('es-CL')}</span>` : ''}
                    </div>
                    <button class="bg-white/5 hover:bg-primary hover:text-black p-3 rounded-xl transition-all">
                        🛒
                    </button>
                </div>
            </div>
        </div>
        `;
    }).join('');
}

// Filtros básicos
export function filterByCategory(products, category) {
    if (!category || category === 'all') return products;
    return products.filter(p => p.category === category);
}
