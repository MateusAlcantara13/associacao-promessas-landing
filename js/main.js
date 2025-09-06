// ===== MOBILE MENU TOGGLE =====
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('nav-open');
            
            // Animação do ícone do menu
            const icon = menuToggle.querySelector('i');
            if (navLinks.classList.contains('nav-open')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Fechar menu ao clicar em um link
        const navItems = navLinks.querySelectorAll('a');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('nav-open');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }
});

// ===== SCROLL REVEAL ANIMATIONS =====
class ScrollReveal {
    constructor() {
        this.elements = document.querySelectorAll('[class*="scroll-reveal"]');
        this.windowHeight = window.innerHeight;
        this.init();
    }
    
    init() {
        // Adicionar classe inicial aos elementos
        this.elements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = this.getInitialTransform(element);
            element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        });
        
        // Verificar elementos visíveis no carregamento
        this.checkElements();
        
        // Adicionar listener de scroll
        window.addEventListener('scroll', () => this.checkElements());
        window.addEventListener('resize', () => {
            this.windowHeight = window.innerHeight;
            this.checkElements();
        });
    }
    
    getInitialTransform(element) {
        const classes = element.className;
        
        if (classes.includes('scroll-reveal-left')) {
            return 'translateX(-50px)';
        } else if (classes.includes('scroll-reveal-right')) {
            return 'translateX(50px)';
        } else if (classes.includes('scroll-reveal-scale')) {
            return 'scale(0.8)';
        } else {
            return 'translateY(50px)';
        }
    }
    
    checkElements() {
        this.elements.forEach(element => {
            if (this.isElementInViewport(element) && !element.classList.contains('revealed')) {
                this.revealElement(element);
            }
        });
    }
    
    isElementInViewport(element) {
        const rect = element.getBoundingClientRect();
        const threshold = this.windowHeight * 0.1; // 10% da altura da janela
        
        return (
            rect.top <= this.windowHeight - threshold &&
            rect.bottom >= threshold
        );
    }
    
    revealElement(element) {
        element.classList.add('revealed');
        element.style.opacity = '1';
        element.style.transform = 'translateX(0) translateY(0) scale(1)';
    }
}

// ===== COUNTER ANIMATION =====
class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('.stat-number');
        this.init();
    }
    
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    this.animateCounter(entry.target);
                    entry.target.classList.add('counted');
                }
            });
        }, { threshold: 0.5 });
        
        this.counters.forEach(counter => observer.observe(counter));
    }
    
    animateCounter(element) {
        const target = element.textContent;
        const isPlus = target.includes('+');
        const numericValue = parseInt(target.replace(/\D/g, ''));
        
        let current = 0;
        const increment = numericValue / 50; // 50 steps
        const duration = 2000; // 2 seconds
        const stepTime = duration / 50;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= numericValue) {
                current = numericValue;
                clearInterval(timer);
            }
            
            element.textContent = Math.floor(current) + (isPlus ? '+' : '');
        }, stepTime);
    }
}

// ===== SMOOTH SCROLLING =====
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== HEADER SCROLL EFFECT =====
function initHeaderScrollEffect() {
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'var(--white)';
            header.style.backdropFilter = 'none';
        }
        
        // Hide/show header on scroll
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });
}

// ===== STAGGER ANIMATION =====
function initStaggerAnimation() {
    const staggerElements = document.querySelectorAll('.stagger-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100); // 100ms delay between each element
            }
        });
    }, { threshold: 0.2 });
    
    staggerElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(element);
    });
}

// ===== PARALLAX EFFECT =====
function initParallaxEffect() {
    const parallaxElements = document.querySelectorAll('.hero-background');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        parallaxElements.forEach(element => {
            element.style.transform = `translateY(${rate}px)`;
        });
    });
}

// ===== LOADING ANIMATION =====
function initLoadingAnimation() {
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        
        // Trigger hero animations
        const heroElements = document.querySelectorAll('.hero-content > *');
        heroElements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 200);
        });
    });
}

// ===== FORM ENHANCEMENTS =====
function initFormEnhancements() {
    const inputs = document.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        // Add focus effects
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
        
        // Check if input has value on load
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });
}

// ===== BUTTON RIPPLE EFFECT =====
function initButtonRipple() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .donation-btn, .contact-button');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const ripple = document.createElement('span');
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// ===== INTERSECTION OBSERVER POLYFILL CHECK =====
function initIntersectionObserver() {
    if (!('IntersectionObserver' in window)) {
        // Fallback for older browsers
        const elements = document.querySelectorAll('[class*="scroll-reveal"]');
        elements.forEach(element => {
            element.style.opacity = '1';
            element.style.transform = 'none';
        });
        return;
    }
}

// ===== PERFORMANCE OPTIMIZATIONS =====
function initPerformanceOptimizations() {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback: load all images immediately
        images.forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
        });
    }
}

// ===== ACCESSIBILITY IMPROVEMENTS =====
function initAccessibility() {
    // Skip to content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Pular para o conteúdo principal';
    skipLink.className = 'skip-link';
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Focus management for mobile menu
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            const isOpen = navLinks.classList.contains('nav-open');
            menuToggle.setAttribute('aria-expanded', isOpen);
            navLinks.setAttribute('aria-hidden', !isOpen);
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Close mobile menu on escape
            if (navLinks && navLinks.classList.contains('nav-open')) {
                navLinks.classList.remove('nav-open');
                menuToggle.focus();
            }
        }
    });
}

// ===== INITIALIZE ALL FEATURES =====
document.addEventListener('DOMContentLoaded', function() {
    // Core functionality
    initIntersectionObserver();
    new ScrollReveal();
    new CounterAnimation();
    initSmoothScrolling();
    initHeaderScrollEffect();
    initStaggerAnimation();
    
    // Visual enhancements
    initParallaxEffect();
    initLoadingAnimation();
    initButtonRipple();
    
    // Performance and accessibility
    initPerformanceOptimizations();
    initAccessibility();
    initFormEnhancements();
    
    console.log('🎉 Site da Associação Promessas carregado com sucesso!');
});

// ===== CSS ANIMATIONS VIA JAVASCRIPT =====
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        pointer-events: none;
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .loaded .hero-content > * {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.8s ease;
    }
    
    .lazy {
        opacity: 0;
        transition: opacity 0.3s;
    }
    
    .lazy.loaded {
        opacity: 1;
    }
`;
document.head.appendChild(style);