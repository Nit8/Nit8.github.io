// File: script.js
// Add animation to cards on page load
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach((card, index) => {
        // Add delay to each card animation
        card.style.animationDelay = `${index * 0.2}s`;
        
        // Add click event for mobile devices
        card.addEventListener('click', function() {
            this.querySelector('.card-inner').classList.toggle('flipped');
        });
    });
});
    