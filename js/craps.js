class CrapsGame {
    constructor() {
        this.playerMoney = 1000;
        this.point = null;
        this.currentBet = 0;
    }

    rollDice() {
        return {
            die1: Math.floor(Math.random() * 6) + 1,
            die2: Math.floor(Math.random() * 6) + 1
        };
    }

    placeBet(amount) {
        if (amount > this.playerMoney) {
            return {
                success: false,
                message: "Not enough money for that bet!"
            };
        }

        this.playerMoney -= amount;
        this.currentBet = amount;
        
        return {
            success: true,
            balance: this.playerMoney
        };
    }

    play() {
        const roll = this.rollDice();
        const sum = roll.die1 + roll.die2;
        let gameStatus = '';
        let winnings = 0;

        if (this.point === null) {
            // Come out roll
            if (sum === 7 || sum === 11) {
                winnings = this.currentBet * 2;
                gameStatus = 'win';
            } else if (sum === 2 || sum === 3 || sum === 12) {
                gameStatus = 'lose';
            } else {
                this.point = sum;
                gameStatus = 'point';
            }
        } else {
            // Point is established
            if (sum === this.point) {
                winnings = this.currentBet * 2;
                gameStatus = 'win';
                this.point = null;
            } else if (sum === 7) {
                gameStatus = 'lose';
                this.point = null;
            } else {
                gameStatus = 'continue';
            }
        }

        this.playerMoney += winnings;
        
        return {
            dice: roll,
            sum: sum,
            point: this.point,
            status: gameStatus,
            winnings: winnings,
            balance: this.playerMoney
        };
    }
}
