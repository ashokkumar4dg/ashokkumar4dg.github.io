function initPortfolio() {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // ==========================================================================
    // Theme Switcher Logic (Dark / Light Theme)
    // ==========================================================================
    const themeBtn = document.getElementById('theme-btn');
    const htmlElement = document.documentElement;

    // Helper to dynamically switch assets based on theme
    const updateThemeAssets = (theme) => {
        // Navbar logo
        const navLogo = document.getElementById('nav-logo-img');
        if (navLogo) {
            navLogo.src = theme === 'light' ? 'assets/Logo2.png' : 'assets/Logo1.png';
        }

        // Favicon
        let favicon = document.querySelector("link[rel='icon']");
        if (favicon) {
            favicon.href = theme === 'light' ? 'assets/Logo2.png' : 'assets/Logo1.png';
        }
    };

    // Load theme from localStorage or default to system preference (or dark mode)
    const storedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = storedTheme || (systemPrefersDark ? 'dark' : 'light');
    
    htmlElement.setAttribute('data-theme', initialTheme);
    updateThemeAssets(initialTheme);

    themeBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeAssets(newTheme);
    });

    // ==========================================================================
    // Custom Interactive Mouse Cursor (Only for Desktop Mouse Pointers)
    // ==========================================================================
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');
    
    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;
    let isMoving = false;

    // Disable custom cursor for touch screens
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

    if (!isTouchDevice) {
        // Track mouse movement
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            isMoving = true;
            
            cursorDot.style.opacity = '1';
            cursorOutline.style.opacity = '1';
            
            // Instantly position the dot
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        });

        // Smooth trailing effect for outline cursor using lerp (Linear Interpolation)
        const animateOutline = () => {
            const easeFactor = 0.15; // Speed of tracking outline
            outlineX += (mouseX - outlineX) * easeFactor;
            outlineY += (mouseY - outlineY) * easeFactor;
            
            cursorOutline.style.left = `${outlineX}px`;
            cursorOutline.style.top = `${outlineY}px`;
            
            requestAnimationFrame(animateOutline);
        };
        animateOutline();

        // Hide cursors when mouse leaves the viewport
        document.addEventListener('mouseleave', () => {
            cursorDot.style.opacity = '0';
            cursorOutline.style.opacity = '0';
        });

        // Add hover effects for interactive elements
        const interactiveElements = document.querySelectorAll('a, button, input, select, textarea, .project-card, .filter-btn');
        interactiveElements.forEach((el) => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.style.width = '50px';
                cursorOutline.style.height = '50px';
                cursorOutline.style.backgroundColor = 'var(--accent-glow)';
                cursorOutline.style.borderColor = 'var(--accent)';
            });

            el.addEventListener('mouseleave', () => {
                cursorOutline.style.width = '32px';
                cursorOutline.style.height = '32px';
                cursorOutline.style.backgroundColor = 'transparent';
                cursorOutline.style.borderColor = 'var(--accent)';
            });
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
    const menuLinks = document.querySelectorAll('.nav-link');
    menuLinks.forEach(link => {
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
        button.addEventListener('click', (e) => {
            // Remove active class from previous active button and add to current
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.style.display = 'block';
                    // Trigger fade in animation
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    // Delay setting display none until scaling down transition completes
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 250);
                }
            });
        });
    });

    // ==========================================================================
    // Project Case Study Data & Overlay Trigger
    // ==========================================================================
    const PROJECTS_DATA = {
        'brand': {
            category: 'Brand Identity',
            title: 'Identity & Branding Systems',
            role: 'Lead Visual Designer',
            client: 'Startups & Ventures',
            deliverables: 'Vector Logos, Brand Guidelines, Business Stationery',
            challenge: 'Startups often struggle to tell a cohesive visual story. A simple logo is not enough; they need a complete, unified visual system that scales across high-resolution print, merchandise, web, and app headers without losing clarity.',
            strategy: 'I developed fully responsive geometric branding structures. We prioritized custom grid vectors, balanced typographic weights, and a clean monochrome aesthetic. The design ensures crisp reproduction, giving new businesses a solid, premium market presence.',
            palette: ['#09090b', '#fafafa', '#a1a1aa', '#27272a'],
            fontHeading: 'Archivo',
            fontBody: 'Space Grotesk',
            banner: 'assets/project-brand.png',
            gallery: ['assets/project-brand.png', 'assets/project-brand.png']
        },
        'social': {
            category: 'Social Media',
            title: 'Social Media Creative Campaign',
            role: 'Social Media Graphic Designer',
            client: 'Marketing Agencies',
            deliverables: 'Instagram/LinkedIn Post Templates, Slide Carousels',
            challenge: 'With social media platforms suffering from sensory overload, creative assets must capture scroll-stopping attention within 1.5 seconds while maintaining grid consistency and brand recognition.',
            strategy: 'I optimized visual hierarchies by implementing high-contrast editorial blocks, spacious margins, and clear focal graphics. Carousels are structured around marketing hook frameworks to maximize scroll retention and profile click-throughs.',
            palette: ['#fafafa', '#a1a1aa', '#ff5a5f', '#18181b'],
            fontHeading: 'Space Grotesk',
            fontBody: 'Archivo',
            banner: 'assets/project-social.png',
            gallery: ['assets/project-social.png', 'assets/project-social.png']
        },
        'book': {
            category: 'Book Cover Layout',
            title: 'Premium Book Cover Layouts',
            role: 'Cover & Print Designer',
            client: 'Independent Authors',
            deliverables: 'Front & Back Covers, Spines, Digital E-Book Covers',
            challenge: 'Book covers must instantly telegraph their genre and tone while standing out as readable thumbnails in digital stores, and meeting strict physical print CMYK specifications.',
            strategy: 'I created heavy typographic-driven designs featuring strong visual metaphors. Spine sizing calculations and bleed margins were locked to millimeter precision, blending hand-designed textures with modern, conceptual vector shapes.',
            palette: ['#c29f63', '#1e293b', '#fafafa', '#0f172a'],
            fontHeading: 'Archivo',
            fontBody: 'Space Grotesk',
            banner: 'assets/project-book.png',
            gallery: ['assets/project-book.png', 'assets/project-book.png']
        },
        'web': {
            category: 'UI/UX Design',
            title: 'UI/UX & Vibe-Coded Web Designs',
            role: 'UI/UX & Frontend Designer',
            client: 'SouqArena / Freelance Projects',
            deliverables: 'Wireframes, Hi-Fi Mockups, Responsive UI Layouts',
            challenge: 'Portfolios and commercial landing pages often fail to convert visitors due to boring, static grids, slow performance, or overly complicated navigation blocks.',
            strategy: 'I crafted clean layouts using glassmorphic card overlays, interactive mouse spotlights, and quick WhatsApp redirections. The structure smoothly guides the user from value statements to CTA buttons, ensuring high responsiveness.',
            palette: ['#000000', '#ffffff', '#22c55e', '#18181b'],
            fontHeading: 'Space Grotesk',
            fontBody: 'Space Grotesk',
            banner: 'assets/project-web.png',
            gallery: ['assets/project-web.png', 'assets/project-web.png']
        },
        'poster': {
            category: 'Poster Art',
            title: 'Creative Poster Design Showcase',
            role: 'Graphic / Poster Designer',
            client: 'Personal & Creative Projects',
            deliverables: 'Print Layouts, Digital Creative Post Art, Typography Systems',
            challenge: 'Designing print poster layouts requires balancing strong artistic metaphors with clean geometric spaces, high-contrast typography hierarchy, and a structured layout that immediately communicates the design concept.',
            strategy: 'I designed a series of Swiss-inspired posters combining bold grid divisions, clean vector elements, and geometric typography. These assets explore the relationship between positive and negative space in graphic communication.',
            palette: ['#000000', '#ffffff', '#f4f4f5', '#a1a1aa'],
            fontHeading: 'Archivo',
            fontBody: 'Space Grotesk',
            banner: 'assets/project-poster.png',
            gallery: ['assets/project-poster.png', 'assets/project-poster.png']
        },
        'invitation': {
            category: 'Print Design',
            title: 'Premium Invitation Layouts',
            role: 'Graphic & Print Designer',
            client: 'Private Commissions',
            deliverables: 'Custom Stationery Design, Foil Print Cards, Layout Guides',
            challenge: 'Event invitation cards must communicate crucial details clearly while establishing a premium, celebratory tone. They require strict print specifications, exact bleed math, and card texture pairing selections.',
            strategy: 'I designed bespoke editorial layout concepts blending luxurious serif headings with neat, spacious details. I utilized a champagne-gold and off-white color palette to represent high elegance and print value.',
            palette: ['#c5a880', '#2d3748', '#fafafa', '#edf2f7'],
            fontHeading: 'Playfair Display / Serif',
            fontBody: 'Space Grotesk',
            banner: 'assets/project-invitation.png',
            gallery: ['assets/project-invitation.png', 'assets/project-invitation.png']
        }
    };

    const lightbox = document.getElementById('project-lightbox');
    const lightboxClose = document.getElementById('lightbox-close-btn');

    // Elements inside the Case Study Overlay
    const csBanner = document.getElementById('case-study-banner-img');
    const csCategory = document.getElementById('case-study-category');
    const csTitle = document.getElementById('case-study-title');
    const csRole = document.getElementById('case-study-role');
    const csDeliverables = document.getElementById('case-study-deliverables');
    const csClient = document.getElementById('case-study-client');
    const csChallenge = document.getElementById('case-study-challenge');
    const csStrategy = document.getElementById('case-study-strategy-text');
    const csPalette = document.getElementById('case-study-palette-container');
    const csFontHeading = document.getElementById('case-study-font-heading');
    const csFontBody = document.getElementById('case-study-font-body');
    const csGallery = document.getElementById('case-study-gallery-container');

    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            // Find category from card attribute
            const categoryAttr = card.getAttribute('data-category');
            const data = PROJECTS_DATA[categoryAttr];
            
            if (!data) return;

            // Populate text content
            csBanner.setAttribute('src', data.banner);
            csBanner.setAttribute('alt', data.title);
            csCategory.innerText = data.category;
            csTitle.innerText = data.title;
            csRole.innerText = data.role;
            csDeliverables.innerText = data.deliverables;
            csClient.innerText = data.client;
            csChallenge.innerText = data.challenge;
            csStrategy.innerText = data.strategy;
            csFontHeading.innerText = data.fontHeading;
            csFontBody.innerText = data.fontBody;

            // Generate Color Swatches
            csPalette.innerHTML = '';
            data.palette.forEach(color => {
                const swatchItem = document.createElement('div');
                swatchItem.className = 'swatch-item';
                swatchItem.innerHTML = `
                    <div class="swatch-circle" style="background-color: ${color};" title="HEX: ${color}"></div>
                    <span class="swatch-hex">${color}</span>
                `;
                csPalette.appendChild(swatchItem);
            });

            // Generate Gallery Images
            csGallery.innerHTML = '';
            data.gallery.forEach((imgSrc, index) => {
                const imgWrapper = document.createElement('div');
                imgWrapper.className = 'gallery-img-wrapper';
                imgWrapper.innerHTML = `
                    <img src="${imgSrc}" alt="${data.title} Mockup ${index + 1}" class="gallery-img">
                `;
                csGallery.appendChild(imgWrapper);
            });

            // Show lightbox overlay and disable background scrolling
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Re-trigger Lucide Icons inside the dynamically loaded HTML if needed
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        });
    });

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto'; // Restore scrolling
        setTimeout(() => {
            csBanner.setAttribute('src', '');
            csPalette.innerHTML = '';
            csGallery.innerHTML = '';
        }, 300);
    };

    lightboxClose.addEventListener('click', closeLightbox);

    // Close lightbox when clicking outside the case study modal content
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Close lightbox on Escape key press
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });

    // ==========================================================================
    // Reveal On Scroll Animation (Intersection Observer)
    // ==========================================================================
    const revealItems = document.querySelectorAll('.animate-reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Reveal only once
            }
        });
    }, {
        threshold: 0.1, // Element is 10% visible
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before screen bottom
    });

    revealItems.forEach(item => {
        revealObserver.observe(item);
    });

    // ==========================================================================
    // Timeline Progress Bar Scroll Animation
    // ==========================================================================
    const timelineContainer = document.querySelector('.timeline-container');
    const timelineProgressBar = document.querySelector('.timeline-progress-bar');
    const timelineItems = document.querySelectorAll('.timeline-item');

    function updateTimelineProgress() {
        if (!timelineContainer || !timelineProgressBar) return;

        const containerRect = timelineContainer.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // The top of the timeline is containerRect.top relative to the viewport.
        // We start filling the progress bar when the top of the container crosses 60% of the viewport height.
        // We finish filling when the bottom of the container crosses 50% of the viewport height.
        const triggerStart = viewportHeight * 0.6;
        const triggerEnd = viewportHeight * 0.5;

        // Top of the timeline container relative to the trigger line
        const containerTop = containerRect.top;
        const containerHeight = containerRect.height;

        let progress = 0;

        // Calculate progress percentage
        if (containerTop < triggerStart) {
            // How much we scrolled past the trigger point
            const scrolledHeight = triggerStart - containerTop;
            
            // Limit calculation between 0 and the container height (offsetting trigger end point)
            progress = scrolledHeight / (containerHeight - (viewportHeight * 0.1));
            progress = Math.min(Math.max(progress, 0), 1);
        }

        // Apply progress height
        timelineProgressBar.style.height = `${progress * 100}%`;

        // Check each timeline item and add/remove class based on scroll position
        // This coordinates marker activation and card glowing
        timelineItems.forEach(item => {
            const itemRect = item.getBoundingClientRect();
            // If the item enters the viewport's middle-bottom area (65% from top), activate it
            if (itemRect.top < viewportHeight * 0.65) {
                item.classList.add('in-view');
            } else {
                item.classList.remove('in-view');
            }
        });
    }

    // Attach scroll and resize listeners for smooth responsive handling
    window.addEventListener('scroll', updateTimelineProgress);
    window.addEventListener('resize', updateTimelineProgress);
    
    // Initial run to capture elements already in viewport on page load
    setTimeout(updateTimelineProgress, 200);

    // ==========================================================================
    // Floating Navbar Scroll Shadow & Hide-Show Effect
    // ==========================================================================
    const navbar = document.getElementById('main-navbar');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
            navbar.style.borderBottomColor = 'var(--accent)';
        } else {
            navbar.style.boxShadow = 'none';
            navbar.style.borderBottomColor = 'var(--border)';
        }

        // Hide/Show floating navbar depending on scroll direction
        if (window.scrollY > lastScrollY && window.scrollY > 150) {
            // Scrolling down - hide navbar
            navbar.style.top = '-100px';
        } else {
            // Scrolling up - show navbar
            navbar.style.top = '1rem';
        }
        lastScrollY = window.scrollY;
    });

    // ==========================================================================
    // Contact Form — Reason Pills Selection Interactivity
    // ==========================================================================
    const reasonPills = document.querySelectorAll('.reason-pill');
    const hiddenReasonInput = document.getElementById('form-reason');

    reasonPills.forEach(pill => {
        pill.addEventListener('click', () => {
            // Deselect all pills in the group
            reasonPills.forEach(p => p.classList.remove('selected'));
            // Select the clicked pill
            pill.classList.add('selected');
            // Update the hidden input value
            hiddenReasonInput.value = pill.dataset.value;
        });
    });

    // ==========================================================================
    // Contact Form — WhatsApp Redirect
    // Submitting the form opens WhatsApp with the client's name, reason, email & message
    // ==========================================================================
    const contactForm = document.getElementById('portfolio-contact-form');
    const formFeedback = document.getElementById('form-feedback');
    const submitBtn = document.getElementById('submit-btn');
    const submitBtnText = submitBtn.querySelector('span');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Collect values
        const name    = document.getElementById('form-name').value.trim();
        const reason  = document.getElementById('form-reason').value.trim();
        const email   = document.getElementById('form-email').value.trim();
        const message = document.getElementById('form-message').value.trim();

        if (!name || !reason || !email || !message) {
            if (!reason) {
                alert('Please select a reason for contacting me.');
            }
            return;
        }

        // Build the WhatsApp message text in the exact format user requested
        const waText = 
            `${name}\n` +
            `${reason}\n` +
            `${email}\n` +
            `\n` +
            `${message}`;

        // Encode for URL
        const encoded = encodeURIComponent(waText);

        // Your WhatsApp number (international format, no +)
        const ASHOK_WA = '918696289847';
        const waUrl = `https://wa.me/${ASHOK_WA}?text=${encoded}`;

        // Show feedback briefly then open WhatsApp
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
        submitBtnText.innerText = 'Opening WhatsApp...';

        formFeedback.classList.add('active');

        setTimeout(() => {
            window.open(waUrl, '_blank');
            contactForm.reset();
            // Clear selected pills
            reasonPills.forEach(p => p.classList.remove('selected'));
            hiddenReasonInput.value = '';
            
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
            submitBtnText.innerText = 'Send via WhatsApp';

            setTimeout(() => {
                formFeedback.classList.remove('active');
            }, 4000);
        }, 800);
    });

    // ==========================================================================
    // Active Link Switcher On Scroll
    // ==========================================================================
    const sections = document.querySelectorAll('section');
    const navLinksList = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            // Trigger 150px before section comes into view
            if (window.scrollY >= (sectionTop - 150)) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinksList.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // ==========================================================================
    // Mobile / Touch Scroll Cartoon Morph
    // ==========================================================================
    const profileContainer = document.getElementById('profile-container');
    if (profileContainer) {
        const handleMobileScroll = () => {
            const isMobile = window.matchMedia('(max-width: 768px)').matches || 
                             window.matchMedia('(pointer: coarse)').matches;
            if (isMobile) {
                if (window.scrollY > 30) {
                    profileContainer.classList.add('mobile-cartoon');
                } else {
                    profileContainer.classList.remove('mobile-cartoon');
                }
            } else {
                profileContainer.classList.remove('mobile-cartoon');
            }
        };

        window.addEventListener('scroll', handleMobileScroll);
        // Run once on load to sync state
        handleMobileScroll();
    }

    // (Grid canvas removed to eliminate background dots)
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortfolio);
} else {
    initPortfolio();
}
