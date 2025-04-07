import random
from colorama import Fore, Style

class Card:
    def __init__(self, suit, value):
        self.suit = suit
        self.value = value

    def __str__(self):
        return f"{self.value}{self.suit}"

class Blackjack:
    def __init__(self):
        self.suits = ['♠', '♥', '♦', '♣']
        self.values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']

    def create_deck(self):
        return [Card(suit, value) for suit in self.suits for value in self.values]

    def calculate_hand(self, hand):
        value = 0
        aces = 0
        
        for card in hand:
            if card.value in ['J', 'Q', 'K']:
                value += 10
            elif card.value == 'A':
                aces += 1
            else:
                value += int(card.value)
                
        for _ in range(aces):
            if value + 11 <= 21:
                value += 11
            else:
                value += 1
                
        return value

    def display_hand(self, hand, hide_first=False):
        cards = []
        for i, card in enumerate(hand):
            if i == 0 and hide_first:
                cards.append('🂠')
            else:
                cards.append(str(card))
        return ' '.join(cards)

    def play(self, balance):
        while True:
            print(f"\nYour balance: ${balance}")
            bet = input("Enter your bet (or 'q' to quit): ")
            
            if bet.lower() == 'q':
                return balance
                
            try:
                bet = int(bet)
                if bet <= 0 or bet > balance:
                    print("Invalid bet amount!")
                    continue
                    
                deck = self.create_deck()
                random.shuffle(deck)
                
                player_hand = [deck.pop(), deck.pop()]
                dealer_hand = [deck.pop(), deck.pop()]
                
                balance -= bet
                
                # Game loop
                while True:
                    print("\nDealer's hand:", self.display_hand(dealer_hand, hide_first=True))
                    print("Your hand:", self.display_hand(player_hand))
                    player_value = self.calculate_hand(player_hand)
                    
                    if player_value == 21:
                        print(f"{Fore.GREEN}Blackjack! You win!{Style.RESET_ALL}")
                        balance += bet * 2.5
                        break
                    elif player_value > 21:
                        print(f"{Fore.RED}Bust! You lose!{Style.RESET_ALL}")
                        break
                        
                    action = input("\nDo you want to (H)it or (S)tand? ").lower()
                    
                    if action == 'h':
                        player_hand.append(deck.pop())
                    elif action == 's':
                        # Dealer's turn
                        print("\nDealer's turn:")
                        print("Dealer's hand:", self.display_hand(dealer_hand))
                        
                        while self.calculate_hand(dealer_hand) < 17:
                            dealer_hand.append(deck.pop())
                            print("Dealer hits:", self.display_hand(dealer_hand))
                            
                        dealer_value = self.calculate_hand(dealer_hand)
                        
                        if dealer_value > 21:
                            print(f"{Fore.GREEN}Dealer busts! You win!{Style.RESET_ALL}")
                            balance += bet * 2
                        elif dealer_value < player_value:
                            print(f"{Fore.GREEN}You win!{Style.RESET_ALL}")
                            balance += bet * 2
                        elif dealer_value > player_value:
                            print(f"{Fore.RED}Dealer wins!{Style.RESET_ALL}")
                        else:
                            print(f"{Fore.YELLOW}Push! Bet returned.{Style.RESET_ALL}")
                            balance += bet
                        break
                        
            except ValueError:
                print("Please enter a valid number!")
                
        return balance
