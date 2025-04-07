// Shared functionality for all casino games
function updateBalance(amount) {
    document.getElementById('balance').textContent = `Balance: $${amount}`;
}

// Money management
const INITIAL_MONEY = 1000;

function getBalance() {
    const balance = localStorage.getItem('casinoBalance');
    if (balance === null) {
        localStorage.setItem('casinoBalance', INITIAL_MONEY);
        return INITIAL_MONEY;
    }
    return parseInt(balance);
}

function setBalance(amount) {
    localStorage.setItem('casinoBalance', amount);
    updateBalanceDisplay(amount);
}

function updateBalanceDisplay(amount) {
    const balanceElement = document.getElementById('balance');
    if (balanceElement) {
        balanceElement.textContent = formatMoney(amount).replace('$', 'Balance: $');
    }
}

// Betting validation
function validateBet(bet, balance) {
    if (!bet || isNaN(bet) || bet < 1) {
        return {
            valid: false,
            message: 'Please enter a valid bet amount!'
        };
    }

    if (bet > balance) {
        return {
            valid: false,
            message: 'Not enough money for that bet!'
        };
    }

    return {
        valid: true
    };
}

// Money formatting
function formatMoney(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}
