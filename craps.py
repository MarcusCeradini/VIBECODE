import random
import time
from colorama import Fore, Style

class Craps:
    def __init__(self):
        self.point = None
        self.phase = 'come-out'  # 'come-out' or 'point'

    def roll_dice(self):
        return random.randint(1, 6), random.randint(1, 6)

    def display_roll(self, dice):
        print(f"\nRolling the dice", end="")
        for _ in range(3):
            print(".", end="", flush=True)
            time.sleep(0.5)
        print(f"\nYou rolled: {dice[0]} + {dice[1]} = {sum(dice)}")

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
                    
                balance -= bet
                self.phase = 'come-out'
                self.point = None
                
                while True:
                    input("\nPress Enter to roll the dice...")
                    dice = self.roll_dice()
                    self.display_roll(dice)
                    total = sum(dice)
                    
                    if self.phase == 'come-out':
                        if total in [7, 11]:
                            print(f"{Fore.GREEN}Natural! You win!{Style.RESET_ALL}")
                            balance += bet * 2
                            break
                        elif total in [2, 3, 12]:
                            print(f"{Fore.RED}Craps! You lose!{Style.RESET_ALL}")
                            break
                        else:
                            self.point = total
                            self.phase = 'point'
                            print(f"Point is {self.point}")
                    else:  # point phase
                        if total == self.point:
                            print(f"{Fore.GREEN}Made the point! You win!{Style.RESET_ALL}")
                            balance += bet * 2
                            break
                        elif total == 7:
                            print(f"{Fore.RED}Seven out! You lose!{Style.RESET_ALL}")
                            break
                        else:
                            print("Roll again!")
                            
            except ValueError:
                print("Please enter a valid number!")
                
        return balance
