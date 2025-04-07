class RouletteGame {
    constructor() {
        this.bets = [];
        this.playerMoney = getBalance();
        this.numbers = Array.from({ length: 37 }, (_, i) => i); // 0-36
        this.betTypes = {
            'red': [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36],
            'black': [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35],
            'even': Array.from({ length: 18 }, (_, i) => (i + 1) * 2),
            'odd': Array.from({ length: 18 }, (_, i) => (i * 2) + 1),
            '1-18': Array.from({ length: 18 }, (_, i) => i + 1),
            '19-36': Array.from({ length: 18 }, (_, i) => i + 19)
        };
    }

    getNumberColor(number) {
        if (number === 0) return '#008000'; // Green for 0
        if (this.betTypes.red.includes(number)) return '#8b0000'; // Red
        return '#000000'; // Black
    }

    placeBet(type, amount, value) {
        const validation = validateBet(amount, this.playerMoney);
        if (!validation.valid) {
            return {
                success: false,
                message: validation.message
            };
        }

        this.playerMoney -= amount;
        this.bets.push({ type, amount, value });

        return {
            success: true,
            balance: this.playerMoney
        };
    }

    spin() {
        if (this.bets.length === 0) {
            return {
                success: false,
                message: 'Place at least one bet first!'
            };
        }

        const number = Math.floor(Math.random() * 37);
        let totalWinnings = 0;

        // Process each bet
        this.bets.forEach(bet => {
            let won = false;
            let multiplier = 0;

            switch (bet.type) {
                case 'red':
                    won = this.betTypes.red.includes(number);
                    multiplier = 2;
                    break;
                case 'black':
                    won = this.betTypes.black.includes(number);
                    multiplier = 2;
                    break;
                case 'green':
                    won = number === 0;
                    multiplier = 35;
                    break;
                case 'even':
                    won = number !== 0 && number % 2 === 0;
                    multiplier = 2;
                    break;
                case 'odd':
                    won = number % 2 === 1;
                    multiplier = 2;
                    break;
                case '1-18':
                    won = number >= 1 && number <= 18;
                    multiplier = 2;
                    break;
                case '19-36':
                    won = number >= 19 && number <= 36;
                    multiplier = 2;
                    break;
                case 'number':
                    won = number === parseInt(bet.value);
                    multiplier = 35;
                    break;
            }

            if (won) {
                totalWinnings += bet.amount * multiplier;
            }
        });

        this.playerMoney += totalWinnings;
        setBalance(this.playerMoney);
        this.bets = []; // Clear all bets

        return {
            success: true,
            number,
            color: this.getNumberColor(number),
            winnings: totalWinnings,
            balance: this.playerMoney
        };
    }
}
