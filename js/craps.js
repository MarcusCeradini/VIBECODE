class CrapsGame {
    constructor() {
        this.playerMoney = getBalance();
        this.point = null;
        this.bets = [];
        this.diceValues = [1, 1];
    }

    rollDie() {
        return Math.floor(Math.random() * 6) + 1;
    }

    placeBet(amount) {
        const validation = validateBet(amount, this.playerMoney);
        if (!validation.valid) {
            return {
                success: false,
                message: validation.message
            };
        }

        this.currentBet = amount;
        this.playerMoney -= amount;

        return {
            success: true,
            balance: this.playerMoney
        };
    }

    play() {
        if (!this.currentBet) {
            return {
                success: false,
                message: 'Please place a bet first!'
            };
        }

        // Roll the dice
        const die1 = this.rollDie();
        const die2 = this.rollDie();
        const sum = die1 + die2;

        let status, winnings = 0;

        if (!this.point) {
            // Come out roll
            if (sum === 7 || sum === 11) {
                status = 'win';
                winnings = this.currentBet * 2;
                this.playerMoney += winnings;
                this.currentBet = 0;
            } else if (sum === 2 || sum === 3 || sum === 12) {
                status = 'lose';
                this.currentBet = 0;
            } else {
                status = 'point';
                this.point = sum;
            }
        } else {
            // Point is established
            if (sum === this.point) {
                status = 'win';
                winnings = this.currentBet * 2;
                this.playerMoney += winnings;
                this.point = null;
                this.currentBet = 0;
            } else if (sum === 7) {
                status = 'lose';
                this.point = null;
                this.currentBet = 0;
            } else {
                status = 'continue';
            }
        }

        return {
            success: true,
            dice: { die1, die2 },
            sum,
            point: this.point,
            status,
            winnings,
            balance: this.playerMoney
        };
    }
}
