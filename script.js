document.addEventListener('DOMContentLoaded', () => {
    // Navigation Logic
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    function switchTab(targetId) {
        // Remove active class from links
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${targetId}`) {
                link.classList.add('active');
            }
        });

        // Hide all sections and show target
        sections.forEach(section => {
            section.classList.remove('active');
            if (section.id === targetId) {
                section.classList.add('active');
                // Re-trigger animations for the new section
                animateElements(section);
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1); // Remove #
            switchTab(targetId);
            // Update URL hash without scrolling
            history.pushState(null, null, `#${targetId}`);
        });
    });

    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
        const hash = window.location.hash.substring(1);
        if (hash) {
            switchTab(hash);
        } else {
            // Default to about if hash is empty
            switchTab('about');
        }
    });

    // Portfolio Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'block';
                    // Add fade animation
                    card.style.opacity = '0';
                    setTimeout(() => card.style.opacity = '1', 50);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Intersection Observer for Scroll Animations
    // This handles "Animate sections on scroll" - essentially elements fading in when they appear
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    function animateElements(container) {
        // Select elements to animate within the active container
        const elements = container.querySelectorAll('.animate-on-scroll');
        elements.forEach((el, index) => {
            // Reset animation
            el.classList.remove('fade-in-up');
            el.style.opacity = '0';
            // Stagger delay
            el.style.animationDelay = `${index * 0.1}s`;
            // Observe
            observer.observe(el);
        });
    }

    // Initial check for the default active section or Hash
    const hash = window.location.hash.substring(1);
    if (hash) {
        switchTab(hash);
    } else {
        const activeSection = document.querySelector('.section.active');
        if (activeSection) {
            animateElements(activeSection);
        }
    }

    // Contact Form Handler with EmailJS
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const btn = contactForm.querySelector('.submit-btn');
            const originalText = btn.innerHTML;

            // Show loading state
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            btn.disabled = true;

            // Check if emailjs is loaded
            if (typeof emailjs === 'undefined') {
                alert("EmailJS SDK not loaded. Check your internet connection.");
                btn.innerHTML = originalText;
                btn.disabled = false;
                return;
            }

            emailjs.sendForm(
                "service_15rfpwc",
                "template_8psjx1p",
                this,
                "FmgMgXdOmCPGoeEEW" // Public Key explicitly passed
            ).then(
                () => {
                    // Success state
                    btn.innerHTML = '<i class="fas fa-check"></i> Sent Successfully';
                    btn.style.background = '#10b981';
                    contactForm.reset();

                    setTimeout(() => {
                        btn.innerHTML = originalText;
                        btn.style.background = '';
                        btn.disabled = false;
                    }, 3000);
                },
                (error) => {
                    // Error state
                    console.error("EmailJS Error:", error);
                    btn.innerHTML = '<i class="fas fa-times"></i> Failed';
                    btn.style.background = '#ef4444';

                    setTimeout(() => {
                        btn.innerHTML = originalText;
                        btn.style.background = '';
                        btn.disabled = false;
                    }, 3000);

                    alert("Failed to send message: " + JSON.stringify(error));
                }
            );
        });
    }
    // Sidebar Toggle for Mobile/Zoom
    const infoToggle = document.getElementById('info-toggle');
    const sidebar = document.querySelector('.sidebar');

    if (infoToggle && sidebar) {
        infoToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            const toggleText = infoToggle.querySelector('span');
            if (sidebar.classList.contains('active')) {
                toggleText.textContent = 'Hide Contacts';
            } else {
                toggleText.textContent = 'Show Contacts';
            }
        });
    }
});
