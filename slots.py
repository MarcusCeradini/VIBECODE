import random
from colorama import Fore, Style, init
from art import text2art

# Initialize colorama
init()

class SlotMachine:
    def __init__(self):
        self.symbols = ['🍒', '🍋', '🍊', '💎', '7️⃣', '🌟']
        self.payouts = {
            '🍒': 2,  # Cherry pays 2x
            '🍋': 3,  # Lemon pays 3x
            '🍊': 4,  # Orange pays 4x
            '💎': 10, # Diamond pays 10x
            '7️⃣': 15, # Seven pays 15x
            '🌟': 20  # Star pays 20x
        }
        self.reels = [[], [], []]
        self.player_money = 1000
        self._initialize_reels()

    def _initialize_reels(self):
        for reel in self.reels:
            reel.extend(self.symbols * 4)  # Each symbol appears 4 times in each reel
            random.shuffle(reel)

    def display_title(self):
        title = text2art("SLOTS", font="block")
        print(Fore.YELLOW + title + Style.RESET_ALL)
        print(f"Current Balance: ${self.player_money}")
        print("\nSymbol Payouts:")
        for symbol, payout in self.payouts.items():
            print(f"{symbol}: {payout}x")
        print()

    def spin(self, bet):
        if bet > self.player_money:
            print(Fore.RED + "Not enough money for that bet!" + Style.RESET_ALL)
            return False
        
        self.player_money -= bet
        result = []
        
        # Get random symbols for each reel
        for reel in self.reels:
            idx = random.randint(0, len(reel) - 1)
            result.append(reel[idx])
        
        self._display_spin(result)
        winnings = self._calculate_winnings(result, bet)
        self.player_money += winnings
        
        if winnings > 0:
            print(Fore.GREEN + f"You won ${winnings}!" + Style.RESET_ALL)
        else:
            print(Fore.RED + "No win this time!" + Style.RESET_ALL)
        
        print(f"Current Balance: ${self.player_money}")
        return True

    def _display_spin(self, result):
        print("\n" + "="*20)
        print(f"| {' | '.join(result)} |")
        print("="*20 + "\n")

    def _calculate_winnings(self, result, bet):
        # Check for three of a kind
        if len(set(result)) == 1:
            return bet * self.payouts[result[0]]
        
        # Check for pairs
        for symbol in set(result):
            if result.count(symbol) == 2:
                return bet * (self.payouts[symbol] // 2)
        
        return 0

def play_slots():
    slot_machine = SlotMachine()
    
    while True:
        slot_machine.display_title()
        
        if slot_machine.player_money <= 0:
            print(Fore.RED + "You're out of money! Game Over!" + Style.RESET_ALL)
            break
            
        try:
            choice = input("Enter bet amount (or 'q' to quit): ").lower()
            if choice == 'q':
                break
                
            bet = int(choice)
            if bet <= 0:
                print(Fore.RED + "Bet must be greater than 0!" + Style.RESET_ALL)
                continue
                
            slot_machine.spin(bet)
            
            input("\nPress Enter to continue...")
            print("\n" * 2)
            
        except ValueError:
            print(Fore.RED + "Please enter a valid number!" + Style.RESET_ALL)

if __name__ == "__main__":
    play_slots()
