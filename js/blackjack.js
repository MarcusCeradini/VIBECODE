class BlackjackGame {
    constructor() {
        this.deck = [];
        this.playerHand = [];
        this.dealerHand = [];
        this.playerMoney = 1000;
        this.currentBet = 0;
        this.suits = ['♠', '♥', '♦', '♣'];
        this.values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    }

    initializeDeck() {
        this.deck = [];
        for (let suit of this.suits) {
            for (let value of this.values) {
                this.deck.push({ suit, value });
            }
        }
        this.shuffleDeck();
    }

    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    dealCard() {
        return this.deck.pop();
    }

    calculateHand(hand) {
        let total = 0;
        let aces = 0;

        for (let card of hand) {
            if (card.value === 'A') {
                aces += 1;
            } else if (['K', 'Q', 'J'].includes(card.value)) {
                total += 10;
            } else {
                total += parseInt(card.value);
            }
        }

        for (let i = 0; i < aces; i++) {
            if (total + 11 <= 21) {
                total += 11;
            } else {
                total += 1;
            }
        }

        return total;
    }

    placeBet(amount) {
        if (amount > this.playerMoney) {
            alert("Not enough money!");
            return false;
        }
        this.currentBet = amount;
        this.playerMoney -= amount;
        return true;
    }

    startRound() {
        this.initializeDeck();
        this.playerHand = [this.dealCard(), this.dealCard()];
        this.dealerHand = [this.dealCard(), this.dealCard()];
        return {
            playerHand: this.playerHand,
            dealerHand: [this.dealerHand[0], { suit: '?', value: '?' }]
        };
    }

    hit() {
        this.playerHand.push(this.dealCard());
        const total = this.calculateHand(this.playerHand);
        if (total > 21) {
            return { bust: true, hand: this.playerHand };
        }
        return { bust: false, hand: this.playerHand };
    }

    dealerPlay() {
        while (this.calculateHand(this.dealerHand) < 17) {
            this.dealerHand.push(this.dealCard());
        }
        return this.dealerHand;
    }

    determineWinner() {
        const playerTotal = this.calculateHand(this.playerHand);
        const dealerTotal = this.calculateHand(this.dealerHand);

        if (playerTotal > 21) {
            return 'dealer';
        } else if (dealerTotal > 21) {
            this.playerMoney += this.currentBet * 2;
            return 'player';
        } else if (playerTotal > dealerTotal) {
            this.playerMoney += this.currentBet * 2;
            return 'player';
        } else if (dealerTotal > playerTotal) {
            return 'dealer';
        } else {
            this.playerMoney += this.currentBet;
            return 'push';
        }
    }
}
