document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       1. Splash Screen & Initialization
       ========================================== */
    const splashScreen = document.getElementById('splash-screen');
    setTimeout(() => {
        splashScreen.style.opacity = '0';
        splashScreen.style.transition = 'opacity 0.6s ease';
        setTimeout(() => {
            splashScreen.style.display = 'none';
            document.body.classList.remove('loading');
            initAnimations();
        }, 600);
    }, 2000);

    /* ==========================================
       2. Lenis Smooth Scroll
       ========================================== */
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    /* Integrate Lenis with GSAP ScrollTrigger */
    gsap.registerPlugin(ScrollTrigger);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time)=>{
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0, 0);


    /* ==========================================
       3. Custom Cursor & Magnetic Effect
       ========================================== */
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    // Check if device supports hover
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    
    if (!isTouchDevice && cursorDot && cursorOutline) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;
            
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
            
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        // Hover effect on interactive elements
        const interactives = document.querySelectorAll('a, button, .magnetic, .skill-orb, input, textarea');
        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => cursorOutline.classList.add('hovering'));
            el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hovering'));
        });

        // Magnetic Effect
        const magnetics = document.querySelectorAll('.magnetic');
        magnetics.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const h = rect.width / 2;
                const v = rect.height / 2;
                const x = e.clientX - rect.left - h;
                const y = e.clientY - rect.top - v;
                btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = `translate(0px, 0px)`;
            });
        });
    }

    /* ==========================================
       4. Navbar & Mobile Menu
       ========================================== */
    const navbar = document.querySelector('.navbar');
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        // Sticky Navbar
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active Link
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= (sectionTop - 250)) {
                current = section.getAttribute('id');
            }
        });
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').substring(1) === current) {
                item.classList.add('active');
            }
        });
    });

    mobileBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    navItems.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });


    /* ==========================================
       5. Typewriter Effect (Hero)
       ========================================== */
    const typewords = ["Full Stack Developer", "AI & ML Enthusiast", "Python | React | Django"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeElement = document.getElementById('typewriter-text');
    
    function type() {
        if(!typeElement) return;
        const currentWord = typewords[wordIndex];
        
        if (isDeleting) {
            typeElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typeElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % typewords.length;
            typeSpeed = 500; // Pause before next word
        }
        
        setTimeout(type, typeSpeed);
    }


    /* ==========================================
       6. tsParticles Initialization
       ========================================== */
    tsParticles.load("particles-js", {
        background: { color: { value: "transparent" } },
        fpsLimit: 60,
        interactivity: {
            events: {
                onHover: { enable: true, mode: "repulse" },
                resize: true,
            },
            modes: {
                repulse: { distance: 100, duration: 0.4 },
            },
        },
        particles: {
            color: { value: "#00ffcc" },
            links: {
                color: "#00ffcc",
                distance: 150,
                enable: true,
                opacity: 0.2,
                width: 1,
            },
            move: {
                direction: "none",
                enable: true,
                outModes: { default: "bounce" },
                random: false,
                speed: 1,
                straight: false,
            },
            number: {
                density: { enable: true, area: 800 },
                value: 60,
            },
            opacity: { value: 0.3 },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 3 } },
        },
        detectRetina: true,
    });


    /* ==========================================
       7. Three.js Initialization (Hero & About)
       ========================================== */
    function initThreeJS() {
        // Hero Canvas (Wireframe Globe / Icosahedron)
        const heroContainer = document.getElementById('hero-canvas');
        if(heroContainer) {
            const hScene = new THREE.Scene();
            const hCamera = new THREE.PerspectiveCamera(75, heroContainer.clientWidth / heroContainer.clientHeight, 0.1, 1000);
            const hRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            hRenderer.setSize(heroContainer.clientWidth, heroContainer.clientHeight);
            heroContainer.appendChild(hRenderer.domElement);

            const geometry = new THREE.IcosahedronGeometry(2.5, 1);
            const material = new THREE.MeshBasicMaterial({ 
                color: 0x00ffcc, 
                wireframe: true,
                transparent: true,
                opacity: 0.7
            });
            const heroMesh = new THREE.Mesh(geometry, material);
            hScene.add(heroMesh);

            hCamera.position.z = 5;

            // Optional hover rotation tracking
            let targetX = 0;
            let targetY = 0;
            if(!isTouchDevice) {
                document.addEventListener('mousemove', (e) => {
                    targetX = (e.clientX / window.innerWidth - 0.5) * 2;
                    targetY = (e.clientY / window.innerHeight - 0.5) * 2;
                });
            }

            function hAnimate() {
                requestAnimationFrame(hAnimate);
                heroMesh.rotation.x += 0.005;
                heroMesh.rotation.y += 0.005;
                
                heroMesh.rotation.x += 0.05 * (targetY - heroMesh.rotation.x);
                heroMesh.rotation.y += 0.05 * (targetX - heroMesh.rotation.y);
                
                hRenderer.render(hScene, hCamera);
            }
            hAnimate();

            window.addEventListener('resize', () => {
                hCamera.aspect = heroContainer.clientWidth / heroContainer.clientHeight;
                hCamera.updateProjectionMatrix();
                hRenderer.setSize(heroContainer.clientWidth, heroContainer.clientHeight);
            });
        }

        // About Canvas (Abstract Shape)
        const aboutContainer = document.getElementById('about-canvas');
        if(aboutContainer) {
            const aScene = new THREE.Scene();
            const aCamera = new THREE.PerspectiveCamera(75, aboutContainer.clientWidth / aboutContainer.clientHeight, 0.1, 1000);
            const aRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            aRenderer.setSize(aboutContainer.clientWidth, aboutContainer.clientHeight);
            aboutContainer.appendChild(aRenderer.domElement);

            // TorusKnot
            const aGeometry = new THREE.TorusKnotGeometry(1.5, 0.4, 100, 16);
            const aMaterial = new THREE.MeshPhysicalMaterial({
                color: 0x00e5ff,
                metalness: 0.9,
                roughness: 0.1,
                clearcoat: 1.0,
                clearcoatRoughness: 0.1,
                wireframe: false
            });
            const aboutMesh = new THREE.Mesh(aGeometry, aMaterial);
            aScene.add(aboutMesh);

            // Lighting needed for physical material
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
            aScene.add(ambientLight);
            const dirLight = new THREE.DirectionalLight(0x00ffcc, 1);
            dirLight.position.set(5, 5, 5);
            aScene.add(dirLight);

            aCamera.position.z = 4;

            function aAnimate() {
                requestAnimationFrame(aAnimate);
                aboutMesh.rotation.x += 0.01;
                aboutMesh.rotation.y += 0.005;
                aRenderer.render(aScene, aCamera);
            }
            aAnimate();

            window.addEventListener('resize', () => {
                aCamera.aspect = aboutContainer.clientWidth / aboutContainer.clientHeight;
                aCamera.updateProjectionMatrix();
                aRenderer.setSize(aboutContainer.clientWidth, aboutContainer.clientHeight);
            });
        }
    }


    /* ==========================================
       8. Vanilla Tilt Initialization
       ========================================== */
    VanillaTilt.init(document.querySelectorAll(".project-tilt-card"), {
        max: 15,
        speed: 400,
        glare: true,
        "max-glare": 0.2,
    });


    /* ==========================================
       9. GSAP Scroll Animations
       ========================================== */
    function initAnimations() {
        // Start Typewriter
        type();

        // General Reveals
        gsap.utils.toArray('.gs-reveal').forEach(elem => {
            gsap.fromTo(elem, 
                { y: 50, opacity: 0 },
                {
                    scrollTrigger: {
                        trigger: elem,
                        start: "top 80%",
                    },
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: "power3.out"
                }
            );
        });

        gsap.utils.toArray('.gs-reveal-up').forEach(elem => {
            gsap.fromTo(elem, 
                { y: 60, opacity: 0 },
                {
                    scrollTrigger: {
                        trigger: elem,
                        start: "top 85%",
                    },
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.2,
                    ease: "power3.out"
                }
            );
        });

        gsap.utils.toArray('.gs-reveal-left').forEach(elem => {
            gsap.fromTo(elem, 
                { x: -60, opacity: 0 },
                {
                    scrollTrigger: {
                        trigger: elem,
                        start: "top 80%",
                    },
                    x: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power3.out"
                }
            );
        });

        gsap.utils.toArray('.gs-reveal-right').forEach(elem => {
            gsap.fromTo(elem, 
                { x: 60, opacity: 0 },
                {
                    scrollTrigger: {
                        trigger: elem,
                        start: "top 80%",
                    },
                    x: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power3.out"
                }
            );
        });

        // Staggered Lists
        gsap.utils.toArray('.list-stagger').forEach(list => {
            const items = list.querySelectorAll('li');
            gsap.fromTo(items, 
                { x: 30, opacity: 0 },
                {
                    scrollTrigger: {
                        trigger: list,
                        start: "top 80%",
                    },
                    x: 0,
                    opacity: 1,
                    duration: 0.6,
                    stagger: 0.15,
                    ease: "power2.out"
                }
            );
        });

        // Timeline nodes
        gsap.utils.toArray('.gs-timeline-h').forEach((node, i) => {
            gsap.fromTo(node,
                { y: 50, opacity: 0 },
                {
                    scrollTrigger: {
                        trigger: '.edu-timeline',
                        start: "top 80%",
                    },
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    delay: i * 0.2,
                    ease: "back.out(1.7)"
                }
            );
        });

        // Init Three.js
        initThreeJS();

        // Counters Count-Up Animation
        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => {
            ScrollTrigger.create({
                trigger: counter,
                start: "top 90%",
                once: true,
                onEnter: () => {
                    const target = parseFloat(counter.getAttribute('data-target'));
                    const decimals = parseInt(counter.getAttribute('data-decimals')) || 0;
                    
                    gsap.to(counter, {
                        innerHTML: target,
                        duration: 2,
                        ease: "power1.out",
                        snap: { innerHTML: 0.1 },
                        onUpdate: function() {
                            counter.innerHTML = (Math.round(this.targets()[0].innerHTML * 10) / 10).toFixed(decimals);
                        }
                    });
                }
            });
        });
    }

    /* ==========================================
       10. Back to Top Button
       ========================================== */
    const backToTopBtn = document.getElementById('backToTop');
    const circle = document.querySelector('.progress-ring__circle');
    const radius = circle.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;
    
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = circumference;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }

        // Calculate scroll progress
        const scrollTop = window.scrollY;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollFraction = scrollTop / docHeight;
        
        const offset = circumference - scrollFraction * circumference;
        circle.style.strokeDashoffset = offset;
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

});
