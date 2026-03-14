// ============================================================
// UTILS — funciones helper puras sin estado
// ============================================================

/**
 * Formatea un número como precio en CLP
 * @param {number} amount
 * @returns {string} "$12.990"
 */
export function formatPrice(amount) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(amount);
}

/**
 * Ejecuta una función tras un delay, reiniciándolo si se llama de nuevo
 * Útil para el buscador — no ejecuta en cada tecla sino al terminar
 */
export function debounce(fn, ms = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

/**
 * Convierte un texto a slug URL amigable
 * "Bong Vidrio Colores" → "bong-vidrio-colores"
 */
export function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-');
}

/**
 * Escapa HTML para evitar inyección de código malicioso
 */
export function sanitize(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Observa elementos con clase .reveal y los anima al entrar al viewport
 */
export function initReveal() {
  const observer = new IntersectionObserver(
    (entries) => entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    }),
    { threshold: 0.1 }
  );
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}
