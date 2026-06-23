function initProjectDetails() {
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
    // Theme Switcher Logic (Dark / Light Theme) with Smooth Transition Overlay
    // ==========================================================================
    const themeBtn = document.getElementById('theme-btn');
    if (themeBtn) {
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
    }

    // ==========================================================================
    // Fetch Project Data from URL
    // ==========================================================================
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');
    
    if (!projectId || !window.PROJECTS_DATA || !window.PROJECTS_DATA[projectId]) {
        // Redirect back to home if no valid project ID is found
        window.location.href = 'index.html';
        return;
    }

    const project = window.PROJECTS_DATA[projectId];

    // Populate Page Meta & Text
    document.title = `${project.title} | Ashok Kumar`;
    document.getElementById('project-category').innerText = project.category;
    document.getElementById('project-title').innerText = project.title;

    // Add Adding Soon badge to detail page title if applicable
    if (project.addingSoon) {
        const titleWrap = document.querySelector('.project-title-wrap');
        if (titleWrap) {
            const badgeSpan = document.createElement('span');
            badgeSpan.className = 'adding-soon-badge';
            badgeSpan.style.alignSelf = 'flex-start';
            badgeSpan.style.marginTop = '0.5rem';
            badgeSpan.innerText = 'Adding Soon...';
            titleWrap.appendChild(badgeSpan);
        }
    }
    document.getElementById('project-role').innerText = project.role;
    document.getElementById('project-deliverables').innerText = project.deliverables;
    document.getElementById('project-client').innerText = project.client;
    document.getElementById('project-challenge').innerText = project.challenge;
    document.getElementById('project-strategy-text').innerText = project.strategy;
    document.getElementById('project-font-heading').innerText = project.fontHeading;
    document.getElementById('project-font-body').innerText = project.fontBody;

    // Render Color Swatches
    const paletteContainer = document.getElementById('project-palette-container');
    paletteContainer.innerHTML = '';
    project.palette.forEach(color => {
        const swatchItem = document.createElement('div');
        swatchItem.className = 'project-swatch-item';
        swatchItem.innerHTML = `
            <div class="project-swatch-circle" style="background-color: ${color};" title="HEX: ${color}"></div>
            <span class="project-swatch-hex">${color}</span>
        `;
        paletteContainer.appendChild(swatchItem);
    });

    // Render Stacked Behance-Style Gallery or Interactive Selector Layout
    const galleryContainer = document.getElementById('project-gallery-container');
    galleryContainer.innerHTML = '';
    
    if (project.isMasterDetail) {
        project.items.forEach((item, itemIdx) => {
            const itemGroup = document.createElement('div');
            itemGroup.className = 'showcase-item-group';
            
            // Build specs HTML
            const fields = project.category === 'Book Cover Layout' 
                ? { 'Genre': item.genre, 'Publisher': item.publisher, 'Year': item.year }
                : project.category === 'Print Design'
                ? { 'Type': item.genre, 'Details': item.publisher, 'Year': item.year }
                : { 'Medium': item.genre, 'Size': item.publisher, 'Year': item.year };
                
            let specsHtml = '';
            Object.keys(fields).forEach(label => {
                specsHtml += `
                    <div class="showcase-spec-pill">
                        <span class="spec-pill-label">${label}:</span>
                        <span class="spec-pill-value">${fields[label]}</span>
                    </div>
                `;
            });
            
            let mediaHtml = '';
            if (item.addingSoon) {
                mediaHtml = `
                    <div class="gallery-placeholder-card animation-canvas-container scroll-reveal-img" style="background-color: #0b0b0e; border: 1px solid var(--border); border-radius: 16px; aspect-ratio: 16 / 9; position: relative; overflow: hidden; width: 100%;">
                        <canvas class="coming-soon-canvas" style="display: block; width: 100%; height: 100%;"></canvas>
                        <div class="canvas-text-overlay" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; pointer-events: none; width: 85%;">
                            <div class="glow-pulse-circle" style="width: 50px; height: 50px; border-radius: 50%; border: 2px solid var(--accent); margin: 0 auto 1.25rem auto; display: flex; align-items: center; justify-content: center; animation: glowPulse 2s infinite;">
                                <i data-lucide="loader" class="canvas-loading-icon" style="animation: spin 3s linear infinite; width: 20px; height: 20px; color: var(--accent);"></i>
                            </div>
                            <h4 style="font-family: var(--font-heading); font-size: 1.3rem; font-weight: 800; margin-bottom: 0.4rem; letter-spacing: -0.01em; color: #fff;">Arriving Soon</h4>
                            <p class="canvas-dynamic-status" style="font-size: 0.85rem; color: var(--text-secondary); transition: opacity 0.5s ease;">I'm working on it...</p>
                        </div>
                    </div>
                `;
            } else {
                item.gallery.forEach((src, idx) => {
                    mediaHtml += `
                        <div class="gallery-image-wrapper scroll-reveal-img">
                            <img src="${src}" alt="${item.title} Mockup ${idx + 1}" class="showcase-img" loading="lazy">
                        </div>
                    `;
                });
            }
            
            itemGroup.innerHTML = `
                <div class="showcase-item-header scroll-reveal-img">
                    <div class="showcase-item-title-block">
                        <span class="showcase-item-subtitle">${item.subtitle}</span>
                        <h3 class="showcase-item-title">${item.title}</h3>
                    </div>
                    <div class="showcase-item-meta">
                        <p class="showcase-item-desc">${item.description}</p>
                        <div class="showcase-item-specs-row">
                            ${specsHtml}
                        </div>
                    </div>
                </div>
                <div class="showcase-item-media-stack">
                    ${mediaHtml}
                </div>
            `;
            
            galleryContainer.appendChild(itemGroup);
            
            // If the item is addingSoon, initialize the canvas animation
            if (item.addingSoon) {
                const canvas = itemGroup.querySelector('.coming-soon-canvas');
                const statusEl = itemGroup.querySelector('.canvas-dynamic-status');
                initCanvasAnimation(canvas, statusEl);
            }
        });
        
    } else if (project.addingSoon) {
        // Render interactive canvas placeholder for Coming Soon full projects
        const placeholderBlock = document.createElement('div');
        placeholderBlock.className = 'gallery-placeholder-card scroll-reveal-img';
        placeholderBlock.style.padding = '0';
        placeholderBlock.style.overflow = 'hidden';
        placeholderBlock.style.backgroundColor = '#0b0b0e';
        placeholderBlock.style.border = '1px solid var(--border)';
        placeholderBlock.style.borderRadius = '16px';
        placeholderBlock.style.aspectRatio = '16 / 9';
        placeholderBlock.style.position = 'relative';
        
        placeholderBlock.innerHTML = `
            <canvas class="coming-soon-canvas" style="display: block; width: 100%; height: 100%;"></canvas>
            <div class="canvas-text-overlay" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; pointer-events: none; width: 85%;">
                <div class="glow-pulse-circle" style="width: 64px; height: 64px; border-radius: 50%; border: 2px solid var(--accent); margin: 0 auto 1.5rem auto; display: flex; align-items: center; justify-content: center; animation: glowPulse 2s infinite;">
                    <i data-lucide="loader" class="canvas-loading-icon" style="animation: spin 3s linear infinite; width: 24px; height: 24px; color: var(--accent);"></i>
                </div>
                <h3 style="font-family: var(--font-heading); font-size: 1.8rem; font-weight: 800; margin-bottom: 0.5rem; letter-spacing: -0.02em;">Case Study Arriving Soon</h3>
                <p class="canvas-dynamic-status" style="font-size: 1rem; color: var(--text-secondary); transition: opacity 0.5s ease; max-width: 500px; margin: 0 auto;">I'm working on it...</p>
            </div>
        `;
        galleryContainer.appendChild(placeholderBlock);
        
        initCanvasAnimation(placeholderBlock.querySelector('canvas'), placeholderBlock.querySelector('.canvas-dynamic-status'));
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
    } else if (project.galleryLinks && project.galleryTitles) {
        // Tabbed Browser Showcase for UI/UX Website Pages (using fullScreenshots for scrolling)
        const showcaseWrapper = document.createElement('div');
        showcaseWrapper.className = 'tabbed-browser-showcase scroll-reveal-img';
        
        // 1. Create Tabs Bar (Wrapped for swipe-scroll on mobile)
        let tabsHtml = '<div class="browser-tabs-wrapper"><div class="browser-tabs-bar">';
        project.galleryTitles.forEach((title, idx) => {
            const activeClass = idx === 0 ? 'active' : '';
            tabsHtml += `
                <button class="browser-tab-btn ${activeClass}" data-index="${idx}">
                    <span class="tab-status-dot"></span>
                    <span class="tab-title-text">${title}</span>
                </button>
            `;
        });
        tabsHtml += '</div></div>';
        
        // 2. Create Browser Mockup Frame
        const scrollImages = project.fullScreenshots || project.gallery;
        const initialImg = scrollImages[0];
        const initialLink = project.galleryLinks[0];
        const initialDisplayLink = initialLink.replace('https://', '');
        
        const browserFrameHtml = `
            <div class="browser-frame-container">
                <div class="browser-frame-header">
                    <div class="browser-frame-dots">
                        <span class="frame-dot dot-red"></span>
                        <span class="frame-dot dot-yellow"></span>
                        <span class="frame-dot dot-green"></span>
                    </div>
                    <div class="browser-frame-address">
                        <i data-lucide="lock" class="address-lock-icon"></i>
                        <span id="browser-address-text">${initialDisplayLink}</span>
                    </div>
                    <div class="browser-frame-spacer"></div>
                </div>
                <div class="browser-frame-viewport">
                    <div class="browser-scroll-helper-badge">
                        <i data-lucide="mouse-pointer"></i> Hover to scroll page layout
                    </div>
                    <img src="${initialImg}" alt="Website Preview" class="browser-frame-img" id="browser-viewport-img">
                </div>
            </div>
            
            <div class="browser-action-row">
                <a href="${initialLink}" target="_blank" rel="noopener noreferrer" class="btn btn-visit-site" id="browser-visit-link">
                    <span>Visit Live Website</span>
                    <i data-lucide="external-link"></i>
                </a>
            </div>
        `;
        
        showcaseWrapper.innerHTML = tabsHtml + browserFrameHtml;
        galleryContainer.appendChild(showcaseWrapper);
        
        // 3. Tab Switching Events
        const tabButtons = showcaseWrapper.querySelectorAll('.browser-tab-btn');
        const addressText = showcaseWrapper.querySelector('#browser-address-text');
        const visitLink = showcaseWrapper.querySelector('#browser-visit-link');
        const viewportImg = showcaseWrapper.querySelector('#browser-viewport-img');
        
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                tabButtons.forEach(t => t.classList.remove('active'));
                btn.classList.add('active');
                
                const idx = parseInt(btn.getAttribute('data-index'));
                const newImg = scrollImages[idx];
                const newLink = project.galleryLinks[idx];
                const displayLink = newLink.replace('https://', '');
                
                // Crossfade animation
                viewportImg.style.opacity = '0';
                
                setTimeout(() => {
                    viewportImg.src = newImg;
                    addressText.innerText = displayLink;
                    visitLink.href = newLink;
                    
                    // Reset scroll and show
                    viewportImg.style.opacity = '1';
                }, 250);
            });
        });
        
        // Refresh icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    } else {
        // Standard Behance-style static stacked images
        project.gallery.forEach((imgSrc, index) => {
            const imgWrapper = document.createElement('div');
            imgWrapper.className = 'gallery-image-wrapper scroll-reveal-img';
            imgWrapper.innerHTML = `
                <img src="${imgSrc}" alt="${project.title} Showcase Image ${index + 1}" class="showcase-img" loading="lazy">
            `;
            galleryContainer.appendChild(imgWrapper);
        });
    }

    // ==========================================================================
    // Bidirectional Behance Scroll Entrance Animations (Intersection Observer)
    // ==========================================================================
    const revealImages = document.querySelectorAll('.scroll-reveal-img, .reveal-element');
    
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            } else {
                // If it scrolls out of view below the viewport, reset it
                // This enables it to re-reveal when scrolling back down!
                if (entry.boundingClientRect.top > 0) {
                    entry.target.classList.remove('active');
                }
            }
        });
    }, {
        threshold: 0.1, // Adjusted threshold for consistent trigger timing
        rootMargin: '0px 0px -50px 0px'
    });

    revealImages.forEach(img => {
        scrollObserver.observe(img);
    });

    // ==========================================================================
    // Render Other Projects Blurred Shelf
    // ==========================================================================
    const otherContainer = document.getElementById('other-projects-container');
    if (otherContainer) {
        otherContainer.innerHTML = '';
        Object.keys(window.PROJECTS_DATA).forEach(key => {
            if (key === projectId) return; // Skip current project
            
            const p = window.PROJECTS_DATA[key];
            const otherCard = document.createElement('a');
            otherCard.className = 'other-project-card';
            otherCard.href = `project.html?id=${key}`;
            
            const badgeHtml = p.addingSoon ? `<span class="other-card-badge">Adding Soon...</span>` : '';
            
            otherCard.innerHTML = `
                <div class="other-project-img-container">
                    <img src="${p.banner}" alt="${p.title}" class="other-project-blurred-img" loading="lazy">
                    <div class="other-project-text-overlay">
                        <span class="other-project-category">${p.category}</span>
                        <h4 class="other-project-title">${p.title}</h4>
                        ${badgeHtml}
                    </div>
                </div>
            `;
            otherContainer.appendChild(otherCard);
        });
    }


    // ==========================================================================
    // Custom Interactive Mouse Cursor — GPU-composited (Desktop only)
    // ==========================================================================
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');

    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;

    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

    if (!isTouchDevice) {
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.opacity = '1';
            cursorOutline.style.opacity = '1';
            // GPU composited — no layout recalc
            cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;

            // Background grid movement parallax variables relative to screen center
            const xPercent = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
            const yPercent = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
            document.documentElement.style.setProperty('--grid-move-x', `${xPercent * -15}px`);
            document.documentElement.style.setProperty('--grid-move-y', `${yPercent * -15}px`);
        }, { passive: true });

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

        // Event delegation — single listener instead of one per element
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('a, button')) {
                cursorOutline.style.width = '50px';
                cursorOutline.style.height = '50px';
                cursorOutline.style.marginTop = '-25px';
                cursorOutline.style.marginLeft = '-25px';
                cursorOutline.style.backgroundColor = 'var(--accent-glow)';
            }
        });
        document.addEventListener('mouseout', (e) => {
            if (e.target.closest('a, button')) {
                cursorOutline.style.width = '32px';
                cursorOutline.style.height = '32px';
                cursorOutline.style.marginTop = '-16px';
                cursorOutline.style.marginLeft = '-16px';
                cursorOutline.style.backgroundColor = 'transparent';
            }
        });
    }

    // Scroll to top button — RAF-throttled
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    let scrollTopRaf = null;
    window.addEventListener('scroll', () => {
        if (!scrollTopRaf) {
            scrollTopRaf = requestAnimationFrame(() => {
                scrollTopRaf = null;
                const visible = window.scrollY > 400;
                scrollToTopBtn.style.opacity = visible ? '1' : '0';
                scrollToTopBtn.style.pointerEvents = visible ? 'auto' : 'none';
            });
        }
    }, { passive: true });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProjectDetails);
} else {
    initProjectDetails();
}

// ==========================================================================
// Interactive coming soon blueprint canvas drawing animation
// ==========================================================================
function initCanvasAnimation(canvas, statusEl) {
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    const resizeCanvas = () => {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const statuses = [
        "I'm working on it...",
        "Polishing visual mockups...",
        "Formatting editorial layouts...",
        "Tuning grids and spaces...",
        "Generating conceptual assets...",
        "Aligning typography weights..."
    ];
    let statusIdx = 0;
    
    const textInterval = setInterval(() => {
        if (!statusEl) return;
        statusEl.style.opacity = '0';
        setTimeout(() => {
            statusIdx = (statusIdx + 1) % statuses.length;
            statusEl.innerText = statuses[statusIdx];
            statusEl.style.opacity = '1';
        }, 500);
    }, 3500);
    
    const particles = [];
    const particleCount = 24;
    
    let angle = 0;
    const draw = () => {
        const width = canvas.width / window.devicePixelRatio;
        const height = canvas.height / window.devicePixelRatio;
        
        if (particles.length === 0) {
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.9,
                    vy: (Math.random() - 0.5) * 0.9,
                    r: Math.random() * 2 + 1
                });
            }
        }
        
        ctx.clearRect(0, 0, width, height);
        
        ctx.strokeStyle = document.documentElement.getAttribute('data-theme') === 'light' 
            ? 'rgba(0, 0, 0, 0.02)' 
            : 'rgba(255, 255, 255, 0.025)';
        ctx.lineWidth = 1;
        const step = 24;
        for (let x = 0; x < width; x += step) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        for (let y = 0; y < height; y += step) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
        
        ctx.save();
        ctx.translate(width / 2, height / 2);
        ctx.rotate(angle);
        ctx.strokeStyle = document.documentElement.getAttribute('data-theme') === 'light'
            ? 'rgba(0, 0, 0, 0.05)'
            : 'rgba(255, 255, 255, 0.06)';
        ctx.lineWidth = 1;
        
        ctx.beginPath();
        ctx.arc(0, 0, 80, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.rotate(-angle * 1.6);
        ctx.beginPath();
        ctx.rect(-50, -50, 100, 100);
        ctx.stroke();
        
        ctx.restore();
        
        ctx.strokeStyle = document.documentElement.getAttribute('data-theme') === 'light'
            ? 'rgba(0, 0, 0, 0.04)'
            : 'rgba(255, 255, 255, 0.05)';
        ctx.fillStyle = document.documentElement.getAttribute('data-theme') === 'light'
            ? 'rgba(0, 0, 0, 0.2)'
            : 'rgba(255, 255, 255, 0.25)';
            
        particles.forEach((p, idx) => {
            p.x += p.vx;
            p.y += p.vy;
            
            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
            
            for (let j = idx + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
                if (dist < 100) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        });
        
        angle += 0.003;
        animationFrameId = requestAnimationFrame(draw);
    };
    
    draw();
    
    return () => {
        cancelAnimationFrame(animationFrameId);
        clearInterval(textInterval);
        window.removeEventListener('resize', resizeCanvas);
    };
}



