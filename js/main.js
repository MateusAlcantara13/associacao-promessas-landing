// ===== VARIABLES GLOBAIS =====
let isMenuOpen = false;
let hasAnimated = {
    stats: false,
    about: false,
    projects: false
};

// ===== ELEMENTS =====
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const header = document.querySelector('.header');

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    initializeObservers();
    initializeAnimations();
    initializeContactForm();
    console.log('🎉 Site da Associação Promessas carregado com sucesso!');
});

// Adicionar função global para o botão do formulário
window.toggleContactForm = toggleContactForm;

// ===== EVENT LISTENERS =====
function initializeEventListeners() {
    // Menu mobile toggle
    menuToggle?.addEventListener('click', toggleMobileMenu);
    
    // Smooth scroll para links de navegação
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', handleSmoothScroll);
    });
    
    // Scroll effects
    window.addEventListener('scroll', handleScroll);
    
    // Resize handler
    window.addEventListener('resize', handleResize);
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
    
    // Click outside menu to close
    document.addEventListener('click', handleOutsideClick);
}

// ===== MENU FUNCTIONS =====
function toggleMobileMenu(e) {
    e.stopPropagation();
    isMenuOpen = !isMenuOpen;
    
    navLinks?.classList.toggle('active');
    menuToggle?.classList.toggle('active');
    
    // Adicionar aria attributes para acessibilidade
    menuToggle?.setAttribute('aria-expanded', isMenuOpen);
    navLinks?.setAttribute('aria-hidden', !isMenuOpen);
    
    // Animação do ícone do menu
    const icon = menuToggle?.querySelector('i');
    if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    }
}

function closeMobileMenu() {
    if (isMenuOpen) {
        isMenuOpen = false;
        navLinks?.classList.remove('active');
        menuToggle?.classList.remove('active');
        menuToggle?.setAttribute('aria-expanded', false);
        navLinks?.setAttribute('aria-hidden', true);
        
        const icon = menuToggle?.querySelector('i');
        if (icon) {
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        }
    }
}

// ===== NAVIGATION FUNCTIONS =====
function handleSmoothScroll(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
        const headerHeight = header?.offsetHeight || 0;
        const targetPosition = targetSection.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        // Fechar menu mobile se estiver aberto
        closeMobileMenu();
        
        // Atualizar estado ativo do menu
        updateActiveNavLink(targetId);
    }
}

function updateActiveNavLink(activeId) {
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === activeId) {
            link.classList.add('active');
        }
    });
}

// ===== SCROLL FUNCTIONS =====
function handleScroll() {
    const scrollY = window.scrollY;
    
    // Header effect
    updateHeaderOnScroll(scrollY);
    
    // Parallax effect
    applyParallaxEffect(scrollY);
    
    // Update active section in navigation
    updateActiveSection();
}

function updateHeaderOnScroll(scrollY) {
    if (!header) return;
    
    if (scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
    }
}

function applyParallaxEffect(scrollY) {
    const parallaxElements = document.querySelectorAll('.parallax');
    parallaxElements.forEach(element => {
        const speed = element.dataset.speed || 0.5;
        const yPos = -(scrollY * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
}

function updateActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + (header?.offsetHeight || 0) + 50;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            updateActiveNavLink(`#${sectionId}`);
        }
    });
}

// ===== INTERSECTION OBSERVER =====
function initializeObservers() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    // Observer para animações gerais
    const animationObserver = new IntersectionObserver(handleIntersection, observerOptions);
    
    // Observer específico para estatísticas
    const statsObserver = new IntersectionObserver(handleStatsIntersection, observerOptions);
    
    // Observar elementos
    document.querySelectorAll('.stat-card, .project-card, .about-text, .about-image').forEach(el => {
        animationObserver.observe(el);
    });
    
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
}

function handleIntersection(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const element = entry.target;
            element.classList.add('animate');
            
            // Adicionar delay para cards em sequência
            if (element.classList.contains('project-card')) {
                const cards = Array.from(element.parentNode.children);
                const index = cards.indexOf(element);
                element.style.animationDelay = `${index * 0.1}s`;
            }
        }
    });
}

function handleStatsIntersection(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated.stats) {
            hasAnimated.stats = true;
            animateStatNumbers();
            entry.target.querySelectorAll('.stat-card').forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('animate');
                }, index * 100);
            });
        }
    });
}

// ===== ANIMATION FUNCTIONS =====
function initializeAnimations() {
    // Adicionar classe para elementos que devem animar na entrada
    const elementsToAnimate = document.querySelectorAll('.stat-card, .project-card, .about-text, .about-image');
    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
    });
}

function animateStatNumbers() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(numberElement => {
        const finalNumber = numberElement.textContent.replace('+', '');
        const isPlus = numberElement.textContent.includes('+');
        
        if (!isNaN(finalNumber)) {
            animateCounter(numberElement, parseInt(finalNumber), isPlus);
        }
    });
}

function animateCounter(element, target, hasPlus = false, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Usar easing function para animação mais suave
        const easedProgress = easeOutQuart(progress);
        const currentValue = Math.floor(start + (target * easedProgress));
        
        element.textContent = currentValue + (hasPlus ? '+' : '');
        element.classList.add('counting');
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.classList.remove('counting');
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Easing function
function easeOutQuart(t) {
    return 1 - (--t) * t * t * t;
}

// ===== UTILITY FUNCTIONS =====
function handleResize() {
    // Fechar menu mobile ao redimensionar
    if (window.innerWidth > 768 && isMenuOpen) {
        closeMobileMenu();
    }
    
    // Recalcular posições se necessário
    updateActiveSection();
}

function handleKeyboardNavigation(e) {
    // Escape para fechar menu mobile
    if (e.key === 'Escape' && isMenuOpen) {
        closeMobileMenu();
    }
    
    // Tab navigation melhorada
    if (e.key === 'Tab') {
        handleTabNavigation(e);
    }
}

function handleTabNavigation(e) {
    const focusableElements = document.querySelectorAll(
        'a[href], button, [tabindex]:not([tabindex="-1"])'
    );
    
    if (isMenuOpen) {
        const menuItems = navLinks?.querySelectorAll('a');
        if (menuItems) {
            const firstMenuItem = menuItems[0];
            const lastMenuItem = menuItems[menuItems.length - 1];
            
            if (e.shiftKey && document.activeElement === firstMenuItem) {
                e.preventDefault();
                menuToggle?.focus();
            } else if (!e.shiftKey && document.activeElement === lastMenuItem) {
                e.preventDefault();
                menuToggle?.focus();
            }
        }
    }
}

function handleOutsideClick(e) {
    if (isMenuOpen && !navLinks?.contains(e.target) && !menuToggle?.contains(e.target)) {
        closeMobileMenu();
    }
}

// ===== CONTACT FUNCTIONS =====
function initializeContactForm() {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    // Aqui você pode adicionar a lógica para envio do formulário
    showNotification('Mensagem enviada com sucesso!', 'success');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// ===== PERFORMANCE OPTIMIZATIONS =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Otimizar evento de scroll
const optimizedScrollHandler = debounce(handleScroll, 10);
window.addEventListener('scroll', optimizedScrollHandler);

// ===== ACCESSIBILITY IMPROVEMENTS =====
function improveAccessibility() {
    // Adicionar skip link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Pular para o conteúdo principal';
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Melhorar foco visível
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('using-keyboard');
        }
    });
    
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('using-keyboard');
    });
}

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('Erro no site da Associação Promessas:', e.error);
});

// ===== ANALYTICS (opcional) =====
function trackEvent(eventName, properties = {}) {
    // Integração com Google Analytics ou outro serviço
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, properties);
    }
    
    console.log('Event tracked:', eventName, properties);
}

// Exemplo de uso do tracking
document.querySelectorAll('.cta-button, .contact-button').forEach(button => {
    button.addEventListener('click', () => {
        trackEvent('button_click', {
            button_text: button.textContent.trim(),
            section: button.closest('section')?.id || 'unknown'
        });
    });
});

// ===== FINAL INITIALIZATION =====
// Melhorar acessibilidade ao carregar
document.addEventListener('DOMContentLoaded', improveAccessibility);

// Log de carregamento
console.log('🌟 Associação Beneficente Promessas - Site carregado!');
console.log('📞 Contato: (11) 98400-3314');
console.log('🏠 Endereço: Av. dos Ipês, 210 - Jardim dos Ipês');