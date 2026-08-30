function initPortfolio() {
    // Initialize Lucide Icons if loaded
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    const htmlElement = document.documentElement;

    // ==========================================================================
    // Theme Switcher & Asset Management
    // ==========================================================================
    const themeBtn = document.getElementById('theme-btn');
    const navLogo = document.getElementById('nav-logo-img');
    const profileContainer = document.getElementById('profile-container');

    const updateThemeAssets = (theme) => {
        if (navLogo) {
            const isSubfolder = window.location.pathname.includes('/work/');
            const basePath = isSubfolder ? '../assets/' : 'assets/';
            navLogo.src = theme === 'light' ? `${basePath}Logo2.webp` : `${basePath}Logo1.webp`;
        }
    };

    const storedTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-theme', storedTheme);
    updateThemeAssets(storedTheme);

    if (themeBtn) {
        const toggleTheme = () => {
            const currentTheme = htmlElement.getAttribute('data-theme') || 'dark';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeAssets(newTheme);
        };

        themeBtn.addEventListener('click', () => {
            if (!document.startViewTransition) {
                toggleTheme();
                return;
            }

            document.startViewTransition(() => {
                toggleTheme();
            });
        });
    }

    // ==========================================================================
    // Portrait 3D Cartoon Morph (Hover, Touch & Mobile Scroll)
    // ==========================================================================
    if (profileContainer) {
        // Desktop mouse hover listeners
        profileContainer.addEventListener('mouseenter', () => {
            profileContainer.classList.add('hover-cartoon');
        });
        profileContainer.addEventListener('mouseleave', () => {
            profileContainer.classList.remove('hover-cartoon');
        });

        // Touch toggle for mobile devices
        profileContainer.addEventListener('touchstart', () => {
            profileContainer.classList.toggle('mobile-cartoon');
        }, { passive: true });

        // Mobile scroll-triggered morph
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            profileContainer.classList.toggle('mobile-cartoon', scrollY > 20);
        }, { passive: true });
    }

    // ==========================================================================
    // Mobile Menu Toggle
    // ==========================================================================
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinks = document.getElementById('nav-links');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close mobile menu when clicking any nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // ==========================================================================
    // Subtle Scroll Reveal Animation (Intersection Observer)
    // ==========================================================================
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal-element').forEach(item => {
        revealObserver.observe(item);
    });

    // ==========================================================================
    // Contact Form — Project Type Pills
    // ==========================================================================
    const reasonPills = document.querySelectorAll('.reason-pill');
    const hiddenReasonInput = document.getElementById('form-reason');

    reasonPills.forEach(pill => {
        pill.addEventListener('click', () => {
            reasonPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            if (hiddenReasonInput) {
                hiddenReasonInput.value = pill.dataset.value;
            }
        });
    });

    // ==========================================================================
    // Contact Form — WhatsApp Redirect
    // ==========================================================================
    const contactForm = document.getElementById('portfolio-contact-form');
    const formFeedback = document.getElementById('form-feedback');
    const submitBtn = document.getElementById('submit-btn');

    if (contactForm && submitBtn) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('form-name').value.trim();
            const reason = hiddenReasonInput ? hiddenReasonInput.value.trim() : '';
            const email = document.getElementById('form-email').value.trim();
            const message = document.getElementById('form-message').value.trim();

            if (!name || !reason || !email || !message) {
                if (!reason) alert('Please select a project type.');
                return;
            }

            const waText = `Name: ${name}\nProject Type: ${reason}\nEmail: ${email}\n\nMessage:\n${message}`;
            const waUrl = `https://wa.me/918696289847?text=${encodeURIComponent(waText)}`;

            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';
            if (formFeedback) {
                formFeedback.style.display = 'block';
            }

            setTimeout(() => {
                window.open(waUrl, '_blank');
                contactForm.reset();
                reasonPills.forEach(p => p.classList.remove('active'));
                if (hiddenReasonInput) hiddenReasonInput.value = '';
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                setTimeout(() => {
                    if (formFeedback) formFeedback.style.display = 'none';
                }, 3000);
            }, 500);
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortfolio);
} else {
    initPortfolio();
}
