class RouletteGame {
    constructor() {
        this.playerMoney = 1000;
        this.numbers = Array.from({length: 37}, (_, i) => i); // 0-36
        this.colors = {
            0: 'green',
            ...Object.fromEntries([
                1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36
            ].map(n => [n, 'red'])),
            ...Object.fromEntries([
                2,4,6,8,10,11,13,15,17,20,22,24,26,28,29,31,33,35
            ].map(n => [n, 'black']))
        };
        this.bets = [];
    }

    placeBet(type, amount, value = null) {
        if (amount > this.playerMoney) {
            return {
                success: false,
                message: "Not enough money for that bet!"
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
        const result = Math.floor(Math.random() * 37);
        const color = this.colors[result];
        let winnings = 0;

        for (const bet of this.bets) {
            switch (bet.type) {
                case 'number':
                    if (bet.value === result) {
                        winnings += bet.amount * 35;
                    }
                    break;
                case 'color':
                    if (bet.value === color) {
                        winnings += bet.amount * 2;
                    }
                    break;
                case 'even':
                    if (result !== 0 && result % 2 === 0) {
                        winnings += bet.amount * 2;
                    }
                    break;
                case 'odd':
                    if (result !== 0 && result % 2 === 1) {
                        winnings += bet.amount * 2;
                    }
                    break;
                case '1-18':
                    if (result >= 1 && result <= 18) {
                        winnings += bet.amount * 2;
                    }
                    break;
                case '19-36':
                    if (result >= 19 && result <= 36) {
                        winnings += bet.amount * 2;
                    }
                    break;
            }
        }

        this.playerMoney += winnings;
        this.bets = [];

        return {
            number: result,
            color: color,
            winnings: winnings,
            balance: this.playerMoney
        };
    }
}
