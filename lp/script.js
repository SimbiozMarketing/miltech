// ==================== SCENARIO TABS ==================== //
document.addEventListener('DOMContentLoaded', function() {
    const scenarioTabs = document.querySelectorAll('.scenario-tab');
    const scenarioPanes = document.querySelectorAll('.scenario-pane');

    scenarioTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const scenarioId = this.getAttribute('data-scenario');

            // Remove active class from all tabs and panes
            scenarioTabs.forEach(t => t.classList.remove('active'));
            scenarioPanes.forEach(p => p.classList.remove('active'));

            // Add active class to clicked tab and corresponding pane
            this.classList.add('active');
            const pane = document.getElementById(`scenario-${scenarioId}`);
            if (pane) {
                pane.classList.add('active');
            }
        });
    });
});

// ==================== SMOOTH SCROLLING ==================== //
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ==================== STICKY HEADER ==================== //
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
    }
});

// ==================== FORM SUBMISSION ==================== //
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = new FormData(this);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            message: formData.get('message')
        };

        // Validate form
        if (!data.name || !data.email) {
            alert('Будь ласка, заповніть всі обов\'язкові поля');
            return;
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            alert('Будь ласка, введіть коректний e-mail');
            return;
        }

        // Send form (placeholder - replace with actual API)
        console.log('Form submitted:', data);

        // Show success message
        alert('Спасибі! Ми зв\'яжемося з вами в найближчі 24 години.');
        this.reset();
    });
}

// ==================== CTA BUTTONS ==================== //
const ctaButtons = document.querySelectorAll('.btn--primary');
ctaButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Scroll to contact form
        const contactSection = document.getElementById('cta');
        if (contactSection) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = contactSection.offsetTop - headerHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ==================== MOBILE MENU TOGGLE ==================== //
function initMobileMenu() {
    const nav = document.querySelector('.nav');
    const navList = document.querySelector('.nav__list');

    if (!nav) return;

    // Check if we need mobile menu
    if (window.innerWidth <= 768) {
        if (!document.querySelector('.mobile-menu-toggle')) {
            const toggle = document.createElement('button');
            toggle.className = 'mobile-menu-toggle';
            toggle.innerHTML = '☰';
            toggle.addEventListener('click', function() {
                navList.classList.toggle('active');
                toggle.classList.toggle('active');
            });
            nav.parentElement.insertBefore(toggle, nav.nextSibling);
        }
    }
}

window.addEventListener('resize', initMobileMenu);
initMobileMenu();

// ==================== LAZY LOADING ==================== //
if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    const elements = document.querySelectorAll('.problem-card, .feature-card, .pricing-card, .impl-step');
    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out';
        observer.observe(el);
    });
}

// ==================== ACTIVE NAVIGATION LINK ==================== //
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link');

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ==================== COMPARISON TABLE RESPONSIVE ==================== //
function makeComparisonTableResponsive() {
    const table = document.querySelector('.comparison-table table');
    if (!table || window.innerWidth > 768) return;

    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const headers = table.querySelectorAll('th');

        cells.forEach((cell, index) => {
            const headerText = headers[index]?.textContent;
            if (headerText) {
                cell.setAttribute('data-label', headerText);
            }
        });
    });
}

makeComparisonTableResponsive();
window.addEventListener('resize', makeComparisonTableResponsive);

// ==================== FORM PHONE MASK ==================== //
const phoneInput = document.querySelector('input[name="phone"]');
if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        let formattedValue = '';

        if (value.length > 0) {
            if (value.length <= 2) {
                formattedValue = value;
            } else if (value.length <= 5) {
                formattedValue = value.slice(0, 2) + ' (' + value.slice(2);
            } else if (value.length <= 7) {
                formattedValue = value.slice(0, 2) + ' (' + value.slice(2, 5) + ') ' + value.slice(5);
            } else if (value.length <= 9) {
                formattedValue = value.slice(0, 2) + ' (' + value.slice(2, 5) + ') ' + value.slice(5, 7) + '-' + value.slice(7);
            } else {
                formattedValue = value.slice(0, 2) + ' (' + value.slice(2, 5) + ') ' + value.slice(5, 7) + '-' + value.slice(7, 9) + '-' + value.slice(9, 11);
            }
        }

        e.target.value = '+' + formattedValue;
    });
}

// ==================== ANALYTICS - PAGE VIEW ==================== //
document.addEventListener('DOMContentLoaded', function() {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_view', {
            page_path: window.location.pathname
        });
    }
});

// ==================== SCROLL DEPTH TRACKING ==================== //
let maxScroll = 0;
window.addEventListener('scroll', function() {
    const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;

    if (scrollPercentage > maxScroll) {
        maxScroll = scrollPercentage;

        // Track milestones
        if (maxScroll > 25 && maxScroll <= 30) {
            console.log('Scroll depth: 25%');
        } else if (maxScroll > 50 && maxScroll <= 55) {
            console.log('Scroll depth: 50%');
        } else if (maxScroll > 75 && maxScroll <= 80) {
            console.log('Scroll depth: 75%');
        } else if (maxScroll > 90) {
            console.log('Scroll depth: 90%');
        }
    }
});

// ==================== CLICK TRACKING FOR CTA ==================== //
document.querySelectorAll('.btn--primary').forEach(button => {
    button.addEventListener('click', function() {
        const buttonText = this.textContent.trim();
        console.log('CTA clicked:', buttonText);
    });
});

// ==================== UTILITY: ADD ACTIVE CLASS TO NAV LINK ==================== //
function setActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav__link');
    const currentPath = window.location.hash;

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('hashchange', setActiveNavLink);
setActiveNavLink();

console.log('Simbioz EMS Landing Page loaded successfully');
