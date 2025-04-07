class SlotMachine {
    constructor() {
        // Symbols with their weights (higher weight = more common)
        this.symbolWeights = [
            { symbol: '🍒', weight: 35 },  // Very common
            { symbol: '🍋', weight: 25 },  // Common
            { symbol: '🍊', weight: 20 },  // Moderately common
            { symbol: '💎', weight: 12 },  // Uncommon
            { symbol: '7️⃣', weight: 6 },   // Rare
            { symbol: '🌟', weight: 2 }    // Very rare
        ];

        // Calculate total weight for random selection
        this.totalWeight = this.symbolWeights.reduce((sum, sw) => sum + sw.weight, 0);

        // Higher payouts since matching is now harder
        this.payouts = {
            '🍒': 2,    // Common symbol, low payout
            '🍋': 4,    // Common symbol, low payout
            '🍊': 8,    // Medium symbol, medium payout
            '💎': 15,   // Rare symbol, high payout
            '7️⃣': 25,   // Very rare symbol, very high payout
            '🌟': 50    // Jackpot symbol, massive payout
        };

        // Reduced pair multiplier to make it harder to win
        this.pairMultiplier = 0.3; // 30% of the symbol's payout for pairs
        this.playerMoney = getBalance();
    }

    getRandomSymbol() {
        let random = Math.floor(Math.random() * this.totalWeight);
        
        for (const sw of this.symbolWeights) {
            if (random < sw.weight) return sw.symbol;
            random -= sw.weight;
        }
        
        return this.symbolWeights[0].symbol; // Fallback to first symbol
    }

    spin(bet) {
        const validation = validateBet(bet, this.playerMoney);
        if (!validation.valid) {
            return {
                success: false,
                message: validation.message
            };
        }

        this.playerMoney -= bet;
        
        // Get random symbols using weighted distribution
        const result = Array.from({ length: 3 }, () => this.getRandomSymbol());
        
        // Calculate winnings
        let winnings = 0;
        let winType = 'none';
        
        // Check for three of a kind (highest payout)
        if (new Set(result).size === 1) {
            winnings = bet * this.payouts[result[0]];
            winType = 'three';
        }
        // Check for pairs
        else {
            for (let symbol of new Set(result)) {
                const count = result.filter(s => s === symbol).length;
                if (count === 2) {
                    // Reduced payout for pairs
                    winnings = bet * (this.payouts[symbol] * this.pairMultiplier);
                    winType = 'pair';
                    break;
                }
            }
        }
        
        // Add winnings to player's money
        this.playerMoney += winnings;
        setBalance(this.playerMoney);
        
        return {
            success: true,
            result,
            winnings,
            winType,
            balance: this.playerMoney
        };
    }
}
