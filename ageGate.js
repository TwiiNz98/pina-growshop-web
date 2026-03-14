// ============================================================
// AGE GATE MODULE — verificación de edad
// ============================================================

const KEY = 'piña_age_verified';

export function checkAge() {
  const modal = document.getElementById('age-modal');
  if (!modal) return;
  if (localStorage.getItem(KEY) === 'true') {
    modal.classList.add('hidden');
  }
  // Si no está verificado, el modal permanece visible (es el estado por defecto del HTML)
}

export function confirmAge() {
  localStorage.setItem(KEY, 'true');
  const modal = document.getElementById('age-modal');
  if (modal) {
    modal.style.animation = 'none';
    modal.style.opacity = '0';
    modal.style.transition = 'opacity 400ms';
    setTimeout(() => modal.classList.add('hidden'), 400);
  }
}

export function denyAge() {
  document.body.innerHTML = `
    <div style="
      display:flex; flex-direction:column; align-items:center; justify-content:center;
      min-height:100vh; background:#080B08; color:#6B7A67;
      font-family:'DM Sans',sans-serif; text-align:center; padding:40px;
    ">
      <p style="font-size:40px; margin-bottom:24px;">🌿</p>
      <h1 style="font-size:24px; color:#EFF3EC; margin-bottom:12px;">Acceso restringido</h1>
      <p style="font-size:15px; max-width:320px; line-height:1.7;">
        Debes ser mayor de 18 años para acceder a este sitio.
      </p>
    </div>
  `;
}
