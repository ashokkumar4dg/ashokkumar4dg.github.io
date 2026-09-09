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

    // ==========================================================================
    // 3D Card Tilt with Specular Lighting & Spring Physics
    // ==========================================================================
    const init3DCardTilt = () => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        if ('ontouchstart' in window && window.innerWidth < 1024) return;

        const cards = document.querySelectorAll('.project-card');
        cards.forEach(card => {
            const wrapper = card.querySelector('.project-img-wrapper');
            if (!wrapper) return;

            let glare = wrapper.querySelector('.card-glare');
            if (!glare) {
                glare = document.createElement('div');
                glare.className = 'card-glare';
                wrapper.appendChild(glare);
            }

            let bounds = null;
            let currentRotX = 0;
            let currentRotY = 0;
            let targetRotX = 0;
            let targetRotY = 0;
            let isHovered = false;
            let rafId = null;

            const renderTilt = () => {
                if (!isHovered) {
                    targetRotX = 0;
                    targetRotY = 0;
                }

                // Smooth linear interpolation (lerp)
                currentRotX += (targetRotX - currentRotX) * 0.12;
                currentRotY += (targetRotY - currentRotY) * 0.12;

                wrapper.style.transform = `perspective(1000px) rotateX(${currentRotX.toFixed(2)}deg) rotateY(${currentRotY.toFixed(2)}deg) translateY(${isHovered ? -6 : 0}px)`;

                if (isHovered || Math.abs(currentRotX) > 0.05 || Math.abs(currentRotY) > 0.05) {
                    rafId = requestAnimationFrame(renderTilt);
                } else {
                    wrapper.style.transform = '';
                    glare.style.opacity = '0';
                    rafId = null;
                }
            };

            card.addEventListener('mouseenter', () => {
                bounds = wrapper.getBoundingClientRect();
                isHovered = true;
                glare.style.opacity = '1';
                if (!rafId) {
                    rafId = requestAnimationFrame(renderTilt);
                }
            });

            card.addEventListener('mousemove', (e) => {
                if (!bounds) bounds = wrapper.getBoundingClientRect();
                const posX = e.clientX - bounds.left;
                const posY = e.clientY - bounds.top;

                const normX = (posX / bounds.width) - 0.5;
                const normY = (posY / bounds.height) - 0.5;

                targetRotX = -normY * 14;
                targetRotY = normX * 14;

                const glareX = (posX / bounds.width) * 100;
                const glareY = (posY / bounds.height) * 100;
                glare.style.background = `radial-gradient(circle at ${glareX.toFixed(1)}% ${glareY.toFixed(1)}%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.05) 30%, transparent 65%)`;
            });

            card.addEventListener('mouseleave', () => {
                isHovered = false;
                bounds = null;
            });
        });
    };
    init3DCardTilt();

    // ==========================================================================
    // Hero Avatar Mode Switcher (3D Avatar vs Real Portrait)
    // ==========================================================================
    const initAvatarModeSwitcher = () => {
        const tab3D = document.getElementById('tab-3d-avatar');
        const tabReal = document.getElementById('tab-real-photo');
        const container = document.getElementById('profile-container');

        if (!tab3D || !tabReal || !container) return;

        const setMode = (mode) => {
            if (mode === 'avatar') {
                tab3D.classList.add('active');
                tabReal.classList.remove('active');
                container.classList.remove('active-real');
                container.classList.add('active-avatar');
            } else {
                tabReal.classList.add('active');
                tab3D.classList.remove('active');
                container.classList.remove('active-avatar');
                container.classList.add('active-real');
            }
        };

        tab3D.addEventListener('click', () => setMode('avatar'));
        tabReal.addEventListener('click', () => setMode('real'));

        // Re-initialize any newly rendered Lucide icons
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        }
    };
    initAvatarModeSwitcher();

    // ==========================================================================
    // Hero 3D Avatar Parallax (Mouse Following Tilt)
    // ==========================================================================
    const initHero3DParallax = () => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        if ('ontouchstart' in window && window.innerWidth < 1024) return;

        const heroSec = document.getElementById('hero-sec');
        const heroWrapper = document.getElementById('hero-3d-wrapper');
        if (!heroSec || !heroWrapper) return;

        let targetTiltX = 0;
        let targetTiltY = 0;
        let currentTiltX = 0;
        let currentTiltY = 0;
        let isHeroHovered = false;
        let heroRaf = null;

        const renderHeroParallax = () => {
            if (!isHeroHovered) {
                targetTiltX = 0;
                targetTiltY = 0;
            }

            currentTiltX += (targetTiltX - currentTiltX) * 0.1;
            currentTiltY += (targetTiltY - currentTiltY) * 0.1;

            heroWrapper.style.transform = `perspective(1200px) rotateX(${currentTiltX.toFixed(2)}deg) rotateY(${currentTiltY.toFixed(2)}deg)`;

            if (isHeroHovered || Math.abs(currentTiltX) > 0.05 || Math.abs(currentTiltY) > 0.05) {
                heroRaf = requestAnimationFrame(renderHeroParallax);
            } else {
                heroWrapper.style.transform = '';
                heroRaf = null;
            }
        };

        heroSec.addEventListener('mousemove', (e) => {
            const rect = heroSec.getBoundingClientRect();
            const normX = ((e.clientX - rect.left) / rect.width) - 0.5;
            const normY = ((e.clientY - rect.top) / rect.height) - 0.5;

            targetTiltX = -normY * 14; // smooth ±7 deg
            targetTiltY = normX * 18;  // smooth ±9 deg
            isHeroHovered = true;

            if (!heroRaf) {
                heroRaf = requestAnimationFrame(renderHeroParallax);
            }
        });

        heroSec.addEventListener('mouseleave', () => {
            isHeroHovered = false;
        });
    };
    initHero3DParallax();

    // ==========================================================================
    // Arrow Fill Button Touch & Pointer States (Haptic tactile feel)
    // ==========================================================================
    const initArrowFillButtons = () => {
        const arrowBtns = document.querySelectorAll('.arrow-fill-btn');
        arrowBtns.forEach(btn => {
            btn.addEventListener('pointerdown', (e) => {
                if (e.pointerType !== 'mouse') {
                    btn.setAttribute('data-pressed', 'true');
                }
            });

            const clearPress = () => {
                setTimeout(() => {
                    btn.setAttribute('data-pressed', 'false');
                }, 450);
            };

            btn.addEventListener('pointerup', clearPress);
            btn.addEventListener('pointercancel', clearPress);
        });
    };
    initArrowFillButtons();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortfolio);
} else {
    initPortfolio();
}
