/**
 * AI Specialist Portfolio - Interactive Logic
 * Handles particle system, typing effects, project filters, active navigation, and contact form behavior.
 */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------------
    // 1. Mobile Menu Toggle
    // ----------------------------------------------------------------------
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // ----------------------------------------------------------------------
    // 2. Sticky Navbar & Active Section Highlighting
    // ----------------------------------------------------------------------
    const header = document.getElementById('header');
    const sections = document.querySelectorAll('section');

    const handleScroll = () => {
        // Sticky Navbar state
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active Link Highlighting
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Trigger on load to highlight correct section

    // ----------------------------------------------------------------------
    // 3. Dynamic Typing Effect (Hero Subtitle)
    // ----------------------------------------------------------------------
    const typingSpan = document.querySelector('.typing-text');
    const roles = [
        'Machine Learning Engineer',
        'Deep Learning',
        'Natural Language Processing',
        'Large Language Models (LLMs)'
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    const typeEffect = () => {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            // Delete character
            typingSpan.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Faster deletion
        } else {
            // Add character
            typingSpan.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100; // Normal typing speed
        }

        // Check if finished typing current word
        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typingSpeed = 1500; // Pause at full word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500; // Brief pause before typing next
        }

        setTimeout(typeEffect, typingSpeed);
    };

    if (typingSpan) {
        setTimeout(typeEffect, 1000);
    }

    // ----------------------------------------------------------------------
    // 4. Interactive Canvas Particle Background (Neural Network Simulation)
    // ----------------------------------------------------------------------
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: null, y: null, radius: 150 };

        // Handle resizing
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        // Track Mouse
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });

        // Particle Class
        class Particle {
            constructor(x, y, vx, vy, size) {
                this.x = x;
                this.y = y;
                this.vx = vx;
                this.vy = vy;
                this.size = size;
                this.baseSize = size;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = 'rgba(99, 102, 241, 0.4)';
                ctx.fill();
            }

            update() {
                // Keep inside screen
                if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
                if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

                this.x += this.vx;
                this.y += this.vy;

                // Mouse interaction (hover scaling/attraction)
                if (mouse.x !== null && mouse.y !== null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < mouse.radius) {
                        this.size = this.baseSize * (1 + (mouse.radius - distance) / mouse.radius * 1.5);

                        // Mild attraction
                        this.x += dx * 0.01;
                        this.y += dy * 0.01;
                    } else {
                        if (this.size > this.baseSize) {
                            this.size -= 0.1;
                        }
                    }
                } else {
                    if (this.size > this.baseSize) {
                        this.size -= 0.1;
                    }
                }

                this.draw();
            }
        }

        // Initialize Particle Array
        const initParticles = () => {
            particles = [];
            let numberOfParticles = Math.floor((canvas.width * canvas.height) / 11000);

            // Limit density for high-performance
            if (numberOfParticles > 120) numberOfParticles = 120;
            if (numberOfParticles < 30) numberOfParticles = 30;

            for (let i = 0; i < numberOfParticles; i++) {
                let size = Math.random() * 2 + 1.5;
                let x = Math.random() * (canvas.width - size * 2) + size;
                let y = Math.random() * (canvas.height - size * 2) + size;
                let vx = (Math.random() - 0.5) * 0.4;
                let vy = (Math.random() - 0.5) * 0.4;

                particles.push(new Particle(x, y, vx, vy, size));
            }
        };

        // Draw connecting lines
        const connectParticles = () => {
            let maxDist = 120;
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    let dx = particles[a].x - particles[b].x;
                    let dy = particles[a].y - particles[b].y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < maxDist) {
                        // Calculate opacity based on distance
                        let opacity = (1 - (distance / maxDist)) * 0.15;
                        ctx.strokeStyle = `rgba(129, 140, 248, ${opacity})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }

                // Connect to mouse as well
                if (mouse.x !== null && mouse.y !== null) {
                    let dx = mouse.x - particles[a].x;
                    let dy = mouse.y - particles[a].y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < mouse.radius) {
                        let opacity = (1 - (distance / mouse.radius)) * 0.25;
                        ctx.strokeStyle = `rgba(6, 182, 212, ${opacity})`;
                        ctx.lineWidth = 1.2;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.stroke();
                    }
                }
            }
        };

        // Animation Loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
            }
            connectParticles();
            requestAnimationFrame(animate);
        };

        // Hook listeners
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        animate();
    }

    // ----------------------------------------------------------------------
    // 5. Projects Filter Tabs Logic
    // ----------------------------------------------------------------------
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterButtons.length && projectCards.length) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Toggle active button class
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const selectedFilter = btn.getAttribute('data-filter');

                // Filter cards
                projectCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');

                    if (selectedFilter === 'all' || cardCategory === selectedFilter) {
                        card.style.display = 'block';
                        // Add fade animation
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.95)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // ----------------------------------------------------------------------
    // 6. Contact Form Validation and EmailJS Integration
    // ----------------------------------------------------------------------
    // Replace these values with your actual EmailJS configurations
    const EMAILJS_PUBLIC_KEY = 'CibYXzmKCvKIDn0r3';
    const EMAILJS_SERVICE_ID = 'service_2tepvoa';
    const EMAILJS_TEMPLATE_ID = 'template_1z4nzu5';

    // Initialize EmailJS SDK if configured
    if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
        emailjs.init({
            publicKey: EMAILJS_PUBLIC_KEY,
        });
    }

    const contactForm = document.getElementById('contact-form');
    const formSubmitBtn = document.getElementById('form-submit-btn');
    const statusMsg = document.getElementById('form-status');

    if (contactForm && formSubmitBtn && statusMsg) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Disable button during loading
            formSubmitBtn.disabled = true;
            const originalBtnContent = formSubmitBtn.innerHTML;
            formSubmitBtn.innerHTML = `<span>Sending...</span><i class="fa-solid fa-spinner fa-spin"></i>`;
            statusMsg.className = 'form-status-msg';
            statusMsg.textContent = '';

            // If not yet configured, run simulation fallback
            if (typeof emailjs === 'undefined' || EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
                setTimeout(() => {
                    statusMsg.textContent = 'Message simulated! (Configure your EmailJS keys in script.js to receive real emails)';
                    statusMsg.classList.add('success');
                    contactForm.reset();
                    formSubmitBtn.disabled = false;
                    formSubmitBtn.innerHTML = originalBtnContent;
                }, 1500);
                return;
            }

            // Map parameters to cover both custom templates and EmailJS defaults (from_name, reply_to)
            const templateParams = {
                name: contactForm.name.value,
                email: contactForm.email.value,
                from_name: contactForm.name.value,
                reply_to: contactForm.email.value,
                subject: contactForm.subject.value,
                message: contactForm.message.value
            };

            // Send actual email via EmailJS
            emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
                .then(() => {
                    statusMsg.textContent = 'Message sent successfully! Ariff will get back to you soon.';
                    statusMsg.classList.add('success');
                    contactForm.reset();
                })
                .catch((error) => {
                    statusMsg.textContent = 'Failed to send message. Please try again or email directly.';
                    statusMsg.classList.add('error');
                    console.error('EmailJS Error:', error);
                })
                .finally(() => {
                    setTimeout(() => {
                        formSubmitBtn.disabled = false;
                        formSubmitBtn.innerHTML = originalBtnContent;
                    }, 1000);
                });
        });
    }

    // ----------------------------------------------------------------------
    // 7. Slide Presentation Mode Logic
    // ----------------------------------------------------------------------
    const presToggle = document.getElementById('presentation-toggle');
    const presExit = document.getElementById('pres-exit');
    const presPrint = document.getElementById('pres-print');
    const presPrev = document.getElementById('pres-prev');
    const presNext = document.getElementById('pres-next');
    const presCounter = document.getElementById('pres-counter');
    const slides = Array.from(document.querySelectorAll('main > section'));
    let currentSlide = 0;
    let isPresMode = false;

    const updateSlides = () => {
        slides.forEach((slide, idx) => {
            if (idx === currentSlide) {
                slide.classList.add('active-slide');
            } else {
                slide.classList.remove('active-slide');
            }
        });
        presCounter.textContent = `${currentSlide + 1} / ${slides.length}`;
    };

    const enterPresMode = () => {
        isPresMode = true;
        document.body.classList.add('presentation-mode');

        // Find which section is currently closest to the top of screen
        let inViewIdx = 0;
        let minDiff = Infinity;
        slides.forEach((slide, idx) => {
            const diff = Math.abs(slide.getBoundingClientRect().top);
            if (diff < minDiff) {
                minDiff = diff;
                inViewIdx = idx;
            }
        });
        currentSlide = inViewIdx;
        updateSlides();
    };

    const exitPresMode = () => {
        isPresMode = false;
        document.body.classList.remove('presentation-mode');
        slides.forEach(slide => slide.classList.remove('active-slide'));

        // Scroll to the active slide's section in normal mode
        setTimeout(() => {
            slides[currentSlide].scrollIntoView({ behavior: 'auto' });
        }, 50);
    };

    const nextSlide = () => {
        if (currentSlide < slides.length - 1) {
            currentSlide++;
            updateSlides();
        }
    };

    const prevSlide = () => {
        if (currentSlide > 0) {
            currentSlide--;
            updateSlides();
        }
    };

    if (presToggle && presExit && presPrev && presNext) {
        presToggle.addEventListener('click', enterPresMode);
        presExit.addEventListener('click', exitPresMode);
        presPrev.addEventListener('click', prevSlide);
        presNext.addEventListener('click', nextSlide);

        if (presPrint) {
            presPrint.addEventListener('click', () => {
                window.print();
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!isPresMode) return;
            if (e.key === 'ArrowRight' || e.key === ' ') {
                e.preventDefault();
                nextSlide();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevSlide();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                exitPresMode();
            }
        });
    }
});
