function initPortfolio() {
    // Remove preload class to enable transitions after initial layout paint
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            document.body.classList.remove('preload');
        });
    });

    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    const htmlElement = document.documentElement;

    // ==========================================================================
    // Image Skeleton Fade-In & Profile Container Shimmer Management
    // ==========================================================================
    const profileContainer = document.getElementById('profile-container');
    if (profileContainer) {
        profileContainer.classList.add('shimmer-active');
    }

    document.querySelectorAll('img.img-skeleton').forEach(img => {
        const reveal = () => {
            img.classList.add('img-loaded');
            // Remove container shimmer once the active theme's real image is loaded
            const activeTheme = htmlElement.getAttribute('data-theme') || 'light';
            const activeRealImg = document.getElementById(`profile-pic-real-${activeTheme}`);
            if (profileContainer && activeRealImg && (activeRealImg.classList.contains('img-loaded') || (activeRealImg.complete && activeRealImg.naturalWidth > 0))) {
                profileContainer.classList.remove('shimmer-active');
            }
        };

        if (img.complete && img.naturalWidth > 0) {
            reveal();
        } else {
            img.addEventListener('load', reveal);
            img.addEventListener('error', reveal);
        }
    });

    // Fallback safety to remove profile container shimmer after 2.5s anyway
    if (profileContainer) {
        setTimeout(() => {
            profileContainer.classList.remove('shimmer-active');
        }, 2500);
    }

    // ==========================================================================
    // Theme Switcher Logic (Dark / Light Theme) with Smooth Transition Overlay
    // ==========================================================================
    const themeBtn = document.getElementById('theme-btn');

    // Helper to dynamically switch assets based on theme
    const updateThemeAssets = (theme) => {
        // Navbar logo
        const navLogo = document.getElementById('nav-logo-img');
        if (navLogo) {
            navLogo.src = theme === 'light' ? 'assets/Logo2.webp' : 'assets/Logo1.webp';
        }

        // Favicon
        let favicon = document.querySelector("link[rel='icon']");
        if (favicon) {
            favicon.href = theme === 'light' ? 'assets/Logo2.webp' : 'assets/Logo1.webp';
        }
    };

    // Load theme from localStorage or default to system preference (or dark mode)
    const storedTheme = localStorage.getItem('theme');
    const initialTheme = storedTheme || 'light';
    
    htmlElement.setAttribute('data-theme', initialTheme);
    updateThemeAssets(initialTheme);

    const toggleTheme = () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeAssets(newTheme);
    };

    themeBtn.addEventListener('click', (e) => {
        // Check if browser supports startViewTransition
        if (!document.startViewTransition) {
            // Fallback to standard transition
            htmlElement.classList.add('theme-transition');
            toggleTheme();
            setTimeout(() => {
                htmlElement.classList.remove('theme-transition');
            }, 600);
            return;
        }

        // Circular swipe centered at button click coordinates
        const rect = themeBtn.getBoundingClientRect();
        const x = e.clientX || rect.left + rect.width / 2;
        const y = e.clientY || rect.top + rect.height / 2;
        const endRadius = Math.hypot(
            Math.max(x, window.innerWidth - x),
            Math.max(y, window.innerHeight - y)
        );

        // Add visual transition active class
        document.documentElement.classList.add('theme-transition-active');

        const transition = document.startViewTransition(() => {
            toggleTheme();
        });

        transition.ready.then(() => {
            const clipPath = [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${endRadius}px at ${x}px ${y}px)`
            ];
            document.documentElement.animate(
                {
                    clipPath: htmlElement.getAttribute('data-theme') === 'dark' 
                        ? clipPath.reverse() 
                        : clipPath
                },
                {
                    duration: 500,
                    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                    pseudoElement: '::view-transition-new(root)'
                }
            );
        });

        transition.finished.then(() => {
            document.documentElement.classList.remove('theme-transition-active');
        });
    });

    // ==========================================================================
    // ==========================================================================
    // Custom Interactive Mouse Cursor — GPU-composited via transform (Desktop only)
    // ==========================================================================
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');

    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;

    // Disable custom cursor for touch screens
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

    if (!isTouchDevice) {
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            cursorDot.style.opacity = '1';
            cursorOutline.style.opacity = '1';

            // Use transform instead of left/top — GPU composited, no layout recalc
            cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;

            // Background grid movement parallax variables relative to screen center
            const xPercent = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
            const yPercent = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
            document.documentElement.style.setProperty('--grid-move-x', `${xPercent * -15}px`);
            document.documentElement.style.setProperty('--grid-move-y', `${yPercent * -15}px`);
        }, { passive: true });

        // Smooth trailing outline — runs in its own rAF loop (independent of scroll)
        const animateOutline = () => {
            outlineX += (mouseX - outlineX) * 0.15;
            outlineY += (mouseY - outlineY) * 0.15;
            cursorOutline.style.transform = `translate(${outlineX}px, ${outlineY}px)`;
            requestAnimationFrame(animateOutline);
        };
        animateOutline();

        document.addEventListener('mouseleave', () => {
            cursorDot.style.opacity = '0';
            cursorOutline.style.opacity = '0';
        });

        // Cursor hover effects — uses CSS classes for cleaner state management
        document.addEventListener('mouseover', (e) => {
            const target = e.target.closest('a, button, input, select, textarea, .project-card, .filter-btn');
            if (target) {
                cursorOutline.style.width = '50px';
                cursorOutline.style.height = '50px';
                cursorOutline.style.marginTop = '-25px';
                cursorOutline.style.marginLeft = '-25px';
                cursorOutline.style.backgroundColor = 'var(--accent-glow)';
            }
        });
        document.addEventListener('mouseout', (e) => {
            const target = e.target.closest('a, button, input, select, textarea, .project-card, .filter-btn');
            if (target) {
                cursorOutline.style.width = '32px';
                cursorOutline.style.height = '32px';
                cursorOutline.style.marginTop = '-16px';
                cursorOutline.style.marginLeft = '-16px';
                cursorOutline.style.backgroundColor = 'transparent';
            }
        });
    }

    // ==========================================================================
    // Mobile Menu Toggle
    // ==========================================================================
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinks = document.getElementById('nav-links');

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

    // ==========================================================================
    // Portfolio Category Filtering
    // ==========================================================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');

                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => { card.style.display = 'none'; }, 250);
                }
            });
        });
    });

    // ==========================================================================
    // Project Redirects (Navigate to standalone project page)
    // ==========================================================================
    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const categoryAttr = card.getAttribute('data-category');
            if (categoryAttr && window.PROJECTS_DATA && window.PROJECTS_DATA[categoryAttr]) {
                window.location.href = `project.html?id=${categoryAttr}`;
            }
        });
    });

    // ==========================================================================
    // Bidirectional Reveal On Scroll Animation (Intersection Observer)
    // ==========================================================================
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');

                // Animate language progress bars when their parent lang-item enters view
                const langBar = entry.target.querySelector('.lang-bar');
                if (langBar) {
                    const targetWidth = langBar.getAttribute('data-width');
                    setTimeout(() => { langBar.style.width = targetWidth + '%'; }, 100);
                }
            } else {
                // If it scrolls out of view below the viewport, reset it
                // This enables it to re-reveal when scrolling back down!
                if (entry.boundingClientRect.top > 0) {
                    entry.target.classList.remove('active');
                    
                    const langBar = entry.target.querySelector('.lang-bar');
                    if (langBar) {
                        langBar.style.width = '0%';
                    }
                }
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.animate-reveal, .reveal-element').forEach(item => revealObserver.observe(item));

    // ==========================================================================
    // Unified Scroll Handler — Single RAF-throttled listener for ALL scroll work
    // Avoids multiple forced reflows from separate scroll listeners
    // ==========================================================================
    const navbar = document.getElementById('main-navbar');
    const sections = document.querySelectorAll('section[id]');
    const navLinksList = document.querySelectorAll('.nav-link');
    const timelineContainer = document.querySelector('.timeline-container');
    const timelineProgressBar = document.querySelector('.timeline-progress-bar');
    const timelineItems = document.querySelectorAll('.timeline-item');

    // Pre-calculate section offsets (avoids offsetTop in scroll handler → no reflow)
    let sectionOffsets = [];
    const cacheSectionOffsets = () => {
        sectionOffsets = Array.from(sections).map(s => ({
            id: s.getAttribute('id'),
            top: s.getBoundingClientRect().top + window.scrollY
        }));
    };
    cacheSectionOffsets();

    // Cache mobile check — don't re-evaluate matchMedia on every scroll
    let isMobileView = window.matchMedia('(max-width: 768px)').matches ||
                       window.matchMedia('(pointer: coarse)').matches;

    let lastScrollY = window.scrollY;
    let scrollRafId = null;
    let isScrollPending = false;

    const onScrollFrame = () => {
        scrollRafId = null;
        const scrollY = window.scrollY;
        const viewportHeight = window.innerHeight;

        // --- 1. Navbar shadow + hide/show ---
        if (scrollY > 50) {
            navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
            navbar.style.borderBottomColor = 'var(--accent)';
        } else {
            navbar.style.boxShadow = 'none';
            navbar.style.borderBottomColor = 'var(--border)';
        }
        if (scrollY > lastScrollY && scrollY > 150) {
            navbar.style.top = '-100px';
        } else {
            navbar.style.top = '1rem';
        }
        lastScrollY = scrollY;

        // --- 2. Active nav link (uses pre-cached offsets — no reflow) ---
        let currentId = '';
        for (let i = sectionOffsets.length - 1; i >= 0; i--) {
            if (scrollY >= sectionOffsets[i].top - 150) {
                currentId = sectionOffsets[i].id;
                break;
            }
        }
        navLinksList.forEach(link => {
            const active = link.getAttribute('href') === `#${currentId}`;
            link.classList.toggle('active', active);
        });

        // --- 3. Timeline progress bar ---
        if (timelineContainer && timelineProgressBar) {
            const rect = timelineContainer.getBoundingClientRect();
            const triggerStart = viewportHeight * 0.6;
            let progress = 0;
            if (rect.top < triggerStart) {
                progress = (triggerStart - rect.top) / (rect.height - viewportHeight * 0.1);
                progress = Math.min(Math.max(progress, 0), 1);
            }
            timelineProgressBar.style.height = `${progress * 100}%`;
            timelineItems.forEach(item => {
                item.classList.toggle('in-view', item.getBoundingClientRect().top < viewportHeight * 0.65);
            });
        }

        // --- 4. Mobile cartoon morph ---
        if (profileContainer && isMobileView) {
            profileContainer.classList.toggle('mobile-cartoon', scrollY > 30);
        }
    };

    // Single passive scroll listener — schedules work in rAF (no jank)
    window.addEventListener('scroll', () => {
        if (!scrollRafId) {
            scrollRafId = requestAnimationFrame(onScrollFrame);
        }
    }, { passive: true });

    // Debounced resize — recache offsets and mobile status
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            cacheSectionOffsets();
            isMobileView = window.matchMedia('(max-width: 768px)').matches ||
                           window.matchMedia('(pointer: coarse)').matches;
            onScrollFrame(); // Re-run after resize
        }, 150);
    });

    // Initial run
    setTimeout(onScrollFrame, 200);

    // ==========================================================================
    // Contact Form — Reason Pills
    // ==========================================================================
    const reasonPills = document.querySelectorAll('.reason-pill');
    const hiddenReasonInput = document.getElementById('form-reason');

    reasonPills.forEach(pill => {
        pill.addEventListener('click', () => {
            reasonPills.forEach(p => p.classList.remove('selected'));
            pill.classList.add('selected');
            hiddenReasonInput.value = pill.dataset.value;
        });
    });

    // ==========================================================================
    // Contact Form — WhatsApp Redirect
    // ==========================================================================
    const contactForm = document.getElementById('portfolio-contact-form');
    const formFeedback = document.getElementById('form-feedback');
    const submitBtn = document.getElementById('submit-btn');
    const submitBtnText = submitBtn.querySelector('span');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name    = document.getElementById('form-name').value.trim();
        const reason  = document.getElementById('form-reason').value.trim();
        const email   = document.getElementById('form-email').value.trim();
        const message = document.getElementById('form-message').value.trim();

        if (!name || !reason || !email || !message) {
            if (!reason) alert('Please select a reason for contacting me.');
            return;
        }

        const waText = `${name}\n${reason}\n${email}\n\n${message}`;
        const waUrl = `https://wa.me/ashokkumar4dg?text=${encodeURIComponent(waText)}`;

        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
        submitBtnText.innerText = 'Opening WhatsApp...';
        formFeedback.classList.add('active');

        setTimeout(() => {
            window.open(waUrl, '_blank');
            contactForm.reset();
            reasonPills.forEach(p => p.classList.remove('selected'));
            hiddenReasonInput.value = '';
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
            submitBtnText.innerText = 'Send via WhatsApp';
            setTimeout(() => { formFeedback.classList.remove('active'); }, 4000);
        }, 800);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortfolio);
} else {
    initPortfolio();
}
