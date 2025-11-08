// Loading animation functions
function showLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.remove('hide');
    }
    // Hide dashboard content during loading
    document.body.classList.add('loading');
    // Play scanning sound
    const scanAudio = document.getElementById('scanAudio');
    if (scanAudio) {
        scanAudio.currentTime = 0;
        scanAudio.play().catch(err => {
            console.log('Audio play failed:', err);
        });
    }
}

function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.add('hide');
    }
    // Let audio continue playing until it ends naturally
    const scanAudio = document.getElementById('scanAudio');
    if (scanAudio) {
        scanAudio.loop = false; // Disable looping so it plays once to the end
    }
    // Show dashboard content after loading
    document.body.classList.remove('loading');
    document.body.classList.remove('black-screen'); // Remove black screen
    // Animate cards one by one
    animateCards();
}

function animateCards() {
    const cards = document.querySelectorAll('.card:not(.hide)');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('card-visible');
            // Animate text in this card
            animateCardText(card);
        }, index * 100); // 100ms delay between each card
    });
}

function animateCardText(card) {
    const textElements = card.querySelectorAll(
        '.metric-value, .metric-label, .card-title, .score-large, .contributor-label, .contributor-score, .time-display, .status-badge'
    );
    
    textElements.forEach((element, elementIndex) => {
        const text = element.textContent;
        if (!text || text === '-') return;
        
        // Wrap each character in a span
        const chars = text.split('');
        element.innerHTML = '';
        chars.forEach((char, charIndex) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.opacity = '0';
            span.style.display = 'inline-block';
            element.appendChild(span);
            
            // Animate character appearance very rapidly
            setTimeout(() => {
                span.style.transition = 'opacity 0.05s ease';
                span.style.opacity = '1';
            }, (elementIndex * 20) + (charIndex * 5)); // Very fast: 5ms per character
        });
    });
}

