document.addEventListener('DOMContentLoaded', () => {
    // Certifications selection functionality
    const certificationCards = document.querySelectorAll('.certification-card');
    
    certificationCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove selected class from all cards
            certificationCards.forEach(c => c.classList.remove('selected'));
            
            // Add selected class to clicked card
            card.classList.add('selected');
        });
    });

    // Portfolio cards selection functionality
    const portfolioCards = document.querySelectorAll('.card-small');
    console.log('Found portfolio cards:', portfolioCards.length);
    
    portfolioCards.forEach((card, index) => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Portfolio card clicked:', index);
            
            // Remove selected class from all portfolio cards
            portfolioCards.forEach(c => c.classList.remove('selected'));
            
            // Add selected class to clicked card
            card.classList.add('selected');
            console.log('Card selected:', card.classList.contains('selected'));
        });
    });


    // FAQ functionality
    const faqItems = document.querySelectorAll('.faq__item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq__question');
        if (question) {
            question.addEventListener('click', () => {
                const isOpen = item.classList.contains('faq__item--open');
                const arrow = item.querySelector('.faq__arrow');
                
                if (isOpen) {
                    // Close the clicked item
                    item.classList.remove('faq__item--open');
                    if (arrow) {
                        arrow.src = 'assets/arrow down.svg';
                    }
                } else {
                    // Open the clicked item
                    item.classList.add('faq__item--open');
                    if (arrow) {
                        arrow.src = 'assets/arrow up.svg';
                    }
                }
            });
        }
    });

    // Portfolio carousel functionality
    const track = document.querySelector('.slider-track');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const progressFill = document.querySelector('.progress-fill');
    const currentSlide = document.querySelector('.current');
    const totalSlides = document.querySelector('.total');
    
    if (!track || !prevBtn || !nextBtn) {
        console.log('Carousel elements not found');
        return;
    }
    
    const slides = Array.from(track.children);
    if (slides.length === 0) {
        console.log('No slides found');
        return;
    }

    let currentIndex = 0;
    const slidesToShow = 3; 
    const totalPages = slides.length - slidesToShow + 1; 

    console.log('Carousel setup:', { slides: slides.length, slidesToShow, totalPages });

    // Set initial state
    if (totalSlides) totalSlides.textContent = totalPages.toString().padStart(2, '0');
    
    const updateProgress = () => {
        if (progressFill && currentSlide) {
            const progress = ((currentIndex + 1) / totalPages) * 100;
            progressFill.style.width = `${progress}%`;
            currentSlide.textContent = (currentIndex + 1).toString().padStart(2, '0');
        }
    };

    let isAnimating = false; 

    const moveToSlide = (targetIndex) => {
        if (targetIndex < 0 || targetIndex >= totalPages || isAnimating) return;
        
        isAnimating = true; 
        
        // Calculate move amount - move by 1 slide at a time
        const slideWidth = track.getBoundingClientRect().width / slidesToShow;
        const moveAmount = -(targetIndex * slideWidth);
        
        track.style.transform = `translateX(${moveAmount}px)`;
        currentIndex = targetIndex;
        updateProgress();
        
        console.log(`Moved to position ${currentIndex + 1}/${totalPages}`);
        
        
        setTimeout(() => {
            isAnimating = false;
        }, 500);
    };

    // Event listeners
    nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentIndex < totalPages - 1) {
            moveToSlide(currentIndex + 1);
        } else {
            console.log('Already at the end - showing last 3 projects');
        }
    });

    prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentIndex > 0) {
            moveToSlide(currentIndex - 1);
        } else {
            console.log('Already at the beginning - showing first 3 projects');
        }
    });

    // Carousel buttons are ready

    // Touch/swipe support
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
    });

    track.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        currentX = e.touches[0].clientX;
        e.preventDefault();
    });

    track.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        isDragging = false;
        
        const diffX = startX - currentX;
        const threshold = 50;
        
        if (Math.abs(diffX) > threshold) {
            if (diffX > 0 && currentIndex < totalPages - 1) {
                moveToSlide(currentIndex + 1);
            } else if (diffX < 0 && currentIndex > 0) {
                moveToSlide(currentIndex - 1);
            }
        }
    });

    // Initialize
    updateProgress();
    moveToSlide(0);
    console.log('Carousel initialized successfully');

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && currentIndex > 0) {
            moveToSlide(currentIndex - 1);
        } else if (e.key === 'ArrowRight' && currentIndex < totalPages - 1) {
            moveToSlide(currentIndex + 1);
        }
    });

    // Manual control only - no autoplay

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const header = document.querySelector('.header');
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active navigation
                updateActiveNav(this.getAttribute('href'));
            }
        });
    });

    // Update active navigation
    function updateActiveNav(href) {
        // Remove active class from all nav links
        document.querySelectorAll('.header__nav-link').forEach(link => {
            link.classList.remove('header__nav-link--active');
        });
        
        // Add active class to clicked link
        const activeLink = document.querySelector(`a[href="${href}"]`);
        if (activeLink) {
            activeLink.classList.add('header__nav-link--active');
        }
    }

    // Update active nav on scroll
    function updateActiveNavOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.header__nav-link');
        const header = document.querySelector('.header');
        const headerHeight = header.offsetHeight;
        const scrollPos = window.scrollY + headerHeight + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('header__nav-link--active');
                });
                
                const activeLink = document.querySelector(`a[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('header__nav-link--active');
                }
            }
        });
    }

    // Listen for scroll events
    window.addEventListener('scroll', updateActiveNavOnScroll);

    // Header scroll effect - compact mode only, no hiding
    const header = document.querySelector('.header');

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }

        // Header always visible - no hiding
        header.style.transform = 'translateY(0)';
    });

    // Mobile menu functionality
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.header__nav');
    
    if (mobileMenuToggle && mobileNav) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            
            // Check screen width to determine which class to use
            if (window.innerWidth <= 320) {
                mobileNav.classList.toggle('mobile-open');
            } else {
                mobileNav.classList.toggle('active');
            }
            
            document.body.style.overflow = (mobileNav.classList.contains('mobile-open') || mobileNav.classList.contains('active')) ? 'hidden' : '';
        });

        // Close mobile menu when clicking on nav links
        document.querySelectorAll('.header__nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuToggle.classList.remove('active');
                mobileNav.classList.remove('mobile-open');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileNav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                mobileMenuToggle.classList.remove('active');
                mobileNav.classList.remove('mobile-open');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Handle window resize for mobile menu
        window.addEventListener('resize', () => {
            if (window.innerWidth > 992) {
                mobileMenuToggle.classList.remove('active');
                mobileNav.classList.remove('mobile-open');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Partners carousel functionality
    const partnersTrack = document.querySelector('.partners__track');
    const partnersPrevBtn = document.querySelector('.partners__prev');
    const partnersNextBtn = document.querySelector('.partners__next');
    const partnersProgressFill = document.querySelector('.partners__progress-fill');
    const partnersCurrentSlide = document.querySelector('.partners__current');
    const partnersTotalSlides = document.querySelector('.partners__total');
    
    if (partnersTrack && partnersPrevBtn && partnersNextBtn) {
        const partnersSlides = Array.from(partnersTrack.children);
        if (partnersSlides.length > 0) {
            let partnersCurrentIndex = 0;
            const partnersTotalCount = partnersSlides.length;
            
            if (partnersTotalSlides) {
                partnersTotalSlides.textContent = partnersTotalCount.toString().padStart(2, '0');
            }
            
            function updatePartnersCarousel() {
                const translateX = -partnersCurrentIndex * 100;
                partnersTrack.style.transform = `translateX(${translateX}%)`;
                
                if (partnersCurrentSlide) {
                    partnersCurrentSlide.textContent = (partnersCurrentIndex + 1).toString().padStart(2, '0');
                }
                
                if (partnersProgressFill) {
                    const progress = ((partnersCurrentIndex + 1) / partnersTotalCount) * 100;
                    partnersProgressFill.style.width = `${progress}%`;
                }
            }
            
            partnersPrevBtn.addEventListener('click', () => {
                partnersCurrentIndex = (partnersCurrentIndex - 1 + partnersTotalCount) % partnersTotalCount;
                updatePartnersCarousel();
            });
            
            partnersNextBtn.addEventListener('click', () => {
                partnersCurrentIndex = (partnersCurrentIndex + 1) % partnersTotalCount;
                updatePartnersCarousel();
            });
            
            // Initialize
            updatePartnersCarousel();
        }
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.certification-card, .faq__item, .about-us__text, .about-us__image-wrapper').forEach(el => {
        observer.observe(el);
    });

    // All navigation buttons are handled by the general handler below

    // Form validation and submission
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const phoneInput = form.querySelector('input[type="tel"]');
            if (phoneInput && phoneInput.value.trim()) {
                alert('Thank you! We will contact you within 24 hours.');
                phoneInput.value = '';
            } else {
                alert('Please enter your phone number.');
            }
        });
    });

    // Button hover effects for better UX
    document.querySelectorAll('.button, .btn').forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
        });
    });

    // Handle all navigation buttons
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const header = document.querySelector('.header');
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Winner buttons are handled by the general navigation handler above

    console.log('All interactive elements configured successfully!');
});