/**
 * Ashok Kumar Portfolio - Core Interactions & Form Handling
 */

function initPortfolio() {
    // 1. Mobile Menu Toggle
    const toggle = document.getElementById('mobile-toggle');
    const nav = document.getElementById('nav-links');
    
    const closeMenu = () => {
        nav?.classList.remove('active');
        toggle?.setAttribute('aria-expanded', 'false');
        toggle?.setAttribute('aria-label', 'Open navigation');
    };

    toggle?.addEventListener('click', () => {
        const open = toggle.getAttribute('aria-expanded') !== 'true';
        nav?.classList.toggle('active', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    });

    nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') {
            closeMenu();
            toggle.focus();
        }
    });

    document.addEventListener('click', event => {
        if (!event.target.closest('.navbar')) {
            closeMenu();
        }
    });

    if (window.matchMedia) {
        window.matchMedia('(min-width: 641px)').addEventListener('change', closeMenu);
    }

    // 2. Project Category Filtering
    const filters = document.querySelectorAll('.filter-btn');
    const projects = document.querySelectorAll('.project-card[data-category]');
    const filterStatus = document.getElementById('filter-status');

    filters.forEach(button => {
        button.addEventListener('click', () => {
            filters.forEach(item => {
                const isActive = item === button;
                item.classList.toggle('active', isActive);
                item.setAttribute('aria-pressed', String(isActive));
            });

            const activeCategory = button.dataset.filter;
            let visibleCount = 0;

            projects.forEach(project => {
                const matches = activeCategory === 'all' || project.dataset.category === activeCategory;
                project.hidden = !matches;
                if (matches) visibleCount++;
            });

            if (filterStatus) {
                filterStatus.textContent = `${visibleCount} ${visibleCount === 1 ? 'project' : 'projects'} shown.`;
            }
        });
    });

    // 3. Direct WhatsApp Contact Form Dispatch (No multi-click friction)
    const form = document.getElementById('portfolio-contact-form');
    const feedback = document.getElementById('form-feedback');
    const fallbackLink = document.getElementById('whatsapp-link');

    form?.addEventListener('submit', event => {
        event.preventDefault();

        const nameInput = document.getElementById('form-name');
        const emailInput = document.getElementById('form-email');
        const messageInput = document.getElementById('form-message');

        const name = (nameInput?.value || '').trim();
        const email = (emailInput?.value || '').trim();
        const message = (messageInput?.value || '').trim();

        // Validation
        if (!name) {
            nameInput?.focus();
            return;
        }
        if (!message) {
            messageInput?.focus();
            return;
        }

        const data = new FormData(form);
        const reason = data.get('reason') || 'General inquiry';

        const waText = `Hi Ashok! 👋\n\n*Name:* ${name}\n*Email:* ${email || 'Not specified'}\n*Looking for:* ${reason}\n\n*Project Details:*\n${message}`;
        const waUrl = `https://wa.me/918696289847?text=${encodeURIComponent(waText)}`;

        // Provide fallback link in case popup blocker intercepts
        if (fallbackLink) {
            fallbackLink.href = waUrl;
        }
        if (feedback) {
            feedback.hidden = false;
        }

        // Direct open
        const newTab = window.open(waUrl, '_blank', 'noopener,noreferrer');
        if (newTab) {
            newTab.focus();
            if (feedback) {
                feedback.innerHTML = '<p style="color: #16a34a; font-weight: 500;">✓ Message generated and opened in WhatsApp!</p>';
            }
        }
    });

    // 4. Scrollspy Navigation Indicator
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    nav?.querySelectorAll('a').forEach(link => {
                        if (link.getAttribute('href') === `#${id}`) {
                            link.setAttribute('aria-current', 'location');
                        } else {
                            link.removeAttribute('aria-current');
                        }
                    });
                }
            });
        }, { rootMargin: '-20% 0px -60% 0px' });

        document.querySelectorAll('main > section[id]').forEach(section => observer.observe(section));
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortfolio);
} else {
    initPortfolio();
}
