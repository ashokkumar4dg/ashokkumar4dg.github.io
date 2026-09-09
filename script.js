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
    // Interactive 3D Avatar Companion (Scroll-Stop Idle Detection & Section Guide)
    // ==========================================================================
    const initAvatarCompanion = () => {
        const companion = document.getElementById('avatar-companion');
        const bubble = document.getElementById('companion-bubble');
        const closeBtn = document.getElementById('companion-bubble-close');
        const badgeEl = document.getElementById('companion-badge');
        const textEl = document.getElementById('companion-text');
        const characterBtn = document.getElementById('companion-character-btn');
        const avatarImg = document.getElementById('companion-avatar-img');

        if (!companion || !bubble || !characterBtn || !avatarImg) return;

        // Section contextual dialogues & gestures
        const sectionDialogues = {
            'hero-sec': {
                badge: 'Ashok 3D Guide 👋',
                text: 'Hey! Welcome to my portfolio. I explain how design works, not just how it looks!',
                image: 'assets/Ashok_3D_Pointing.webp',
                flip: false
            },
            'work': {
                badge: 'Selected Projects 🚀',
                text: 'Explore these brand & e-commerce case studies! Built for conversion and trust.',
                image: 'assets/Ashok_3D_Pointing.webp',
                flip: false
            },
            'about': {
                badge: 'Design Philosophy 💡',
                text: 'Brand identity, Shopify, and social systems — designed to work better for business.',
                image: 'assets/Ashok_3D_Pointing.webp',
                flip: false
            },
            'experience': {
                badge: 'Experience Timeline 📈',
                text: 'From SouqArena to Man Series skincare — real impact with founders & growing brands.',
                image: 'assets/Ashok_3D_Pointing.webp',
                flip: false
            },
            'contact': {
                badge: 'Ready to Chat? 💬',
                text: 'Have an upcoming brand or web project? Send me a quick message via WhatsApp!',
                image: 'assets/WhiteTshirt_3D.webp',
                flip: false
            }
        };

        const randomTips = [
            'Tip: Consistent visual identity increases brand trust and retention by over 80%! ⚡',
            'I specialize in Shopify storefronts, brand guidelines, and high-impact social media creatives. 🎨',
            'Need an e-commerce overhaul or high-converting product page? Let’s connect! 🚀',
            'Design that works for business always beats decoration alone. 💡'
        ];
        let tipIndex = 0;

        let lastActiveSection = 'hero-sec';
        let scrollTimer = null;
        let bubbleAutoDismissTimer = null;
        let isUserSnoozed = false;
        let snoozeTimer = null;

        const showMessage = (badge, text, image, flip = false) => {
            if (isUserSnoozed) return;

            if (badgeEl) badgeEl.textContent = badge;
            if (textEl) textEl.textContent = text;
            if (avatarImg && image && avatarImg.getAttribute('src') !== image) {
                avatarImg.style.opacity = '0';
                setTimeout(() => {
                    avatarImg.src = image;
                    avatarImg.style.opacity = '1';
                }, 200);
            }

            if (avatarImg) {
                avatarImg.style.transform = flip ? 'scaleX(-1)' : 'scaleX(1)';
            }

            bubble.classList.add('bubble-visible');
            characterBtn.classList.add('is-waving');
            setTimeout(() => {
                characterBtn.classList.remove('is-waving');
            }, 1200);

            // Auto dismiss bubble after 7 seconds if user remains idle
            if (bubbleAutoDismissTimer) clearTimeout(bubbleAutoDismissTimer);
            bubbleAutoDismissTimer = setTimeout(() => {
                bubble.classList.remove('bubble-visible');
            }, 7000);
        };

        const hideMessage = () => {
            bubble.classList.remove('bubble-visible');
            if (bubbleAutoDismissTimer) clearTimeout(bubbleAutoDismissTimer);
        };

        // Section observer to detect which section the user is currently viewing
        const sections = ['hero-sec', 'work', 'about', 'experience', 'contact']
            .map(id => document.getElementById(id))
            .filter(Boolean);

        const detectCurrentSection = () => {
            const scrollPos = window.scrollY + window.innerHeight * 0.45;
            let current = sections[0];

            for (let i = 0; i < sections.length; i++) {
                const sec = sections[i];
                const top = sec.offsetTop;
                const bottom = top + sec.offsetHeight;
                if (scrollPos >= top && scrollPos <= bottom) {
                    current = sec;
                    break;
                }
            }
            return current ? current.id : 'hero-sec';
        };

        // Scroll listener: detects active scroll vs idle stop
        window.addEventListener('scroll', () => {
            // Hide bubble while actively scrolling fast so it doesn't obstruct reading
            hideMessage();

            if (scrollTimer) clearTimeout(scrollTimer);

            // User stopped scrolling (idle detection: 1.2s pause)
            scrollTimer = setTimeout(() => {
                const currentSecId = detectCurrentSection();
                lastActiveSection = currentSecId;

                const dialogue = sectionDialogues[currentSecId] || sectionDialogues['hero-sec'];
                showMessage(dialogue.badge, dialogue.text, dialogue.image, dialogue.flip);
            }, 1200);
        }, { passive: true });

        // Initial welcome after 1.5s on page load
        setTimeout(() => {
            const dialogue = sectionDialogues['hero-sec'];
            showMessage(dialogue.badge, dialogue.text, dialogue.image, dialogue.flip);
        }, 1500);

        // Click on 3D character to trigger interactive greeting/tip
        characterBtn.addEventListener('click', () => {
            isUserSnoozed = false;
            const currentSecId = detectCurrentSection();
            const dialogue = sectionDialogues[currentSecId];

            tipIndex = (tipIndex + 1) % randomTips.length;
            const chosenTip = randomTips[tipIndex];

            showMessage(dialogue ? dialogue.badge : 'Ashok Says 💡', chosenTip, dialogue ? dialogue.image : 'assets/Ashok_3D_Pointing.webp');
        });

        // Close/Dismiss button
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                hideMessage();
                // Snooze automatic popups for 40 seconds so it doesn't disturb
                isUserSnoozed = true;
                if (snoozeTimer) clearTimeout(snoozeTimer);
                snoozeTimer = setTimeout(() => {
                    isUserSnoozed = false;
                }, 40000);
            });
        }
    };
    initAvatarCompanion();

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
