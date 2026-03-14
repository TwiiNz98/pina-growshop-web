# GUÍA COMPLETA DEL PROYECTO WEB
## Piña GrowShop — Manual para administradores y dueños

---

> **Creado por Centro Digital Express | CDE**
> Instagram: [@cde.express](https://www.instagram.com/cde.express)
>
> *Este documento es la guía oficial del proyecto web de Piña GrowShop.
> Está escrito para personas sin conocimientos técnicos de programación.*

---

## ÍNDICE

1. [¿Qué es esta web?](#1-qué-es-esta-web)
2. [¿Para qué sirve el sitio?](#2-para-qué-sirve-el-sitio)
3. [Cómo funciona el sistema de productos](#3-cómo-funciona-el-sistema-de-productos)
4. [Cómo funciona el carrito](#4-cómo-funciona-el-carrito)
5. [Cómo agregar nuevos productos](#5-cómo-agregar-nuevos-productos)
6. [Cómo actualizar productos existentes](#6-cómo-actualizar-productos-existentes)
7. [Cómo modificar textos de la web](#7-cómo-modificar-textos-de-la-web)
8. [Cómo cambiar imágenes](#8-cómo-cambiar-imágenes)
9. [Qué contiene cada carpeta](#9-qué-contiene-cada-carpeta)
10. [Explicación de archivos importantes](#10-explicación-de-archivos-importantes)
11. [Archivos que NO deben modificarse](#11-archivos-que-no-deben-modificarse)
12. [Cómo mantener la web con el tiempo](#12-cómo-mantener-la-web-con-el-tiempo)

---

## 1. ¿Qué es esta web?

Esta es la **página web oficial de Piña GrowShop**, una tienda online de tipo catálogo.

Es un sitio web que los clientes pueden visitar desde su teléfono o computador para:
- Ver todos los productos disponibles
- Filtrar productos por categoría (Smoke, Cultivo, Tabaquería, Aromas)
- Buscar productos por nombre
- Agregar productos a un carrito
- Contactar a la tienda directamente por WhatsApp

**¿Es una tienda con pagos en línea?**
No en esta versión. El sitio funciona como un **catálogo digital interactivo**. Los clientes ven los productos, los agregan al carrito y luego cierran la compra a través de WhatsApp. Esto es perfecto para una tienda local que ya usa WhatsApp para atender pedidos.

---

## 2. ¿Para qué sirve el sitio?

El sitio cumple tres funciones principales:

**Para los clientes:**
- Ver el catálogo completo de productos desde su celular o computador
- Conocer precios, descripciones y disponibilidad de stock
- Contactar a la tienda con un solo clic por WhatsApp

**Para la tienda:**
- Tener presencia profesional en internet
- Mostrar todos los productos sin necesidad de responder manualmente cada consulta
- Recibir pedidos organizados por WhatsApp

**Para el administrador (dueño o encargado):**
- Agregar, editar y eliminar productos desde el panel de administración
- Ver un resumen del catálogo (total de productos, stock, destacados)
- No necesita saber programación para gestionar el catálogo

---

## 3. Cómo funciona el sistema de productos

Los productos se guardan en un archivo llamado `products.json` dentro de la carpeta `data/`.

Piensa en este archivo como una **planilla de Excel**, pero en formato de texto. Cada producto tiene estos campos:

| Campo | Qué es |
|-------|--------|
| `id` | Identificador único (ej: "bong-vidrio-colores") |
| `name` | Nombre del producto |
| `description` | Descripción corta (aparece en la tarjeta) |
| `longDesc` | Descripción larga (para futuras páginas de detalle) |
| `price` | Precio en pesos chilenos |
| `comparePrice` | Precio anterior (tachado, para mostrar descuento) |
| `category` | Categoría: smoke, cultivo, tabaqueria, o aromas |
| `brand` | Marca del producto |
| `image` | URL de la imagen (se puede dejar vacío) |
| `stock` | Cantidad disponible en stock |
| `featured` | true = aparece en destacados, false = no |
| `new` | true = tiene badge "Nuevo", false = no |
| `tags` | Palabras clave para el buscador |

**¿Cómo llegan los productos a la web?**
Cuando alguien abre la tienda, el sitio lee automáticamente el archivo `products.json` y muestra todas las tarjetas de productos. No se necesita recargar el servidor ni hacer nada especial.

**¿Qué pasa cuando el admin agrega un producto?**
Cuando el administrador agrega un producto desde el panel de administración, el producto se guarda en el navegador (en una memoria llamada `localStorage`). La tienda revisa primero esa memoria antes de leer el archivo JSON, así que los cambios se ven de inmediato en el mismo computador.

---

## 4. Cómo funciona el carrito

El carrito es el sistema que permite a los clientes seleccionar productos antes de contactar a la tienda.

**¿Cómo funciona paso a paso?**

1. El cliente hace click en el botón **"+ Añadir"** en cualquier producto
2. El producto se agrega al carrito y aparece un número sobre el ícono del carrito (🛒)
3. El cliente puede hacer click en el ícono para **abrir el carrito lateral** (drawer)
4. En el carrito puede: aumentar/disminuir cantidades, eliminar productos, ver el total
5. Al final, hace click en **"Pedir por WhatsApp"** y se abre WhatsApp con un mensaje automático

**¿Se pierde el carrito si el cliente cierra el navegador?**
No. El carrito se guarda automáticamente en el navegador del cliente. Si cierra la página y vuelve después, el carrito sigue ahí con los mismos productos.

**¿El carrito procesa pagos?**
No. El carrito es solo un organizador. El pago se coordina directamente a través de WhatsApp entre el cliente y la tienda.

---

## 5. Cómo agregar nuevos productos

### Método 1: Panel de administración (recomendado)

1. Abre tu navegador y ve a la dirección de la web seguida de `/admin/`
   - Ejemplo: `https://tusitio.com/admin/`
2. Ingresa la contraseña del admin (la contraseña inicial es: **pinaadmin2025**)
3. Haz click en **"➕ Agregar"** en el menú lateral izquierdo
4. Completa el formulario con los datos del producto
5. Haz click en **"💾 Guardar producto"**
6. El producto aparecerá de inmediato en la tienda

**Campos obligatorios al agregar un producto:**
- Nombre (ej: "Bong Azul Grande")
- ID/Slug: se genera automáticamente desde el nombre (puedes dejarlo como está)
- Descripción corta: máximo 1-2 oraciones
- Categoría: elige entre Smoke, Cultivo, Tabaquería o Aromas
- Precio: solo números, sin puntos ni símbolos (ej: 12990)

**Campos opcionales pero recomendados:**
- Precio comparativo: si quieres mostrar un precio tachado (descuento)
- Marca
- Stock: cuántas unidades tienes disponibles
- Destacado: si quieres que aparezca en la sección "Destacados" de la página principal

### Método 2: Editar el archivo JSON directamente (para usuarios avanzados)

Si eres cómodo abriendo archivos de texto, puedes editar directamente el archivo `data/products.json`. Cada producto es un bloque de texto entre `{` y `}`, separados por comas. Sigue exactamente el mismo formato de los productos existentes.

> ⚠️ **Importante:** Si editas el JSON directamente, respeta el formato exacto. Un error de tipeo puede hacer que todos los productos dejen de aparecer.

---

## 6. Cómo actualizar productos existentes

1. Ve al panel admin (`/admin/`)
2. Haz click en **"📦 Productos"** en el menú lateral
3. Busca el producto que quieres editar usando el buscador o el filtro de categorías
4. Haz click en el botón **"Editar"** del producto
5. Modifica los campos que necesitas
6. Haz click en **"💾 Guardar producto"**

Para **eliminar un producto**, usa el botón rojo **"Eliminar"** en la lista de productos. Se pedirá confirmación antes de borrar.

---

## 7. Cómo modificar textos de la web

Los textos principales del sitio están en el archivo `index.html`. Aquí están las partes más comunes que podrías querer cambiar:

### Texto del Hero (el gran título de la página de inicio)

Abre `index.html` y busca esta sección:
```html
<h1 class="hero-title">
  Todo lo que<br>
  necesitas para<br>
  <em>crecer</em>
</h1>
```
Puedes cambiar "Todo lo que necesitas para crecer" por cualquier texto que quieras.

### Subtítulo del Hero

```html
<p class="hero-subtitle">
  Smoke, Cultivo, Tabaquería y Aromas...
</p>
```

### Información de contacto

En el footer (parte inferior de la página) busca:
```html
<li>📍 San Marcos 1801, Padre Hurtado</li>
<li>📱 <a href="https://wa.me/56945802810">+56 9 4580 2810</a></li>
```

Para cambiar el número de WhatsApp, también actualiza el archivo `config/store.config.js`:
```javascript
whatsapp: "56945802810",  // ← cambia este número
```

### Texto "Sobre Nosotros"

Busca la sección con `id="about"` en `index.html` y edita los párrafos `<p>` dentro de ella.

---

## 8. Cómo cambiar imágenes

### Imágenes de productos

Actualmente el sitio muestra un ícono emoji cuando un producto no tiene imagen. Para agregar una imagen real a un producto:

1. **Sube la imagen a un servicio de almacenamiento**: puedes usar Google Drive, Dropbox, Imgur, o cualquier servicio que genere una URL pública de imagen.
2. **Copia la URL de la imagen** (debe terminar en .jpg, .png, .webp, etc.)
3. Ve al **panel admin**, edita el producto, y pega la URL en el campo **"URL de imagen"**
4. Guarda el producto

**Recomendaciones para imágenes:**
- Tamaño ideal: 800×800 píxeles (cuadrada)
- Peso máximo recomendado: 500KB
- Formatos aceptados: JPG, PNG, WebP

### Logo e imágenes del sitio

El logo actual es un emoji (🌿). Para reemplazarlo por una imagen real, edita en `index.html` la línea:
```html
<div class="logo-mark" aria-hidden="true">🌿</div>
```
Y reemplaza el emoji por una etiqueta `<img>` con tu logo:
```html
<div class="logo-mark"><img src="public/img/logo.png" alt="Piña GrowShop"></div>
```

---

## 9. Qué contiene cada carpeta

```
piña-growshop/
│
├── index.html          → La página principal de la tienda
├── main.js             → El "cerebro" del sitio (no modificar)
│
├── public/             → Recursos públicos (CSS e imágenes)
│   ├── css/            → Todos los estilos visuales del sitio
│   │   ├── tokens.css      → Colores, fuentes y variables globales
│   │   ├── layout.css      → Estructura de la página (header, footer)
│   │   ├── components.css  → Botones, cards, carrito, modales
│   │   └── store.css       → Secciones específicas (hero, categorías)
│   └── img/            → Imágenes del sitio (logos, banners, etc.)
│
├── data/               → Los datos de la tienda
│   └── products.json   → ← AQUÍ ESTÁN TUS PRODUCTOS
│
├── src/                → Código JavaScript del sitio (no modificar)
│   ├── modules/        → Módulos de funcionalidad
│   │   ├── cart.js         → Lógica del carrito
│   │   ├── products.js     → Carga y filtrado de productos
│   │   ├── ui.js           → Lo que se muestra en pantalla
│   │   ├── filters.js      → Sistema de filtros
│   │   └── ageGate.js      → Verificación de edad
│   └── utils/
│       └── helpers.js      → Funciones auxiliares
│
├── config/             → Configuración global
│   └── store.config.js → Nombre, contacto, categorías, contraseña admin
│
└── admin/              → Panel de administración
    ├── index.html      → Página del panel admin
    ├── admin.js        → Lógica del panel admin
    └── admin.css       → Estilos del panel admin
```

---

## 10. Explicación de archivos importantes

### `data/products.json` ← EL MÁS IMPORTANTE

Es el archivo que contiene todos los productos de la tienda. Es el único archivo de datos que deberías necesitar editar directamente (y solo si no usas el panel admin).

### `config/store.config.js`

Contiene la configuración general de la tienda: nombre, número de WhatsApp, contraseña del admin, categorías. Es el primer lugar donde debes cambiar información de contacto.

### `index.html`

La página principal de la tienda. Contiene los textos, secciones y la estructura visual del sitio. Se puede editar para cambiar textos, agregar secciones o actualizar información.

### `admin/index.html` + `admin/admin.js`

El panel de administración. Desde aquí se gestionan los productos sin necesidad de editar código.

### `public/css/tokens.css`

Define los colores, fuentes y espaciados del sitio. Si quieres cambiar el color principal verde por otro color, aquí está la variable `--accent`. **Solo modificar si sabes lo que haces.**

### `main.js`

Es el archivo que conecta todos los módulos y hace funcionar la tienda. **No modificar.**

---

## 11. Archivos que NO deben modificarse

Los siguientes archivos son el motor del sitio. Modificarlos sin conocimiento técnico puede hacer que el sitio deje de funcionar completamente.

### ⛔ `main.js`
**¿Por qué no tocarlo?** Es el punto de entrada de toda la aplicación. Coordina la carga de productos, el carrito, los filtros y la interfaz. Un error aquí rompe TODO el sitio.

### ⛔ `src/modules/cart.js`
**¿Por qué no tocarlo?** Gestiona la lógica del carrito y la persistencia en el navegador. Si se modifica, los clientes podrían perder su carrito o no poder agregar productos.

### ⛔ `src/modules/products.js`
**¿Por qué no tocarlo?** Maneja cómo se cargan y filtran los productos. Un error aquí haría que la grilla de productos quedara vacía.

### ⛔ `src/modules/ui.js`
**¿Por qué no tocarlo?** Genera el HTML de las tarjetas de productos y el carrito. Si se cambia el formato, los productos podrían dejar de verse correctamente.

### ⛔ `src/utils/helpers.js`
**¿Por qué no tocarlo?** Contiene funciones base usadas por todos los demás módulos.

### ⚠️ `public/css/tokens.css` (modificar con cuidado)
Se puede modificar para cambiar colores, pero requiere cuidado. Cambiar el nombre de una variable CSS sin actualizar todas sus referencias puede romper el diseño.

### ⚠️ `public/css/layout.css` y `components.css` (modificar con cuidado)
Solo deben modificarse si se entiende CSS. Un error de sintaxis puede desordenar toda la página.

---

## 12. Cómo mantener la web con el tiempo

### Actualizar el catálogo de productos

La tarea más frecuente. Sigue este proceso:

1. **Agregar producto nuevo** → Panel admin → "➕ Agregar" → llenar formulario → guardar
2. **Actualizar precio** → Panel admin → "📦 Productos" → "Editar" → cambiar precio → guardar
3. **Producto agotado** → Panel admin → "Editar" → cambiar Stock a 0 → guardar (aparecerá "Sin stock")
4. **Eliminar producto descontinuado** → Panel admin → "📦 Productos" → "Eliminar"

### Actualizar información de la tienda

Si cambia el número de WhatsApp, dirección, o redes sociales:

1. Abre el archivo `config/store.config.js`
2. Cambia los datos de contacto
3. También actualiza el `index.html` donde aparecen la dirección y el teléfono visualmente

### Hacer una copia de seguridad de los productos

Cada vez que hagas cambios importantes al catálogo:

1. Ve al panel admin → Dashboard
2. Haz click en **"⬇️ Exportar JSON"**
3. Se descargará un archivo `products.json` en tu computador
4. Guarda ese archivo en una carpeta segura (Google Drive, pendrive, etc.)

Si alguna vez los productos se borran o corrompen, puedes subir ese archivo de respaldo y restaurar todo.

### Contraseña del admin

La contraseña inicial es `pinaadmin2025`. Para cambiarla, abre `config/store.config.js` y modifica:
```javascript
adminPassword: "pinaadmin2025",  // ← cambia esto
```
También actualiza la misma contraseña en `admin/admin.js`, línea:
```javascript
const ADMIN_PASSWORD = 'pinaadmin2025';  // ← misma contraseña aquí
```

### Agregar nuevas secciones a la web

Para agregar una nueva sección (por ejemplo, una sección de "Ofertas del mes"):

1. Abre `index.html`
2. Copia el bloque de código de una sección existente (por ejemplo, la sección de categorías)
3. Pégalo donde quieres la nueva sección
4. Cambia el texto y contenido
5. Agrega un enlace en el menú de navegación del header

Esta tarea requiere conocimientos básicos de HTML. Si no te sientes cómodo, contacta al desarrollador.

### Cuando algo se rompe

Si el sitio deja de verse correctamente o deja de cargar productos:

1. **Primero:** intenta limpiar el caché del navegador (Ctrl+Shift+Delete o Cmd+Shift+Delete)
2. **Segundo:** abre el panel admin y haz click en "🔄 Restaurar productos por defecto"
3. **Tercero:** si el problema persiste, contacta al desarrollador

### Frecuencia de mantenimiento recomendada

| Tarea | Frecuencia |
|-------|-----------|
| Actualizar stock de productos | Semanal |
| Revisar que todos los productos tienen precios actualizados | Mensual |
| Exportar backup del catálogo | Mensual |
| Revisar que el número de WhatsApp es correcto | Cuando cambie |
| Revisar que la dirección es correcta | Cuando cambie |

---

## Contacto del desarrollador

Si necesitas ayuda técnica con el sitio, modificaciones, o nuevas funcionalidades:

**Centro Digital Express | CDE**
Instagram: [@cde.express](https://www.instagram.com/cde.express)

---

*Guía creada por Centro Digital Express. Versión 1.0 — 2025.*
