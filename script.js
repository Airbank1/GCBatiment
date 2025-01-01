// Initialisation des animations
AOS.init({
    duration: 1000,
    once: true
});

// Effet de scroll pour la navigation
window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
        document.getElementById('mainNav').classList.add('scroll-nav', 'shadow-md');
    } else {
        document.getElementById('mainNav').classList.remove('scroll-nav', 'shadow-md');
    }
});

// Nouveau code pour forcer le scroll en haut au rafraîchissement
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
}

// Alternative qui s'assure que la page commence en haut même si onbeforeunload ne fonctionne pas
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}
window.onload = function() {
    window.scrollTo(0, 0);
}

function openModal(imageSrc) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    modal.style.display = 'flex';
    modalImg.src = imageSrc;
}

function closeModal() {
    document.getElementById('imageModal').style.display = 'none';
}