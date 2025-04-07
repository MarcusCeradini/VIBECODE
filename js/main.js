// Game instances
let blackjackGame = null;
let slotMachine = null;
let rouletteGame = null;
let crapsGame = null;

// Initialize games when pages load
document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname;
    
    if (currentPage.includes('blackjack.html')) {
        initBlackjack();
    } else if (currentPage.includes('slots.html')) {
        initSlots();
    } else if (currentPage.includes('roulette.html')) {
        initRoulette();
    } else if (currentPage.includes('craps.html')) {
        initCraps();
    }
});

function updateBalance(balance) {
    const balanceElement = document.getElementById('balance');
    if (balanceElement) {
        balanceElement.textContent = `Balance: $${balance}`;
    }
}

// Game initialization functions
function initBlackjack() {
    blackjackGame = new BlackjackGame();
    // Add your blackjack UI initialization here
}

function initSlots() {
    slotMachine = new SlotMachine();
    // Add your slots UI initialization here
}

function initRoulette() {
    rouletteGame = new RouletteGame();
    // Add your roulette UI initialization here
}

function initCraps() {
    crapsGame = new CrapsGame();
    // Add your craps UI initialization here
}

// Add game-specific functions for UI interactions here
