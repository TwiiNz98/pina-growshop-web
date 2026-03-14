<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Panel | Piña GrowShop</title>
    <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@600&family=Inter:wght@400;600&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="tokens.css">
    <style>
        :root { --pina-green: #4caf50; --pina-dark: #0a0f0b; }
        body { background-color: var(--pina-dark); font-family: 'Inter', sans-serif; color: white; }
        .pina-card { background: #111a13; border: 1px solid rgba(255,255,255,0.05); border-radius: 1.5rem; }
        .sidebar-link.active { background: var(--pina-green); color: black; font-weight: bold; }
        .product-row { display: grid; grid-template-columns: 50px 1fr 120px 150px; gap: 1rem; align-items: center; padding: 1rem; border-bottom: 1px solid rgba(255,255,255,0.05); transition: background 0.3s; }
        .product-row:hover { background: rgba(255,255,255,0.02); }
        input, select, textarea { background: #070c08 !important; border: 1px solid rgba(255,255,255,0.1) !important; color: white !important; border-radius: 0.75rem; padding: 0.75rem; outline: none; }
        input:focus { border-color: var(--pina-green) !important; }
    </style>
</head>
<body>

    <div id="login-screen" class="fixed inset-0 z-[100] bg-black flex items-center justify-center p-4">
        <div class="pina-card p-8 max-w-sm w-full text-center">
            <h1 class="text-4xl mb-6">🍍</h1>
            <h2 class="text-xl font-bold mb-4">Acceso Administración</h2>
            <input type="password" id="admin-pass" placeholder="Contraseña" class="w-full mb-4 text-center">
            <p id="login-error" class="text-red-500 text-xs mb-4 hidden">Contraseña incorrecta</p>
            <button onclick="adminLogin()" class="w-full bg-primary text-black font-bold py-3 rounded-xl hover:bg-white transition-colors">Entrar</button>
        </div>
    </div>

    <div id="admin-panel" class="hidden min-h-screen flex-col md:flex-row">
        
        <aside class="w-full md:w-64 bg-[#070c08] p-6 border-r border-white/5">
            <h1 class="text-2xl font-['Fredoka'] text-primary mb-8">Piña Admin</h1>
            <nav class="space-y-2">
                <button onclick="showSection('dashboard')" class="sidebar-link active w-full text-left p-3 rounded-xl transition-all">📊 Dashboard</button>
                <button onclick="showSection('products')" class="sidebar-link w-full text-left p-3 rounded-xl transition-all">📦 Inventario</button>
                <button onclick="showSection('add'); clearForm()" class="sidebar-link w-full text-left p-3 rounded-xl transition-all">➕ Nuevo Producto</button>
            </nav>
            <div class="mt-10 pt-10 border-t border-white/5 space-y-4">
                <button onclick="exportProducts()" class="text-xs text-gray-400 hover:text-white block w-full text-left">💾 Exportar JSON</button>
                <button onclick="resetToDefault()" class="text-xs text-red-400 hover:text-red-300 block w-full text-left">🔄 Restaurar Base</button>
                <button onclick="adminLogout()" class="text-xs text-gray-500 block w-full text-left mt-8">Cerrar Sesión</button>
            </div>
        </aside>

        <main class="flex-1 p-6 md:p-10 overflow-y-auto">
            
            <section id="sec-dashboard">
                <h2 class="text-3xl font-bold mb-8">Hola, Admin 👋</h2>
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <div class="pina-card p-6 text-center">
                        <span class="text-gray-400 text-xs block mb-1 uppercase tracking-widest">Total</span>
                        <div id="stat-total" class="text-4xl font-bold">0</div>
                    </div>
                    <div class="pina-card p-6 text-center border-b-2 border-primary">
                        <span class="text-gray-400 text-xs block mb-1 uppercase tracking-widest">Destacados</span>
                        <div id="stat-featured" class="text-4xl font-bold text-primary">0</div>
                    </div>
                    <div class="pina-card p-6 text-center">
                        <span class="text-gray-400 text-xs block mb-1 uppercase tracking-widest">Stock Bajo</span>
                        <div id="stat-low" class="text-4xl font-bold text-yellow-500">0</div>
                    </div>
                    <div class="pina-card p-6 text-center">
                        <span class="text-gray-400 text-xs block mb-1 uppercase tracking-widest">Agotados</span>
                        <div id="stat-nostock" class="text-4xl font-bold text-red-500">0</div>
                    </div>
                </div>
            </section>

            <section id="sec-products" class="hidden">
                <div class="flex justify-between items-center mb-8">
                    <h2 class="text-2xl font-bold">Inventario</h2>
                    <div class="flex gap-4">
                        <select id="admin-cat-filter" onchange="filterAdminProducts('')" class="text-sm">
                            <option value="all">Todas las categorías</option>
                            <option value="smoke">Smoke</option>
                            <option value="cultivo">Cultivo</option>
                            <option value="aromas">Aromas</option>
                        </select>
                        <input type="text" onkeyup="filterAdminProducts(this.value)" placeholder="Buscar producto..." class="text-sm">
                    </div>
                </div>
                <div id="products-table" class="pina-card overflow-hidden">
                    </div>
            </section>

            <section id="sec-add" class="hidden max-w-3xl">
                <h2 id="form-title" class="text-2xl font-bold mb-8">Agregar producto</h2>
                <div class="pina-card p-8 space-y-6">
                    <div class="grid grid-cols-2 gap-6">
                        <div class="flex flex-col">
                            <label class="text-xs text-gray-400 mb-2 uppercase">Nombre Comercial</label>
                            <input type="text" id="f-name" onkeyup="autoSlug()" placeholder="Ej: Bong de Vidrio XL">
                        </div>
                        <div class="flex flex-col">
                            <label class="text-xs text-gray-400 mb-2 uppercase">ID Único (Slug)</label>
                            <input type="text" id="f-id" placeholder="ej-bong-xl">
                        </div>
                    </div>

                    <div class="flex flex-col">
                        <label class="text-xs text-gray-400 mb-2 uppercase">Descripción Corta (Cards)</label>
                        <input type="text" id="f-desc" placeholder="Resumen rápido para el catálogo">
                    </div>

                    <div class="flex flex-col">
                        <label class="text-xs text-gray-400 mb-2 uppercase">Descripción Larga</label>
                        <textarea id="f-longdesc" rows="3" placeholder="Detalles técnicos, materiales, etc."></textarea>
                    </div>

                    <div class="grid grid-cols-3 gap-6">
                        <div class="flex flex-col">
                            <label class="text-xs text-gray-400 mb-2 uppercase">Precio ($)</label>
                            <input type="number" id="f-price" placeholder="24990">
                        </div>
                        <div class="flex flex-col">
                            <label class="text-xs text-gray-400 mb-2 uppercase">Precio Oferta (Opcional)</label>
                            <input type="number" id="f-compare" placeholder="34990">
                        </div>
                        <div class="flex flex-col">
                            <label class="text-xs text-gray-400 mb-2 uppercase">Stock</label>
                            <input type="number" id="f-stock" value="0">
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-6">
                        <div class="flex flex-col">
                            <label class="text-xs text-gray-400 mb-2 uppercase">Categoría</label>
                            <select id="f-category">
                                <option value="smoke">Smoke</option>
                                <option value="cultivo">Cultivo</option>
                                <option value="tabaqueria">Tabaquería</option>
                                <option value="aromas">Aromas</option>
                            </select>
                        </div>
                        <div class="flex flex-col">
                            <label class="text-xs text-gray-400 mb-2 uppercase">Marca</label>
                            <input type="text" id="f-brand" placeholder="Ej: Raw, BioBizz">
                        </div>
                    </div>

                    <div class="flex flex-col">
                        <label class="text-xs text-gray-400 mb-2 uppercase">Ruta Imagen</label>
                        <input type="text" id="f-image" placeholder="img/producto.jpg">
                    </div>

                    <div class="flex flex-col">
                        <label class="text-xs text-gray-400 mb-2 uppercase">Tags (separados por coma)</label>
                        <input type="text" id="f-tags" placeholder="vidrio, XL, pro">
                    </div>

                    <div class="flex gap-8 py-4 border-y border-white/5">
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" id="f-featured" class="w-5 h-5 accent-primary">
                            <span>Destacar en Home (⭐)</span>
                        </label>
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" id="f-new" class="w-5 h-5 accent-primary">
                            <span>Marcar como Nuevo</span>
                        </label>
                    </div>

                    <div id="form-error" class="text-red-500 text-sm hidden"></div>

                    <div class="flex gap-4">
                        <button onclick="saveProduct()" class="flex-1 bg-primary text-black font-bold py-4 rounded-2xl hover:bg-white transition-all">Guardar Cambios</button>
                        <button onclick="showSection('products')" class="px-8 bg-white/5 rounded-2xl">Cancelar</button>
                    </div>
                </div>
            </section>
        </main>
    </div>

    <script src="admin.js"></script>
</body>
</html>
