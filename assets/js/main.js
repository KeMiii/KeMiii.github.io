/**
 * KEMI HUANG - Personal Website
 * Main JavaScript
 */

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Initialize all modules
    initTheme();
    initNavigation();
    initMobileNav();
    initScrollEffects();
    initTypewriter();
    initParticles();
    initQRCode();
    initRevealAnimations();
    
    // Initialize COS image optimization
    if (typeof imageOptimizer !== 'undefined') {
        initCOSImageOptimization();
    }
});

/**
 * Theme Toggle (Dark/Light Mode)
 */
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check for saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (prefersDark.matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    themeToggle?.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // Listen for system theme changes
    prefersDark.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
        }
    });
}

/**
 * Navigation - Active Link & Scroll Effect
 */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Scroll effect for navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }

        // Update active nav link based on scroll position
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

/**
 * Mobile Navigation Toggle
 */
function initMobileNav() {
    const navToggle = document.getElementById('navToggle');
    const mobileNav = document.getElementById('mobileNav');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    navToggle?.addEventListener('click', () => {
        mobileNav?.classList.toggle('active');
        const isOpen = mobileNav?.classList.contains('active');
        navToggle.innerHTML = isOpen 
            ? '<i data-lucide="x"></i>' 
            : '<i data-lucide="menu"></i>';
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    });

    // Close mobile nav when clicking a link
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNav?.classList.remove('active');
            navToggle.innerHTML = '<i data-lucide="menu"></i>';
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        });
    });
}

/**
 * Scroll Effects - Smooth scroll for anchor links
 */
function initScrollEffects() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Typewriter Effect for Hero Subtitle
 */
function initTypewriter() {
    const typewriterText = document.querySelector('.typewriter-text');
    if (!typewriterText) return;

    const phrases = [
        'AR Designer & Developer',
        'Unity3D Enthusiast',
        'Computer Engineering Master',
        'Cross-border Creative Technologist'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            typewriterText.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            typewriterText.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            // Pause at the end
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }

    type();
}

/**
 * Particle Background Effect - Gentle Mouse Following
 */
function initParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;

    const canvas = document.createElement('canvas');
    particlesContainer.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let isMouseInCanvas = false;
    const MAX_PARTICLES = 80;
    const MIN_PARTICLES = 50;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createParticle() {
        // 在屏幕边缘随机生成新粒子
        const side = Math.floor(Math.random() * 4);
        let x, y;
        
        switch(side) {
            case 0: // top
                x = Math.random() * canvas.width;
                y = -20;
                break;
            case 1: // right
                x = canvas.width + 20;
                y = Math.random() * canvas.height;
                break;
            case 2: // bottom
                x = Math.random() * canvas.width;
                y = canvas.height + 20;
                break;
            case 3: // left
                x = -20;
                y = Math.random() * canvas.height;
                break;
        }
        
        return {
            x: x,
            y: y,
            // 粒子大小差距更大：小的0.5，大的4
            size: Math.random() * 3.5 + 0.5,
            baseSpeedX: (Math.random() - 0.5) * 0.4,
            baseSpeedY: (Math.random() - 0.5) * 0.4,
            speedX: (Math.random() - 0.5) * 0.4,
            speedY: (Math.random() - 0.5) * 0.4,
            // 亮度差距更大：暗的0.15，亮的0.9
            opacity: Math.random() * 0.75 + 0.15,
            // 跟随鼠标的参数
            followStrength: Math.random() * 0.008 + 0.002
        };
    }

    function createParticles() {
        particles = [];
        for (let i = 0; i < MIN_PARTICLES; i++) {
            const p = createParticle();
            // 初始时在屏幕内随机分布
            p.x = Math.random() * canvas.width;
            p.y = Math.random() * canvas.height;
            particles.push(p);
        }
    }

    // Mouse tracking
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
        isMouseInCanvas = true;
    });

    canvas.addEventListener('mouseleave', () => {
        isMouseInCanvas = false;
    });

    canvas.addEventListener('mouseenter', () => {
        isMouseInCanvas = true;
    });

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const color = isDark ? '124, 58, 237' : '124, 58, 237';
        
        // 粒子数量管理 - 更频繁生成
        if (particles.length < MIN_PARTICLES && Math.random() < 0.1) {
            particles.push(createParticle());
        }
        if (isMouseInCanvas && particles.length < MAX_PARTICLES && Math.random() < 0.05) {
            particles.push(createParticle());
        }
        // 鼠标附近额外生成粒子
        if (isMouseInCanvas && particles.length < MAX_PARTICLES) {
            if (Math.random() < 0.02) {
                const p = createParticle();
                // 在鼠标附近生成
                p.x = mouseX + (Math.random() - 0.5) * 100;
                p.y = mouseY + (Math.random() - 0.5) * 100;
                particles.push(p);
            }
        }
        
        // 更新和绘制粒子
        for (let i = particles.length - 1; i >= 0; i--) {
            const particle = particles[i];
            
            // 鼠标跟随效果 - 更温和
            if (isMouseInCanvas) {
                const dx = mouseX - particle.x;
                const dy = mouseY - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // 粒子被鼠标轻微吸引
                if (distance > 80 && distance < 400) {
                    const force = particle.followStrength * (1 - distance / 400) * 0.5;
                    particle.speedX += dx * force;
                    particle.speedY += dy * force;
                } else if (distance <= 80) {
                    // 太近了，轻微排斥（防止抖动）
                    const repelForce = 0.02;
                    particle.speedX -= dx * repelForce;
                    particle.speedY -= dy * repelForce;
                }
            }
            
            // 更慢的速度衰减
            particle.speedX *= 0.98;
            particle.speedY *= 0.98;
            
            // 添加基础随机运动
            particle.speedX += particle.baseSpeedX * 0.05;
            particle.speedY += particle.baseSpeedY * 0.05;
            
            // 限制最大速度（防止抖动）
            const maxSpeed = 2;
            const currentSpeed = Math.sqrt(particle.speedX ** 2 + particle.speedY ** 2);
            if (currentSpeed > maxSpeed) {
                particle.speedX = (particle.speedX / currentSpeed) * maxSpeed;
                particle.speedY = (particle.speedY / currentSpeed) * maxSpeed;
            }
            
            // 更新位置
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // 检查是否飞出屏幕太远，如果是则移除
            if (particle.x < -100 || particle.x > canvas.width + 100 || 
                particle.y < -100 || particle.y > canvas.height + 100) {
                particles.splice(i, 1);
                continue;
            }
            
            // 绘制粒子
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${color}, ${particle.opacity})`;
            ctx.fill();
            
            // 鼠标和粒子之间的连线（更淡）
            if (isMouseInCanvas) {
                const dx = mouseX - particle.x;
                const dy = mouseY - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 200) {
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(mouseX, mouseY);
                    ctx.strokeStyle = `rgba(${color}, ${0.08 * (1 - distance / 200)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        // Draw connections between particles
        particles.forEach((particle1, i) => {
            particles.slice(i + 1).forEach(particle2 => {
                const dx = particle1.x - particle2.x;
                const dy = particle1.y - particle2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particle1.x, particle1.y);
                    ctx.lineTo(particle2.x, particle2.y);
                    ctx.strokeStyle = `rgba(${color}, ${0.05 * (1 - distance / 100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            });
        });

        animationId = requestAnimationFrame(animate);
    }

    resize();
    createParticles();
    animate();

    window.addEventListener('resize', () => {
        resize();
        createParticles();
    });

    // Pause animation when tab is not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animationId);
        } else {
            animate();
        }
    });
}

/**
 * QR Code Generator
 */
function initQRCode() {
    const qrContainer = document.getElementById('qrcode');
    if (!qrContainer) return;

    // Get current URL for QR code
    const url = window.location.href || 'https://kemiii.github.io';

    // Create QR code
    new QRCode(qrContainer, {
        text: url,
        width: 180,
        height: 180,
        colorDark: '#171717',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.M
    });
}

/**
 * Reveal Animations on Scroll (Intersection Observer)
 */
function initRevealAnimations() {
    const revealElements = document.querySelectorAll('.timeline-item, .portfolio-card, .photo-item, .skill-category, .language-item, .contact-link');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Add stagger delay for grid items
                if (entry.target.classList.contains('photo-item')) {
                    const index = Array.from(entry.target.parentElement.children).indexOf(entry.target);
                    entry.target.style.transitionDelay = `${index * 100}ms`;
                }
            }
        });
    }, observerOptions);

    revealElements.forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });
}

/**
 * Smooth Page Load
 */
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

/**
 * Console Easter Egg
 */
console.log('%c KEMI HUANG ', 'background: #7c3aed; color: white; font-size: 20px; padding: 10px; border-radius: 5px;');
console.log('%c AR Designer & Developer ', 'background: #8b5cf6; color: white; padding: 5px 10px; border-radius: 3px;');
console.log('Welcome to my personal website! Feel free to explore.');
console.log('GitHub: https://github.com/KeMiii');
console.log('Email: kemi24678@gmail.com');

/**
 * COS Image Optimization Initialization
 * 腾讯云 COS 图片优化初始化
 */
function initCOSImageOptimization() {
    // 关键图片预加载
    const criticalImages = [
        'images/avatar.jpg',
        'images/数字仓城.png',
        'images/ar-exhibition/cover.jpg',
    ];
    
    if (typeof preloadImages === 'function') {
        preloadImages(criticalImages);
    }

    // 优化所有 COS 图片
    if (typeof imageOptimizer !== 'undefined' && imageOptimizer) {
        imageOptimizer.optimizeAllImages();
    }

    // 监控图片加载
    if (typeof setupImageMonitoring === 'function') {
        setupImageMonitoring();
    }

    // 输出优化信息
    console.log('%c COS Image Optimization Enabled ', 'background: #10b981; color: white; padding: 5px 10px; border-radius: 3px;');
}
