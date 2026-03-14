// products.js - REFORMULADO
export async function fetchProducts() {
    const stored = localStorage.getItem('piña_products');
    if (stored) {
        try { return JSON.parse(stored); } catch (e) { console.error("Error local", e); }
    }
    try {
        const res = await fetch('./products.json');
        if (!res.ok) throw new Error("No se pudo cargar JSON");
        return await res.json();
    } catch (err) {
        return [];
    }
}

export function renderProducts(products, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (products.length === 0) {
        container.innerHTML = `<div class="col-span-full text-center py-20 opacity-50 italic">No se encontraron productos...</div>`;
        return;
    }

    container.innerHTML = products.map(p => {
        const isAgotado = p.stock <= 0;
        const tieneOferta = p.comparePrice && p.comparePrice > p.price;
        const precioFormateado = Number(p.price).toLocaleString('es-CL');
        const precioViejo = tieneOferta ? Number(p.comparePrice).toLocaleString('es-CL') : null;

        return `
        <article class="group relative bg-[#111a13] border border-white/5 rounded-[2rem] p-5 transition-all duration-500 hover:border-primary/40 hover:translate-y-[-5px]">
            <div class="absolute top-4 left-4 z-10 flex flex-col gap-2">
                ${p.new ? `<span class="bg-primary text-black text-[10px] font-black px-3 py-1 rounded-full shadow-lg shadow-primary/20">NUEVO</span>` : ''}
                ${tieneOferta ? `<span class="bg-secondary text-black text-[10px] font-black px-3 py-1 rounded-full shadow-lg shadow-secondary/20">OFERTA</span>` : ''}
            </div>
            
            ${isAgotado ? `<div class="absolute inset-0 z-20 bg-black/60 backdrop-blur-[2px] rounded-[2rem] flex items-center justify-center">
                <span class="border-2 border-white/20 text-white font-bold px-6 py-2 rounded-full rotate-[-10deg] uppercase tracking-widest">Agotado</span>
            </div>` : ''}

            <div class="aspect-square bg-black/20 rounded-[1.5rem] overflow-hidden flex items-center justify-center p-6 mb-5">
                <img src="${p.image || 'img/placeholder.jpg'}" alt="${p.name}" class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700">
            </div>

            <div class="space-y-2">
                <span class="text-[9px] font-bold text-primary tracking-widest uppercase opacity-70">${p.category} · ${p.brand || 'Original'}</span>
                <h3 class="text-lg font-bold text-white leading-tight h-14 line-clamp-2">${p.name}</h3>
                
                <div class="flex items-end justify-between pt-4">
                    <div>
                        ${precioViejo ? `<span class="block text-xs text-gray-500 line-through">$${precioViejo}</span>` : ''}
                        <span class="text-2xl font-black text-white">$${precioFormateado}</span>
                    </div>
                    <button class="${isAgotado ? 'hidden' : 'bg-primary hover:bg-white text-black w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-lg active:scale-95'}">
                        <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                    </button>
                </div>
            </div>
        </article>`;
    }).join('');
}
