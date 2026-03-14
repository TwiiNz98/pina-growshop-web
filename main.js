/* main.js */
document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('header');
    
    // Cambiar color de la Navbar al hacer Scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('bg-[rgba(5,9,6,0.95)]', 'shadow-2xl');
        } else {
            nav.classList.remove('bg-[rgba(5,9,6,0.95)]', 'shadow-2xl');
        }
    });

    // Revelar elementos al bajar (Scroll Reveal)
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('opacity-100', 'translate-y-0');
                entry.target.classList.remove('opacity-0', 'translate-y-10');
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        section.classList.add('transition-all', 'duration-700', 'opacity-0', 'translate-y-10');
        observer.observe(section);
    });
});
