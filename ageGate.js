/* ageGate.js */
function checkAge() {
    const isAdult = localStorage.getItem('isAdult');
    if (!isAdult) {
        const gate = document.createElement('div');
        gate.id = 'age-gate';
        gate.innerHTML = `
            <div style="position:fixed; inset:0; background:#0a0f0b; z-index:9999; display:flex; align-items:center; justify-content:center; text-align:center; padding:20px;">
                <div style="background:#111a13; padding:40px; border-radius:20px; border:1px solid #4caf50;">
                    <h2 style="font-family:'Fredoka',sans-serif; color:#fdd835; font-size:2rem; margin-bottom:10px;">¿Eres mayor de edad?</h2>
                    <p style="color:#8cba91; margin-bottom:20px;">Debes tener más de 18 años para ingresar a Piña GrowShop.</p>
                    <button onclick="confirmAge()" style="background:#4caf50; color:black; padding:10px 30px; border-radius:50px; font-weight:bold; cursor:pointer;">SÍ, SOY MAYOR</button>
                </div>
            </div>
        `;
        document.body.appendChild(gate);
    }
}

function confirmAge() {
    localStorage.setItem('isAdult', 'true');
    document.getElementById('age-gate').remove();
}

checkAge();
