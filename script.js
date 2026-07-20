/**
 * EDITKARO.IN - PREMIUM PORTFOLIO WEBSITE JAVASCRIPT
 * Description: Interactive components, custom loading progress, portfolio filter,
 *              lightbox modal, custom scroll indicator, ripple buttons, scroll reveal.
 * Author: Senior Frontend Developer & UI/UX Designer
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initPreloader();
    initScrollNavbar();
    initScrollReveal();
    initPortfolioFilter();
    initVideoLightbox();
    initRippleButtons();
    initScrollToTop();
    initContactForm();
});

/**
 * 1. PRELOADER ANIMATION
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
            width += Math.random() * 15;
            if (width > 90) width = 90;
            progressBar.style.width = width + '%';
        }
    }, 150);

    // Complete loading when everything is loaded
    window.addEventListener('load', () => {
        clearInterval(interval);
        progressBar.style.width = '100%';
        
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
            
            // Allow scrolling once loaded
            document.body.style.overflowY = 'auto';
        }, 400);
    });
}

/**
 * 2. STICKY NAVIGATION BAR
 * Adds a background blur and border on scroll. Handles mobile menu toggles and active state tracking.
 */
function initScrollNavbar() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    if (!navbar) return;

    // Toggle Sticky navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Track active section and update nav link indicator
        let currentLink = '';
        
        const spyTargets = [
            { id: 'portfolio', link: '#portfolio' },
            { id: 'categories', link: '#categories' },
            { id: 'about', link: '#about' },
            { id: 'services', link: '#about' },
            { id: 'why-us', link: '#about' },
            { id: 'testimonials', link: '#about' },
            { id: 'contact', link: '#contact' }
        ];

        spyTargets.forEach(target => {
            const el = document.getElementById(target.id);
            if (el) {
                const top = el.getBoundingClientRect().top + window.scrollY - 150;
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

    // Mobile Hamburger Toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Disable scroll if menu is open on mobile
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close Mobile Menu on clicking nav link
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
 * 3. SCROLL REVEAL (Intersection Observer)
 * Smoothly fades and slides sections into view when scrolling.
 */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    if (revealElements.length === 0) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Triggers when 15% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Unobserve once animation is executed
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));
}

/**
 * 4. PORTFOLIO FILTER
 * Filters items smoothly using CSS scale and opacity transitions without page reload.
 */
function initPortfolioFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card');

    if (filterButtons.length === 0 || portfolioCards.length === 0) return;

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state in filter UI
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            portfolioCards.forEach(card => {
                // Apply a visual fade-out/shrink effect before filtering
                card.style.opacity = '0';
                card.style.transform = 'scale(0.85)';
                card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

                setTimeout(() => {
                    if (filterValue === 'all' || card.getAttribute('data-category').includes(filterValue)) {
                        card.classList.remove('filtered-out');
                        // Fade back in
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.classList.add('filtered-out');
                    }
                }, 300);
            });
        });
    });
}

/**
 * 5. VIDEO LIGHTBOX MODAL
 * Opens embedded YouTube video iframe when a card is clicked, stops when closed.
 */
function initVideoLightbox() {
    const lightbox = document.getElementById('videoLightbox');
    const iframe = lightbox ? lightbox.querySelector('iframe') : null;
    const closeBtn = document.getElementById('lightboxClose');
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    const lightboxTitle = lightbox ? lightbox.querySelector('#lightboxTitle') : null;
    const lightboxDesc = lightbox ? lightbox.querySelector('#lightboxDesc') : null;

    if (!lightbox || !iframe || !closeBtn) return;

    // Open Lightbox
    portfolioCards.forEach(card => {
        card.addEventListener('click', () => {
            const videoId = card.getAttribute('data-video-id');
            const titleEl = card.querySelector('.portfolio-title');
            const descEl = card.querySelector('.portfolio-desc');

            if (videoId) {
                // Set YouTube Embed URL with Autoplay & related videos hidden
                const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`;
                iframe.src = embedUrl;
                
                // Update title & description in lightbox modal
                if (titleEl && lightboxTitle) {
                    lightboxTitle.textContent = titleEl.textContent;
                }
                if (descEl && lightboxDesc) {
                    lightboxDesc.textContent = descEl.textContent;
                }
                
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden'; // Block scroll
            }
        });
    });

    // Close Lightbox functions
    const closeLightbox = () => {
        lightbox.classList.remove('active');
        // Wait for transition before resetting iframe source (prevents audio playing)
        setTimeout(() => {
            iframe.src = '';
            if (lightboxTitle) lightboxTitle.textContent = '';
            if (lightboxDesc) lightboxDesc.textContent = '';
        }, 500);
        document.body.style.overflow = ''; // Allow scroll
    };

    closeBtn.addEventListener('click', closeLightbox);
    
    // Close on clicking overlay (outside the video content wrapper)
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Close on pressing Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}

/**
 * 6. BUTTON RIPPLE EFFECT
 * Dynamic visual feedback when clicking premium buttons.
 */
function initRippleButtons() {
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            const x = e.clientX - e.target.getBoundingClientRect().left;
            const y = e.clientY - e.target.getBoundingClientRect().top;

            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

/**
 * 7. BACK TO TOP BUTTON WITH SCROLL PROGRESS
 * Visually fills the progress ring based on scroll depth, scrolls up smoothly.
 */
function initScrollToTop() {
    const scrollTopBtn = document.getElementById('scroll-top');
    const circle = scrollTopBtn ? scrollTopBtn.querySelector('circle') : null;

    if (!scrollTopBtn || !circle) return;

    // Radius of progress circle = 23, Circumference = 2 * PI * R ≈ 144.5
    const circumference = 2 * Math.PI * 23;
    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = circumference;

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        // Show/hide back to top button
        if (scrollTop > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }

        // Calculate progress stroke dashoffset
        if (docHeight > 0) {
            const progress = scrollTop / docHeight;
            const offset = circumference - (progress * circumference);
            circle.style.strokeDashoffset = offset;
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * 8. CONTACT FORM SUBMISSION HANDLER
 * Validates entries, intercepts submit, and triggers a premium custom toast alert.
 */
function initContactForm() {
    const form = document.getElementById('contactForm');
    const toast = document.getElementById('feedbackToast');

    if (!form || !toast) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Retrieve inputs (in real world, send via fetch API to server)
        const name = form.querySelector('[name="name"]').value.trim();
        const email = form.querySelector('[name="email"]').value.trim();
        const subject = form.querySelector('[name="subject"]').value.trim();
        const message = form.querySelector('[name="message"]').value.trim();

        if (!name || !email || !subject || !message) {
            alert('Please fill out all fields.');
            return;
        }

        // Show premium feedback toast
        toast.classList.add('show');

        // Reset the form values
        form.reset();

        // Clear floating labels by forcing input state refresh
        const inputs = form.querySelectorAll('.form-input');
        inputs.forEach(input => {
            input.dispatchEvent(new Event('input')); // refreshes placeholder checks
        });

        // Auto hide toast after 4 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    });
}
