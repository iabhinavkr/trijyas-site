// Global interactive background element matching the cursor
document.addEventListener('DOMContentLoaded', () => {
    // Check if not on touchscreen/mobile device
    if (window.matchMedia("(any-hover: none)").matches) return;

    // Create the background glowing orb
    const cursorGlow = document.createElement('div');
    cursorGlow.id = 'cursorGlow';
    document.body.appendChild(cursorGlow);

    // Initial positioning off-screen
    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let glowX = mouseX, glowY = mouseY;
    
    // Store mouse position instead of moving immediately to allow smoothing
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Appear on first move
        if (cursorGlow.style.opacity === "") {
            cursorGlow.style.opacity = "0.7";
        }
    });

    // Handle scroll offset
    let scrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
    });

    function animateGlow() {
        // Smoothly interpolate current glow position to mouse position
        glowX += (mouseX - glowX) * 0.15;
        glowY += (mouseY - glowY) * 0.15;
        
        // Translate the glow based on viewport position. The glow is fixed.
        // Wait, if it's fixed, we don't need scrollY!
        cursorGlow.style.transform = `translate(${glowX}px, ${glowY}px)`;
        
        requestAnimationFrame(animateGlow);
    }
    
    // Start animation loop
    animateGlow();
});

// Theme toggle logic
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    if (!themeToggle || !themeIcon) return;

    const moonSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 24px; height: 24px;"><path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>`;
    const sunSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 24px; height: 24px;"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>`;

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.innerHTML = sunSvg;
    } else {
        themeIcon.innerHTML = moonSvg;
    }

    themeToggle.addEventListener('click', () => {
        if (document.documentElement.getAttribute('data-theme') === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            themeIcon.innerHTML = moonSvg;
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeIcon.innerHTML = sunSvg;
        }
    });
});

// Auto-scroll logic for reviews
document.addEventListener('DOMContentLoaded', () => {
    const reviewsScroll = document.querySelector('.reviews-scroll');
    if (!reviewsScroll) return;

    let autoScrollInterval;
    let isHovered = false;

    // Enhance native smooth scrolling specifically for the container
    reviewsScroll.style.scrollBehavior = 'smooth';

    const scrollNext = () => {
        if (isHovered) return;
        const card = reviewsScroll.querySelector('.review-card');
        if (!card) return;
        
        const cardWidth = card.offsetWidth;
        const style = window.getComputedStyle(reviewsScroll);
        const gap = parseInt(style.gap) || 24;
        
        const scrollStep = cardWidth + gap;
        const maxScroll = reviewsScroll.scrollWidth - reviewsScroll.clientWidth;
        
        // Loop back smoothly if max reached
        if (Math.ceil(reviewsScroll.scrollLeft) >= Math.floor(maxScroll) - 10) {
            reviewsScroll.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            reviewsScroll.scrollBy({ left: scrollStep, behavior: 'smooth' });
        }
    };

    const startScroll = () => {
        clearInterval(autoScrollInterval);
        autoScrollInterval = setInterval(scrollNext, 2500);
    };

    // Initiate slider after slight buffer
    setTimeout(startScroll, 1000);

    // Pause functionality on interaction
    reviewsScroll.addEventListener('pointerenter', () => { isHovered = true; clearInterval(autoScrollInterval); });
    reviewsScroll.addEventListener('pointerleave', () => { isHovered = false; startScroll(); });
    reviewsScroll.addEventListener('touchstart', () => { isHovered = true; clearInterval(autoScrollInterval); }, {passive: true});
    reviewsScroll.addEventListener('touchend', () => { 
        setTimeout(() => { isHovered = false; startScroll(); }, 1500); 
    }, {passive: true});
});
