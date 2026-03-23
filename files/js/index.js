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
