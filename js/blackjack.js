class BlackjackGame {
    constructor() {
        this.deck = [];
        this.playerHand = [];
        this.dealerHand = [];
        this.playerMoney = getBalance();
        this.currentBet = 0;
        this.initializeDeck();
    }

    initializeDeck() {
        const suits = ['♠', '♥', '♦', '♣'];
        const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        
        this.deck = [];
        for (let suit of suits) {
            for (let value of values) {
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
        if (this.deck.length === 0) {
            this.initializeDeck();
        }
        return this.deck.pop();
    }

    calculateHandValue(hand) {
        let value = 0;
        let aces = 0;

        for (let card of hand) {
            if (card.value === 'A') {
                aces++;
            } else if (['K', 'Q', 'J'].includes(card.value)) {
                value += 10;
            } else {
                value += parseInt(card.value);
            }
        }

        // Add aces
        for (let i = 0; i < aces; i++) {
            if (value + 11 <= 21) {
                value += 11;
            } else {
                value += 1;
            }
        }

        return value;
    }

    placeBet(amount) {
        const validation = validateBet(amount, this.playerMoney);
        if (!validation.valid) {
            return {
                success: false,
                message: validation.message
            };
        }

        // Reset hands
        this.playerHand = [];
        this.dealerHand = [];
        
        this.currentBet = amount;
        this.playerMoney -= amount;
        
        // Deal initial cards
        this.playerHand = [this.dealCard(), this.dealCard()];
        this.dealerHand = [this.dealCard(), this.dealCard()];

        // Check for natural blackjack
        const playerValue = this.calculateHandValue(this.playerHand);
        const dealerValue = this.calculateHandValue(this.dealerHand);

        if (playerValue === 21 && dealerValue === 21) {
            this.playerMoney += this.currentBet; // Push on double blackjack
            setBalance(this.playerMoney);
            return {
                success: true,
                playerCards: this.playerHand,
                dealerCards: this.dealerHand,
                playerValue,
                dealerValue,
                status: 'push',
                message: 'Both have Blackjack! Push!',
                balance: this.playerMoney
            };
        } else if (playerValue === 21) {
            this.playerMoney += this.currentBet * 2.5; // Blackjack pays 3:2
            setBalance(this.playerMoney);
            return {
                success: true,
                playerCards: this.playerHand,
                dealerCards: this.dealerHand,
                playerValue,
                dealerValue,
                status: 'blackjack',
                message: 'Blackjack! You win 3:2!',
                balance: this.playerMoney
            };
        } else if (dealerValue === 21) {
            return {
                success: true,
                playerCards: this.playerHand,
                dealerCards: this.dealerHand,
                playerValue,
                dealerValue,
                status: 'lose',
                message: 'Dealer has Blackjack!',
                balance: this.playerMoney
            };
        }
        
        return {
            success: true,
            playerCards: this.playerHand,
            dealerCards: [this.dealerHand[0], { suit: '?', value: '?' }],
            playerValue,
            dealerValue: this.calculateHandValue([this.dealerHand[0]]),
            status: 'playing',
            balance: this.playerMoney
        };
    }

    hit() {
        this.playerHand.push(this.dealCard());
        const playerValue = this.calculateHandValue(this.playerHand);
        
        if (playerValue > 21) {
            return {
                playerCards: this.playerHand,
                dealerCards: this.dealerHand,
                playerValue,
                dealerValue: this.calculateHandValue(this.dealerHand),
                status: 'bust',
                message: 'Bust! You lose!',
                balance: this.playerMoney
            };
        }
        
        return {
            playerCards: this.playerHand,
            dealerCards: [this.dealerHand[0], { suit: '?', value: '?' }],
            playerValue,
            dealerValue: this.calculateHandValue([this.dealerHand[0]]),
            status: 'playing',
            balance: this.playerMoney
        };
    }

    split() {
        if (!this.canSplit) {
            return {
                success: false,
                message: 'Cannot split this hand.'
            };
        }

        // Take second card from player's hand and create split hand
        this.splitHand = [this.playerHand.pop()];
        
        // Deduct additional bet for split hand
        this.playerMoney -= this.currentBet;
        setBalance(this.playerMoney);
        
        // Deal one new card to each hand
        this.playerHand.push(this.dealCard());
        this.splitHand.push(this.dealCard());
        
        // Mark that we've split to prevent multiple splits
        this.hasSplit = true;
        this.canSplit = false;

        return {
            playerCards: this.playerHand,
            splitCards: this.splitHand,
            dealerCards: [this.dealerHand[0], { suit: '?', value: '?' }],
            playerValue: this.calculateHandValue(this.playerHand),
            splitValue: this.calculateHandValue(this.splitHand),
            dealerValue: this.calculateHandValue([this.dealerHand[0]]),
            status: 'playing',
            currentHand: 'player',
            balance: this.playerMoney
        };
    }

    stand() {
        // Dealer's turn
        while (this.calculateHandValue(this.dealerHand) < 17) {
            this.dealerHand.push(this.dealCard());
        }
        
        const playerValue = this.calculateHandValue(this.playerHand);
        const dealerValue = this.calculateHandValue(this.dealerHand);
        
        let status, message;
        if (dealerValue > 21) {
            status = 'win';
            message = 'Dealer busts! You win!';
            this.playerMoney += this.currentBet * 2;
            setBalance(this.playerMoney);
        } else if (playerValue > dealerValue) {
            status = 'win';
            message = 'You win!';
            this.playerMoney += this.currentBet * 2;
            setBalance(this.playerMoney);
        } else if (playerValue === dealerValue) {
            status = 'push';
            message = 'Push! Bet returned.';
            this.playerMoney += this.currentBet;
            setBalance(this.playerMoney);
        } else {
            status = 'lose';
            message = 'Dealer wins!';
        }
        
        return {
            playerCards: this.playerHand,
            dealerCards: this.dealerHand,
            playerValue,
            dealerValue,
            status,
            message,
            balance: this.playerMoney
        };
    }
}
