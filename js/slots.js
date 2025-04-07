class SlotMachine {
    constructor() {
        this.symbols = ['🍒', '🍋', '🍊', '💎', '7️⃣', '🌟'];
        this.payouts = {
            '🍒': 2,  // Cherry pays 2x
            '🍋': 3,  // Lemon pays 3x
            '🍊': 4,  // Orange pays 4x
            '💎': 10, // Diamond pays 10x
            '7️⃣': 15, // Seven pays 15x
            '🌟': 20  // Star pays 20x
        };
        this.reels = [[], [], []];
        this.playerMoney = 1000;
        this.initializeReels();
    }

    initializeReels() {
        for (let reel of this.reels) {
            reel.push(...Array(4).fill(this.symbols).flat());
            this.shuffleReel(reel);
        }
    }

    shuffleReel(reel) {
        for (let i = reel.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [reel[i], reel[j]] = [reel[j], reel[i]];
        }
    }

    spin(bet) {
        if (bet > this.playerMoney) {
            return {
                success: false,
                message: "Not enough money for that bet!"
            };
        }
        
        this.playerMoney -= bet;
        const result = [];
        
        // Get random symbols for each reel
        for (let reel of this.reels) {
            const idx = Math.floor(Math.random() * reel.length);
            result.push(reel[idx]);
        }
        
        const winnings = this.calculateWinnings(result, bet);
        this.playerMoney += winnings;
        
        return {
            success: true,
            result,
            winnings,
            balance: this.playerMoney
        };
    }

    calculateWinnings(result, bet) {
        // Check for three of a kind
        if (new Set(result).size === 1) {
            return bet * this.payouts[result[0]];
        }
        
        // Check for pairs
        for (let symbol of new Set(result)) {
            if (result.filter(s => s === symbol).length === 2) {
                return bet * Math.floor(this.payouts[symbol] / 2);
            }
        }
        
        return 0;
    }
}
