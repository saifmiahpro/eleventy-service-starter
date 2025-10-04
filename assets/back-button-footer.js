/**
 * Change le style du bouton "Voir les offres" quand il arrive au footer
 * Pour qu'il reste visible sur le fond noir du footer
 */

document.addEventListener('DOMContentLoaded', () => {
  const backButton = document.querySelector('a[href*="/depanneur/"], a[href*="/electricien/"], a[href*="/serrurier/"]');
  const footer = document.querySelector('.footer');
  
  if (!backButton || !footer) return;
  
  // Créer l'observer pour détecter l'intersection avec le footer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Footer visible - Bouton blanc avec fond blanc semi-transparent
        backButton.style.background = 'rgba(255, 255, 255, 0.95)';
        backButton.style.color = '#0F0F0F';
        backButton.style.border = '2px solid rgba(255, 255, 255, 1)';
        backButton.style.boxShadow = '0 4px 20px rgba(255, 255, 255, 0.3)';
      } else {
        // Pas au footer - Style transparent original
        backButton.style.background = 'rgba(255, 255, 255, 0.1)';
        backButton.style.color = 'white';
        backButton.style.border = '2px solid rgba(255, 255, 255, 0.3)';
        backButton.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
      }
    });
  }, {
    threshold: 0.1, // Trigger quand 10% du footer est visible
    rootMargin: '0px 0px -50px 0px' // Trigger un peu avant d'arriver au footer
  });
  
  observer.observe(footer);
});
