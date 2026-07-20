/**
 * EDITKARO.IN - PREMIUM AGENCY PORTFOLIO WEBSITE JAVASCRIPT
 * Handcrafted visual micro-interactions, parallax layers, magnetic pull,
 * custom mouse-trailing followers, lazy scroll reveals, and portfolio filtering.
 * Author: Senior Frontend Developer & UI/UX Designer
 */

document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initCustomCursor();
    initScrollNavbar();
    initScrollReveal();
    initHeroParallax();
    initMagneticElements();
    initPortfolioFilter();
    initVideoLightbox();
    initContactForm();
    init3DTilt();
});

/**
 * 1. PRELOADER SCREEN
 * Simulates a loading progress bar, then fades out when the DOM is fully loaded.
 */
function initPreloader() {
    const preloader = document.getElementById('preloader');
    const progressBar = document.querySelector('.preloader-progress-bar');
    
    if (!preloader || !progressBar) return;

    let width = 0;
    // Simulate loading progress
    const interval = setInterval(() => {
        if (width >= 90) {
            clearInterval(interval);
        } else {
            width += Math.random() * 20;
            if (width > 90) width = 90;
            progressBar.style.width = width + '%';
        }
    }, 100);

    // Complete loading when everything is loaded
    window.addEventListener('load', () => {
        clearInterval(interval);
        progressBar.style.width = '100%';
        
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
        }, 300);
    });

    // Fallback if load event already fired or is slow
    setTimeout(() => {
        clearInterval(interval);
        progressBar.style.width = '100%';
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
        }, 300);
    }, 2500);
}

/**
 * 2. CUSTOM CURSOR & FOLLOWER
 * Trailing dot and circle follower that react contextually on hovering elements.
 */
function initCustomCursor() {
    const cursor = document.getElementById('customCursor');
    const follower = document.getElementById('customCursorFollower');
    const followerText = follower ? follower.querySelector('.follower-text') : null;

    if (!cursor || !follower) return;

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Instant inner dot placement
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });

    // Animate outer follower trailing using requestAnimationFrame
    function animateFollower() {
        const easing = 0.12; // lower number = more slide/lag trailing
        followerX += (mouseX - followerX) * easing;
        followerY += (mouseY - followerY) * easing;

        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';

        requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Hover states for general interactive elements
    const hoverTargets = document.querySelectorAll('a, button, .filter-btn, .form-input, .hamburger, .timeline-row');
    hoverTargets.forEach(target => {
        target.addEventListener('mouseenter', () => {
            follower.classList.add('cursor-hover');
        });
        target.addEventListener('mouseleave', () => {
            follower.classList.remove('cursor-hover');
        });
    });

    // Hover states for portfolio cards (displays PLAY text)
    const portfolioCards = document.querySelectorAll('.portfolio-card, .parallax-play-badge');
    portfolioCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            follower.classList.add('cursor-play');
            if (followerText) followerText.textContent = 'PLAY';
        });
        card.addEventListener('mouseleave', () => {
            follower.classList.remove('cursor-play');
            if (followerText) followerText.textContent = '';
        });
    });
}

/**
 * 3. FLOATING STICKY NAVIGATION BAR & SCROLL SPY
 * Transition background on scroll. Track viewport positions and update active link indicators.
 */
function initScrollNavbar() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!navbar) return;

    // Toggle Sticky navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Scroll Spy active navigation state
        let currentLink = '';
        
        const spyTargets = [
            { id: 'portfolio', link: '#portfolio' },
            { id: 'categories', link: '#categories' },
            { id: 'about', link: '#about' },
            { id: 'services', link: '#about' },
            { id: 'testimonials', link: '#about' },
            { id: 'contact', link: '#contact' }
        ];

        spyTargets.forEach(target => {
            const el = document.getElementById(target.id);
            if (el) {
                const top = el.getBoundingClientRect().top + window.scrollY - 160;
                const bottom = top + el.offsetHeight;
                if (window.scrollY >= top && window.scrollY < bottom) {
                    currentLink = target.link;
                }
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentLink) {
                link.classList.add('active');
            }
        });
    });

    // Mobile Hamburger Menu Toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Lock body scroll when mobile menu is active
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close Mobile Menu on clicking a nav link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
}

/**
 * 4. SCROLL REVEAL (Intersection Observer)
 * Smoothly triggers staggered entry transitions on scrolling into view.
 */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    if (revealElements.length === 0) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Triggers early for instant editorial response
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));
}

/**
 * 5. HERO PARALLAX MOVEMENT
 * Shifts stacked right-side thumbnail offsets relative to mouse tracking coordinates.
 */
function initHeroParallax() {
    const scene = document.getElementById('heroParallaxScene');
    const cards = document.querySelectorAll('.stack-card, .parallax-play-badge');

    if (!scene || cards.length === 0) return;

    scene.addEventListener('mousemove', (e) => {
        const rect = scene.getBoundingClientRect();
        const xVal = e.clientX - rect.left - rect.width / 2;
        const yVal = e.clientY - rect.top - rect.height / 2;

        cards.forEach(card => {
            const depth = parseFloat(card.getAttribute('data-depth')) || 0.25;
            const xShift = xVal * depth * 0.15;
            const yShift = yVal * depth * 0.15;
            
            // Maintain layout rotations
            let baseRotate = '';
            if (card.classList.contains('card-1')) baseRotate = 'rotate(-6deg)';
            if (card.classList.contains('card-2')) baseRotate = 'rotate(5deg)';
            if (card.classList.contains('card-3')) baseRotate = 'rotate(-2deg)';
            
            card.style.transform = `translate(${xShift}px, ${yShift}px) ${baseRotate}`;
        });
    });

    scene.addEventListener('mouseleave', () => {
        cards.forEach(card => {
            let baseRotate = '';
            if (card.classList.contains('card-1')) baseRotate = 'rotate(-6deg)';
            if (card.classList.contains('card-2')) baseRotate = 'rotate(5deg)';
            if (card.classList.contains('card-3')) baseRotate = 'rotate(-2deg)';
            
            card.style.transform = baseRotate;
        });
    });
}

/**
 * 6. MAGNETIC ELEMENTS
 * Attracts specific premium button components slightly towards cursor proximity.
 */
function initMagneticElements() {
    const magneticEls = document.querySelectorAll('.magnetic');
    if (magneticEls.length === 0) return;

    magneticEls.forEach(el => {
        el.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Elastic translation (max 15px pull factor)
            this.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });

        el.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

/**
 * 7. PORTFOLIO FILTER
 * Smooth category filter switching with fade and scale shrink effects.
 */
function initPortfolioFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card');

    if (filterButtons.length === 0 || portfolioCards.length === 0) return;

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            portfolioCards.forEach(card => {
                // Apply a visual scale transition
                card.style.opacity = '0';
                card.style.transform = 'scale(0.92)';
                card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';

                setTimeout(() => {
                    if (filterValue === 'all' || card.getAttribute('data-category').includes(filterValue)) {
                        card.classList.remove('filtered-out');
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.classList.add('filtered-out');
                    }
                }, 350);
            });
        });
    });
}

/**
 * 8. VIDEO LIGHTBOX MODAL
 * Launches full-screen overlay player with dynamic title/description text loading.
 */
function initVideoLightbox() {
    const lightbox = document.getElementById('videoLightbox');
    const iframe = lightbox ? lightbox.querySelector('iframe') : null;
    const closeBtn = document.getElementById('lightboxClose');
    const portfolioCards = document.querySelectorAll('.portfolio-card, .parallax-play-badge');
    const lightboxTitle = lightbox ? lightbox.querySelector('#lightboxTitle') : null;
    const lightboxDesc = lightbox ? lightbox.querySelector('#lightboxDesc') : null;

    if (!lightbox || !iframe || !closeBtn) return;

    const openModal = (videoId, title, desc) => {
        const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`;
        iframe.src = embedUrl;
        
        if (lightboxTitle) lightboxTitle.textContent = title;
        if (lightboxDesc) lightboxDesc.textContent = desc;
        
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    // Open lightbox from portfolio grid card clicks
    portfolioCards.forEach(card => {
        card.addEventListener('click', () => {
            // If it is the floating hero play badge, play default showcase video
            if (card.classList.contains('parallax-play-badge')) {
                openModal('W7P_4mH59lY', 'Editkaro.in Agency Showreel', 'A comprehensive showcase of our creative editing, cinematic timing, and post-production capabilities.');
                return;
            }

            const videoId = card.getAttribute('data-video-id');
            const titleEl = card.querySelector('.portfolio-title');
            const descEl = card.querySelector('.portfolio-desc');

            if (videoId) {
                openModal(
                    videoId, 
                    titleEl ? titleEl.textContent : 'Selected Project', 
                    descEl ? descEl.textContent : ''
                );
            }
        });
    });

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        setTimeout(() => {
            iframe.src = '';
            if (lightboxTitle) lightboxTitle.textContent = '';
            if (lightboxDesc) lightboxDesc.textContent = '';
        }, 500);
        document.body.style.overflow = '';
    };

    closeBtn.addEventListener('click', closeLightbox);
    
    // Close on clicking overlay wrapper background
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}

/**
 * 9. CONTACT FORM INTERCEPTION
 * Validates inputs, resets fields, and triggers success feedback toasts.
 */
function initContactForm() {
    const form = document.getElementById('contactForm');
    const toast = document.getElementById('feedbackToast');

    if (!form || !toast) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = form.querySelector('[name="name"]').value.trim();
        const email = form.querySelector('[name="email"]').value.trim();
        const subject = form.querySelector('[name="subject"]').value.trim();
        const message = form.querySelector('[name="message"]').value.trim();

        if (!name || !email || !subject || !message) {
            alert('Please fill out all fields.');
            return;
        }

        // Display green success toast alert
        toast.classList.add('show');
        form.reset();

        // Clear label floating state inputs
        const inputs = form.querySelectorAll('.form-input');
        inputs.forEach(input => {
            input.blur();
        });

        // Clear toast notification after 4 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    });
}

/**
 * 10. 3D TILT HOVER ENGINE
 * Applies smooth, real-time CSS perspective rotateX/Y transforms to cards
 * based on the mouse position within each element's bounding box.
 * Uses a damped rAF animation loop for a natural, spring-like motion feel.
 *
 * Supported elements:
 *  - .portfolio-card (12-col asymmetrical grid)
 *  - .service-card   (horizontal snap carousel)
 *  - .testimonial-editorial-card
 *  - .about-image-wrapper
 */
function init3DTilt() {
    const TILT_MAX = 14;      // Maximum tilt angle in degrees
    const LIFT_Z   = 22;      // translateZ lift (px) — depth illusion while hovered
    const DAMPING  = 0.09;    // Lerp speed: lower = more inertia/smoothness

    const tiltSelectors = [
        '.portfolio-card',
        '.service-card',
        '.testimonial-editorial-card',
        '.about-image-wrapper'
    ];

    const tiltElements = document.querySelectorAll(tiltSelectors.join(','));
    if (!tiltElements.length) return;

    // Per-element tilt state stored in a WeakMap to avoid memory leaks
    const state = new WeakMap();

    function getState(el) {
        if (!state.has(el)) {
            state.set(el, {
                targetRX: 0, targetRY: 0,
                currentRX: 0, currentRY: 0,
                rafId: null,
                isHovered: false
            });
        }
        return state.get(el);
    }

    function animateTilt(el) {
        const s = getState(el);

        // Lerp: smoothly interpolate current rotation towards target
        s.currentRX += (s.targetRX - s.currentRX) * DAMPING;
        s.currentRY += (s.targetRY - s.currentRY) * DAMPING;

        const atRest = (
            !s.isHovered &&
            Math.abs(s.currentRX) < 0.01 &&
            Math.abs(s.currentRY) < 0.01
        );

        // Perspective proportional to element width for accurate tilt depth
        const perspective = Math.max(el.offsetWidth * 2.8, 900);
        const zLift = s.isHovered ? LIFT_Z : 0;

        el.style.transform = `perspective(${perspective}px) rotateX(${s.currentRX.toFixed(3)}deg) rotateY(${s.currentRY.toFixed(3)}deg) translateZ(${zLift}px)`;

        if (atRest) {
            // Stop loop — element is completely at rest
            el.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) translateZ(0)`;
            s.rafId = null;
        } else {
            s.rafId = requestAnimationFrame(() => animateTilt(el));
        }
    }

    function startLoop(el) {
        const s = getState(el);
        if (!s.rafId) {
            s.rafId = requestAnimationFrame(() => animateTilt(el));
        }
    }

    tiltElements.forEach(el => {
        el.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            // Normalize mouse position to [-1, 1] within the element
            const xNorm = ((e.clientX - rect.left)  / rect.width)  * 2 - 1;
            const yNorm = ((e.clientY - rect.top)   / rect.height) * 2 - 1;

            const s = getState(this);
            s.isHovered = true;
            // Invert Y so card top tilts backward (natural 3D perspective feel)
            s.targetRX = -yNorm * TILT_MAX;
            s.targetRY =  xNorm * TILT_MAX;

            startLoop(this);
        });

        el.addEventListener('mouseleave', function() {
            const s = getState(this);
            s.isHovered = false;
            s.targetRX = 0;
            s.targetRY = 0;
            startLoop(this);
        });
    });
}
