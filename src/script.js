/* =====================================================
   KHPAL FOUNDATION - Enhanced JavaScript
   ===================================================== */

document.addEventListener('DOMContentLoaded', function() {
    
    // =====================================================
    // HAMBURGER MENU
    // =====================================================
    const hamburger = document.querySelector('.hamburger');
    const navWrapper = document.querySelector('.nav-wrapper');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const body = document.body;
    
    function toggleMenu() {
        hamburger.classList.toggle('active');
        navWrapper.classList.toggle('active');
        body.classList.toggle('menu-open');
        
        // Update aria-expanded
        const isExpanded = hamburger.classList.contains('active');
        hamburger.setAttribute('aria-expanded', isExpanded);
    }
    
    function closeMenu() {
        hamburger.classList.remove('active');
        navWrapper.classList.remove('active');
        body.classList.remove('menu-open');
        hamburger.setAttribute('aria-expanded', 'false');
    }
    
    hamburger.addEventListener('click', toggleMenu);
    
    // Close menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navWrapper.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // =====================================================
    // SMOOTH SCROLLING
    // =====================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // =====================================================
    // NAVBAR SCROLL EFFECT
    // =====================================================
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;
    
    function handleNavbarScroll() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScrollY = currentScrollY;
    }
    
    window.addEventListener('scroll', handleNavbarScroll, { passive: true });
    
    // =====================================================
    // ACTIVE NAV LINK HIGHLIGHTING
    // =====================================================
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNavLink() {
        const scrollY = window.pageYOffset;
        const navbarHeight = navbar.offsetHeight;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbarHeight - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-menu a[href="#${sectionId}"]`);
            
            if (navLink && scrollY >= sectionTop && scrollY < sectionBottom) {
                navLinks.forEach(link => link.classList.remove('active'));
                navLink.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavLink, { passive: true });
    
    // =====================================================
    // SCROLL ANIMATIONS
    // =====================================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                animationObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Add animation class to elements
    const animateElements = document.querySelectorAll(
        '.mission-content, .story-content, .gallery-item, .stat-card, ' +
        '.impact-card, .support-content, .contact-content'
    );
    
    animateElements.forEach((el, index) => {
        el.classList.add('animate-on-scroll');
        el.style.transitionDelay = `${index * 0.1}s`;
        animationObserver.observe(el);
    });
    
    // =====================================================
    // COUNTER ANIMATION FOR STATS
    // =====================================================
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    let statsAnimated = false;
    
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000;
        const start = 0;
        const startTime = performance.now();
        
        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(start + (target - start) * easeOutQuart);
            
            element.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString();
            }
        }
        
        requestAnimationFrame(updateCounter);
    }
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !statsAnimated) {
                statsAnimated = true;
                statNumbers.forEach(stat => animateCounter(stat));
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
    
    // =====================================================
    // GALLERY TOUCH SUPPORT
    // =====================================================
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('touchstart', function() {
            this.classList.add('touch-active');
        }, { passive: true });
        
        item.addEventListener('touchend', function() {
            setTimeout(() => {
                this.classList.remove('touch-active');
            }, 300);
        }, { passive: true });
    });
    
    // =====================================================
    // PERFORMANCE: Debounce scroll handler
    // =====================================================
    function debounce(func, wait = 10) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
    
    // =====================================================
    // DONATION IMPACT CALCULATOR
    // =====================================================
    const donationSlider = document.getElementById('donationSlider');
    const donationAmount = document.getElementById('donationAmount');
    const mealsCount = document.getElementById('mealsCount');
    const familiesCount = document.getElementById('familiesCount');
    
    if (donationSlider) {
        function updateDonationImpact() {
            const value = parseInt(donationSlider.value);
            const meals = value; // $1 = 1 meal
            const families = Math.floor(value / 5); // $5 feeds a family
            
            // Animate the numbers
            animateValue(donationAmount, parseInt(donationAmount.textContent), value, 200);
            animateValue(mealsCount, parseInt(mealsCount.textContent), meals, 200);
            animateValue(familiesCount, parseInt(familiesCount.textContent), families, 200);
            
            // Update slider track fill
            const percent = ((value - 5) / (100 - 5)) * 100;
            donationSlider.style.background = `linear-gradient(to right, var(--accent) ${percent}%, rgba(255,255,255,0.2) ${percent}%)`;
        }
        
        function animateValue(element, start, end, duration) {
            const startTime = performance.now();
            
            function update(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const current = Math.floor(start + (end - start) * progress);
                element.textContent = current;
                
                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            }
            
            requestAnimationFrame(update);
        }
        
        donationSlider.addEventListener('input', updateDonationImpact);
        updateDonationImpact(); // Initial update
    }
    
    // =====================================================
    // SCROLL PROGRESS BAR
    // =====================================================
    const scrollProgress = document.querySelector('.scroll-progress');
    
    function updateScrollProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        if (scrollProgress) {
            scrollProgress.style.width = `${scrollPercent}%`;
        }
    }
    
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    
    // =====================================================
    // FLOATING DONATE BUTTON VISIBILITY
    // =====================================================
    const floatingDonate = document.querySelector('.floating-donate');
    const supportSection = document.querySelector('#support');
    
    function handleFloatingButton() {
        if (!floatingDonate || !supportSection) return;
        
        const supportRect = supportSection.getBoundingClientRect();
        const isNearSupport = supportRect.top < window.innerHeight && supportRect.bottom > 0;
        
        if (isNearSupport || window.scrollY < 300) {
            floatingDonate.classList.add('hidden');
        } else {
            floatingDonate.classList.remove('hidden');
        }
    }
    
    window.addEventListener('scroll', handleFloatingButton, { passive: true });
    handleFloatingButton(); // Initial check
    
    // =====================================================
    // PARALLAX EFFECT FOR IMPACT VISUAL
    // =====================================================
    const impactVisualBg = document.querySelector('.impact-visual-bg img');
    
    function handleParallax() {
        if (!impactVisualBg) return;
        
        const scrolled = window.scrollY;
        const section = document.querySelector('.impact-visual');
        
        if (section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrolled > sectionTop - window.innerHeight && scrolled < sectionTop + sectionHeight) {
                const yPos = (scrolled - sectionTop) * 0.3;
                impactVisualBg.style.transform = `scale(1.1) translateY(${yPos}px)`;
            }
        }
    }
    
    window.addEventListener('scroll', handleParallax, { passive: true });
    
    // =====================================================
    // SMOOTH REVEAL FOR SECTIONS
    // =====================================================
    const revealElements = document.querySelectorAll(
        '.section-header, .mission-text, .story-text, .stat-card, ' +
        '.impact-card, .support-text, .contact-info, .social-links'
    );
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        revealObserver.observe(el);
    });
    
    // Initial calls
    highlightNavLink();
    handleNavbarScroll();
    updateScrollProgress();
    
    console.log('Khpal Foundation website loaded successfully!');
});

