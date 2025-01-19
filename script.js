document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init({
        duration: 1000,
        once: false,
        mirror: true,
        anchorPlacement: 'top-bottom',
        disable: 'mobile'
    });

    // Créer l'overlay pour le modal de rédaction
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    document.body.appendChild(overlay);

    // Elements de Navigation
    const mainNav = document.getElementById('mainNav');
    const menuButton = document.querySelector('.menu-button');
    const mobileMenu = document.querySelector('.mobile-menu');
    const logoLink = document.querySelector('.logo-link');

    // Elements des Modals
    const redactionModal = document.getElementById('redactionModal');
    const confirmationModal = document.getElementById('confirmationModal');
    const modalMentionsLegales = document.getElementById('modal-mentions-legales');
    const closeRedactionBtn = document.getElementById('closeRedactionBtn');
    const closeConfirmationBtn = document.getElementById('closeConfirmationBtn');
    const showLegalBtn = document.querySelector('a[href="#modal-mentions-legales"]');
    const closeModalBtn = document.getElementById('close-modal');
    const contactSection = document.getElementById('contact');

    // Elements du Formulaire
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const sendFinalBtn = document.getElementById('sendFinalBtn');
    const requestTypeSelect = document.querySelector('select[name="requestType"]');
    const checkbox = form.querySelector('input[type="checkbox"]');
    const checkboxError = checkbox.parentElement.nextElementSibling;

    // Elements du Modal de Rédaction
    const mailSubject = document.getElementById('mailSubject');
    const messageContent = document.getElementById('messageContent');

    // Elements Hero
    const devisButton = document.querySelector('a[href="#contact"].bg-green-500');
    const postulerButton = document.querySelector('a[href="#contact"].bg-blue-500');

    // Fonction pour vérifier la collision du logo
    function checkLogoCollision() {
        const mainLogo = document.querySelector('.main-logo');
        const mobileLogo = document.querySelector('.mobile-logo');
        const menuButton = document.querySelector('.menu-button');
        
        if (mainLogo && mobileLogo && menuButton) {
            const logoRect = mainLogo.getBoundingClientRect();
            const menuRect = menuButton.getBoundingClientRect();
            const isColliding = (logoRect.right + 20) >= menuRect.left;
            
            mainLogo.style.display = isColliding ? 'none' : 'block';
            mobileLogo.style.display = isColliding ? 'block' : 'none';
        }
    }

    // Ajouter une variable pour la position de défilement
    let scrollPosition = 0;

    // Gestionnaires d'overlay
    function showOverlay() {
        scrollPosition = window.scrollY; // Sauvegarder la position actuelle
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.top = `-${scrollPosition}px`; // Ajuster la position du body
    }

    function hideOverlay() {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.top = '';
        window.scrollTo(0, scrollPosition); // Restaurer la position précédente
        contactSection.classList.remove('contact-section-animate');
        void contactSection.offsetWidth;
        contactSection.classList.add('contact-section-animate');
    }

    // Gestionnaire du menu mobile
    let isMenuOpen = false;
    menuButton?.addEventListener('click', (e) => {
        e.stopPropagation();
        isMenuOpen = !isMenuOpen;
        mobileMenu.style.display = isMenuOpen ? 'block' : 'none';
        mobileMenu.classList.toggle('active', isMenuOpen);
        menuButton.setAttribute('aria-expanded', isMenuOpen);
    });

    // Fermeture du menu mobile lors d'un clic à l'extérieur
    document.addEventListener('click', (e) => {
        if (isMenuOpen && !mobileMenu.contains(e.target) && e.target !== menuButton) {
            isMenuOpen = false;
            mobileMenu.style.display = 'none';
            mobileMenu.classList.remove('active');
            menuButton.setAttribute('aria-expanded', 'false');
        }
    });

    // Navigation fluide
    document.querySelectorAll('.mobile-menu a, #mainNav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
            if (isMenuOpen) {
                isMenuOpen = false;
                mobileMenu.style.display = 'none';
                mobileMenu.classList.remove('active');
                menuButton.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // Logo click handler
    logoLink?.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('accueil').scrollIntoView({ behavior: 'smooth' });
    });

    // Scroll navigation
    window.addEventListener('scroll', () => {
        requestAnimationFrame(() => {
            mainNav.classList.toggle('scroll-nav', window.scrollY > 50);
            mainNav.classList.toggle('shadow-md', window.scrollY > 50);
        });
    });

    // Séparation de la logique de rafraîchissement
    window.addEventListener('load', () => {
        window.scrollTo(0, 0); // Scroll vers le haut uniquement au chargement initial
        checkLogoCollision();
        resetModalFields();
    });

    // Réinitialisation des champs uniquement lors du rafraîchissement
    window.onbeforeunload = function () {
        resetFormFields();
        resetModalFields();
    }

    // Event listeners des boutons Hero
    devisButton?.addEventListener('click', (e) => {
        requestTypeSelect.value = 'devis';
        form.scrollIntoView({ behavior: 'smooth' });
    });

    postulerButton?.addEventListener('click', (e) => {
        requestTypeSelect.value = 'candidature';
        form.scrollIntoView({ behavior: 'smooth' });
    });

    // Validation des champs
    function resetFieldState(field) {
        field.classList.remove('error-input', 'success-input');
        const errorDiv = field.nextElementSibling;
        if (errorDiv && errorDiv.classList.contains('error-message')) {
            errorDiv.style.display = 'none';
        }
        if (field.tagName.toLowerCase() === 'select') {
            field.classList.remove('success-input', 'error-input');
        }
    }

    function checkFieldValidity(field) {
        const value = field.value.trim();
        
        if (field.hasAttribute('required') && !value) {
            return false;
        }

        if (value) {
            switch(field.type) {
                case 'email':
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                case 'tel':
                    return /^(0|\+33)[1-9]([-. ]?[0-9]{2}){4}$/.test(value.replace(/\s/g, ''));
                case 'text':
                    return value.length >= 2;
                case 'textarea':
                    return value.length >= 10;
                default:
                    return true;
            }
        }
        return true;
    }

    function showSuccessValidation(field) {
        if (field.value.trim() && checkFieldValidity(field)) {
            field.classList.remove('error-input');
            field.classList.add('success-input');
        } else {
            field.classList.remove('success-input');
        }
    
        if (field.tagName.toLowerCase() === 'select') {
            field.classList.remove('success-input');
        }
    }

    function showErrorValidation(field) {
        let errorDiv = field.nextElementSibling;
        if (!errorDiv || !errorDiv.classList.contains('error-message')) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            field.parentNode.insertBefore(errorDiv, field.nextSibling);
        }
        
        const value = field.value.trim();
        field.classList.remove('error-input');
        errorDiv.style.display = 'none';

        if (field.hasAttribute('required') && !value) {
            field.classList.add('error-input');
            errorDiv.textContent = '* Ce champ est requis';
            errorDiv.style.display = 'block';
            return false;
        }

        if (value) {
            let isValid = true;
            switch(field.type) {
                case 'email':
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                        isValid = false;
                        errorDiv.textContent = '* Email invalide';
                    }
                    break;
                case 'tel':
                    if (!/^(0|\+33)[1-9]([-. ]?[0-9]{2}){4}$/.test(value.replace(/\s/g, ''))) {
                        isValid = false;
                        errorDiv.textContent = '* Numéro de téléphone invalide';
                    }
                    break;
                case 'textarea':
                    if (value.length < 10) {
                        isValid = false;
                        errorDiv.textContent = '* Ce champ doit contenir au moins 10 caractères';
                    }
                    break;
                case 'text':
                    if (value.length < 2) {
                        isValid = false;
                        errorDiv.textContent = '* Ce champ doit contenir au moins 2 caractères';
                    }
                    break;
            }

            if (!isValid) {
                field.classList.add('error-input');
                errorDiv.style.display = 'block';
                return false;
            }
        }
        return true;
    }

    // Event listeners pour la validation des champs
    const allFields = document.querySelectorAll('input:not([type="checkbox"]), select, textarea');
    allFields.forEach(field => {
        field.addEventListener('focus', () => resetFieldState(field));
        field.addEventListener('blur', () => showSuccessValidation(field));
        field.addEventListener('input', () => showSuccessValidation(field));
    });

    // Event listener pour la checkbox
    checkbox.addEventListener('click', () => {
        if (checkboxError) {
            checkboxError.style.display = 'none';
        }
    });

    // Validation du formulaire
    function validateForm() {
        let isValid = true;
        const requiredFields = form.querySelectorAll('input[required]:not([type="checkbox"]), select[required], textarea[required]');
        
        requiredFields.forEach(field => {
            if (!showErrorValidation(field)) {
                isValid = false;
            }
        });

        if (!checkbox.checked) {
            isValid = false;
            if (checkboxError) {
                checkboxError.style.display = 'block';
                checkboxError.textContent = '* Veuillez accepter les conditions';
            }
        }

        return isValid;
    }

    function validateModalFields() {
        const subject = document.getElementById('mailSubject');
        const message = document.getElementById('messageContent');
        let isValid = true;

        if (!showErrorValidation(subject)) isValid = false;
        if (!showErrorValidation(message)) isValid = false;

        return isValid;
    }

    // Réinitialisation des champs du modal
    function resetModalFields() {
        if (mailSubject) {
            mailSubject.value = '';
            resetFieldState(mailSubject);
        }
        
        if (messageContent) {
            messageContent.value = '';
            resetFieldState(messageContent);
        }
    }

    function resetFormFields() {
        const inputs = form.querySelectorAll('input:not([name="requestType"]), textarea');
        inputs.forEach(input => {
            if (input.type === 'checkbox') {
                input.checked = false;
            } else {
                input.value = '';
            }
            input.classList.remove('error-input', 'success-input');
            const errorDiv = input.nextElementSibling;
            if (errorDiv && errorDiv.classList.contains('error-message')) {
                errorDiv.style.display = 'none';
            }
        });

        if (requestTypeSelect) {
            requestTypeSelect.value = 'devis';
        }

        const fieldsToReset = ['firstName', 'lastName', 'email', 'phone'];
        fieldsToReset.forEach(fieldName => {
            const input = form.querySelector(`input[name="${fieldName}"]`);
            if (input) {
                input.value = '';
                const errorDiv = input.nextElementSibling;
                if (errorDiv && errorDiv.classList.contains('error-message')) {
                    errorDiv.style.display = 'none';
                }
            }
        });
    }

    // Event listeners pour les boutons des modals
    submitBtn?.addEventListener('click', () => {
        if (validateForm()) {
            showOverlay();
            redactionModal.style.display = 'block';
        }
    });

    sendFinalBtn?.addEventListener('click', () => {
        if (validateModalFields()) {
            redactionModal.style.display = 'none';
            confirmationModal.style.display = 'flex';
            resetModalFields(); // Réinitialise les champs après l'envoi
            hideOverlay();
        }
    });

    closeRedactionBtn?.addEventListener('click', () => {
        redactionModal.style.display = 'none';
        hideOverlay();
        resetModalFields();
    });

    closeConfirmationBtn?.addEventListener('click', () => {
        confirmationModal.style.display = 'none';
        resetFormFields();
        resetModalFields();
        hideOverlay();
        contactSection.classList.remove('contact-section-animate');
        void contactSection.offsetWidth;
        contactSection.classList.add('contact-section-animate');
    });

    showLegalBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        modalMentionsLegales.style.display = 'block';
        document.body.classList.add('modal-open');
        showOverlay();
    });

    closeModalBtn?.addEventListener('click', () => {
        modalMentionsLegales.style.display = 'none';
        document.body.classList.remove('modal-open');
        hideOverlay();
    });

    // Gestion des événements globaux
    window.addEventListener('resize', checkLogoCollision);
    window.addEventListener('load', () => {
        checkLogoCollision();
        resetModalFields(); // Réinitialise les champs au chargement
    });

    window.addEventListener('click', (e) => {
        if (e.target === redactionModal) {
            redactionModal.style.display = 'none';
            hideOverlay();
            resetModalFields();
        } else if (e.target === modalMentionsLegales) {
            modalMentionsLegales.style.display = 'none';
            document.body.classList.remove('modal-open');
            hideOverlay();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (redactionModal.style.display === 'block') {
                redactionModal.style.display = 'none';
                hideOverlay();
                resetModalFields();
            }
            if (modalMentionsLegales.style.display === 'block') {
                modalMentionsLegales.style.display = 'none';
                document.body.classList.remove('modal-open');
                hideOverlay();
            }
            if (confirmationModal.style.display === 'flex') {
                confirmationModal.style.display = 'none';
                resetFormFields();
                hideOverlay();
            }
        }
    });
});
