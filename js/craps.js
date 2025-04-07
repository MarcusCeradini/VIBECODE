class CrapsGame {
    constructor() {
        this.playerMoney = getBalance();
        this.point = null;
        this.bets = {
            passLine: 0,
            dontPass: 0,
            come: 0,
            dontCome: 0,
            field: 0,
            place: { 4: 0, 5: 0, 6: 0, 8: 0, 9: 0, 10: 0 },
            hardways: { 4: 0, 6: 0, 8: 0, 10: 0 }
        };
        this.comePoint = null;
        this.diceValues = [1, 1];
    }

    rollDie() {
        return Math.floor(Math.random() * 6) + 1;
    }

    placeBet(type, amount, number = null) {
        const validation = validateBet(amount, this.playerMoney);
        if (!validation.valid) {
            return {
                success: false,
                message: validation.message
            };
        }

        // Deduct bet from player's money
        this.playerMoney -= amount;
        setBalance(this.playerMoney);

        // Place the bet
        switch(type) {
            case 'passLine':
                this.bets.passLine += amount;
                break;
            case 'dontPass':
                this.bets.dontPass += amount;
                break;
            case 'come':
                this.bets.come += amount;
                break;
            case 'dontCome':
                this.bets.dontCome += amount;
                break;
            case 'field':
                this.bets.field += amount;
                break;
            case 'place':
                if (number in this.bets.place) {
                    this.bets.place[number] += amount;
                }
                break;
            case 'hardways':
                if (number in this.bets.hardways) {
                    this.bets.hardways[number] += amount;
                }
                break;
        }

        return {
            success: true,
            balance: this.playerMoney,
            bets: this.bets
        };
    }

    play() {
        // Roll the dice
        const die1 = this.rollDie();
        const die2 = this.rollDie();
        const sum = die1 + die2;
        const isHardway = die1 === die2;
        let winnings = 0;
        let messages = [];

        // Store dice values
        this.diceValues = [die1, die2];

        if (!this.point) {
            // Come out roll
            if (sum === 7 || sum === 11) {
                // Pass line wins, don't pass loses
                winnings += this.bets.passLine * 2;
                messages.push('Pass Line wins!');
                this.bets.passLine = 0;
                this.bets.dontPass = 0;
            } else if (sum === 2 || sum === 3) {
                // Don't pass wins, pass line loses
                winnings += this.bets.dontPass * 2;
                messages.push('Don\'t Pass wins!');
                this.bets.passLine = 0;
                this.bets.dontPass = 0;
            } else if (sum === 12) {
                // Don't pass pushes, pass line loses
                winnings += this.bets.dontPass;
                messages.push('Don\'t Pass pushes!');
                this.bets.passLine = 0;
                this.bets.dontPass = 0;
            } else {
                this.point = sum;
                messages.push(`Point is ${sum}`);
            }
        } else {
            // Point is established
            if (sum === this.point) {
                // Pass line wins, don't pass loses
                winnings += this.bets.passLine * 2;
                messages.push('Pass Line wins!');
                this.bets.passLine = 0;
                this.bets.dontPass = 0;
                this.point = null;
            } else if (sum === 7) {
                // Seven out - Don't pass wins, everything else loses
                winnings += this.bets.dontPass * 2;
                messages.push('Seven out! Don\'t Pass wins!');
                // Clear all bets except don't come which is handled separately
                this.bets.passLine = 0;
                this.bets.dontPass = 0;
                this.bets.come = 0;
                this.bets.field = 0;
                this.bets.place = { 4: 0, 5: 0, 6: 0, 8: 0, 9: 0, 10: 0 };
                this.bets.hardways = { 4: 0, 6: 0, 8: 0, 10: 0 };
                this.point = null;
            }
        }

        // Handle Come/Don't Come bets
        if (this.point) {
            if (!this.comePoint) {
                if (sum === 7 || sum === 11) {
                    winnings += this.bets.come * 2;
                    messages.push('Come bet wins!');
                    this.bets.come = 0;
                } else if (sum === 2 || sum === 3) {
                    winnings += this.bets.dontCome * 2;
                    messages.push('Don\'t Come wins!');
                    this.bets.dontCome = 0;
                } else if (sum === 12) {
                    winnings += this.bets.dontCome;
                    messages.push('Don\'t Come pushes!');
                    this.bets.dontCome = 0;
                } else {
                    this.comePoint = sum;
                    messages.push(`Come point is ${sum}`);
                }
            } else if (sum === this.comePoint) {
                winnings += this.bets.come * 2;
                messages.push('Come bet wins!');
                this.bets.come = 0;
                this.comePoint = null;
            } else if (sum === 7) {
                winnings += this.bets.dontCome * 2;
                messages.push('Don\'t Come wins!');
                this.bets.come = 0;
                this.bets.dontCome = 0;
                this.comePoint = null;
            }
        }

        // Handle Field bets
        if (sum !== 7) {  // Field bets lose on 7
            if ([2,3,4,9,10,11,12].includes(sum)) {
                let fieldMultiplier = 1;
                if (sum === 2 || sum === 12) fieldMultiplier = 2;
                winnings += this.bets.field * (1 + fieldMultiplier);
                messages.push(`Field bet wins ${fieldMultiplier}x!`);
            }
        }
        this.bets.field = 0;

        // Handle Place bets
        if (this.point && sum !== 7) {
            const placeOdds = {
                4: 9/5, 5: 7/5, 6: 7/6,
                8: 7/6, 9: 7/5, 10: 9/5
            };
            if (sum in placeOdds) {
                winnings += this.bets.place[sum] * (1 + placeOdds[sum]);
                messages.push(`Place ${sum} wins!`);
            }
        }
        if (sum === 7) {
            messages.push('All Place bets lose!');
            this.bets.place = { 4: 0, 5: 0, 6: 0, 8: 0, 9: 0, 10: 0 };
        }

        // Handle Hardways bets
        if (isHardway && [4,6,8,10].includes(sum)) {
            const hardwayOdds = { 4: 7, 6: 9, 8: 9, 10: 7 };
            winnings += this.bets.hardways[sum] * (1 + hardwayOdds[sum]);
            messages.push(`Hardway ${sum} wins!`);
        } else if (sum === 7 || (sum in this.bets.hardways && !isHardway)) {
            this.bets.hardways = { 4: 0, 6: 0, 8: 0, 10: 0 };
            if (sum === 7) messages.push('All Hardways bets lose!');
            else if (!isHardway) messages.push(`Hardway ${sum} loses!`);
        }

        // Update player's money
        this.playerMoney += winnings;
        setBalance(this.playerMoney);

        return {
            success: true,
            dice: { die1, die2 },
            sum,
            point: this.point,
            comePoint: this.comePoint,
            status: this.point ? 'point' : 'come-out',
            winnings,
            messages,
            bets: this.bets,
            balance: this.playerMoney
        };
    }
}
