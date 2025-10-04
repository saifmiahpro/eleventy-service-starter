/**
 * INFINITE CAROUSEL WITH DRAG
 * ============================
 * True infinite loop with seamless transitions
 */

(function() {
  'use strict';
  
  // Initialize all carousels - Vitesse équilibrée
  initCarousel('.services-carousel', '.carousel-track', 1.2);
  initCarousel('.reviews-carousel', '.reviews-track', 1);
  initCarousel('.gallery-carousel', '.gallery-track', 0.8);
  
  function initCarousel(containerSelector, trackSelector, speed) {
    const container = document.querySelector(containerSelector);
    if (!container) {
      console.log(`⚠️ Container not found: ${containerSelector}`);
      return;
    }
    
    const track = container.querySelector(trackSelector);
    if (!track) {
      console.log(`⚠️ Track not found: ${trackSelector}`);
      return;
    }
    
    // Get original items
    const originalItems = Array.from(track.children);
    
    // Duplicate 3 times for perfect infinite effect
    for (let i = 0; i < 2; i++) {
      originalItems.forEach(item => {
        const clone = item.cloneNode(true);
        track.appendChild(clone);
      });
    }
    
    let isDragging = false;
    let startX = 0;
    let currentX = 0;
    let prevX = 0;
    let autoScrollRAF = null;
    
    // Start at negative position to enable both directions
    setTimeout(() => {
      const setWidth = getSetWidth();
      currentX = -setWidth;
      prevX = currentX;
      track.style.transform = `translateX(${currentX}px)`;
    }, 100);
    
    // Calculate one set width
    const getSetWidth = () => {
      let width = 0;
      for (let i = 0; i < originalItems.length; i++) {
        const child = track.children[i];
        if (child) {
          const style = window.getComputedStyle(child);
          width += child.offsetWidth + parseFloat(style.marginRight || 0);
        }
      }
      // Add gap
      const gap = parseFloat(window.getComputedStyle(track).gap || 0);
      width += gap * (originalItems.length - 1);
      return width;
    };
    
    // Auto-scroll animation
    function autoScroll() {
      if (!isDragging) {
        currentX -= speed;
        
        // Seamless loop in BOTH directions
        const setWidth = getSetWidth();
        
        // Going left (negative)
        if (currentX <= -setWidth * 2) {
          currentX += setWidth;
        }
        // Going right (positive)
        else if (currentX >= 0) {
          currentX -= setWidth;
        }
        
        track.style.transform = `translateX(${currentX}px)`;
      }
      autoScrollRAF = requestAnimationFrame(autoScroll);
    }
    
    // Start auto-scroll
    autoScroll();
    
    // Mouse/Touch handlers
    function handleStart(e) {
      isDragging = true;
      track.style.cursor = 'grabbing';
      startX = getClientX(e);
      prevX = currentX;
      e.preventDefault();
    }
    
    function handleMove(e) {
      if (!isDragging) return;
      e.preventDefault();
      
      const clientX = getClientX(e);
      const diff = clientX - startX;
      currentX = prevX + diff;
      
      // Apply seamless loop during drag (BOTH directions)
      const setWidth = getSetWidth();
      
      // Going left (too negative)
      if (currentX <= -setWidth * 2) {
        currentX += setWidth;
        prevX = currentX;
        startX = clientX;
      }
      // Going right (too positive)
      else if (currentX >= 0) {
        currentX -= setWidth;
        prevX = currentX;
        startX = clientX;
      }
      
      track.style.transform = `translateX(${currentX}px)`;
    }
    
    function handleEnd() {
      if (!isDragging) return;
      isDragging = false;
      track.style.cursor = 'grab';
      prevX = currentX;
    }
    
    function getClientX(e) {
      if (e.type.includes('mouse')) {
        return e.clientX;
      }
      // Pour touch, utiliser touches ou changedTouches
      return (e.touches && e.touches[0]) ? e.touches[0].clientX : 
             (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientX : 0;
    }
    
    // Mouse events
    track.addEventListener('mousedown', handleStart);
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    
    // Touch events - avec passive: false pour preventDefault
    track.addEventListener('touchstart', handleStart, { passive: false });
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('touchend', handleEnd);
    document.addEventListener('touchcancel', handleEnd);
    
    // Prevent text selection
    track.addEventListener('selectstart', (e) => e.preventDefault());
    track.addEventListener('dragstart', (e) => e.preventDefault());
    
    console.log(`✅ Carousel ready: ${containerSelector} (speed: ${speed}px/frame)`);
  }
  
  console.log('🎡 All carousels initialized');
})();
