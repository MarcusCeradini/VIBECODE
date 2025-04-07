import random
import time
from colorama import Fore, Style

class Roulette:
    def __init__(self):
        self.numbers = list(range(37))  # 0-36
        self.red_numbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]
        self.black_numbers = [num for num in range(1, 37) if num not in self.red_numbers]

    def get_color(self, number):
        if number == 0:
            return 'green'
        return 'red' if number in self.red_numbers else 'black'

    def display_board(self):
        print("\nRoulette Board:")
        print("0 (Green)")
        print("Red numbers:", sorted(self.red_numbers))
        print("Black numbers:", sorted(self.black_numbers))
        print("\nBet types:")
        print("1. Single number (35:1)")
        print("2. Red/Black (1:1)")
        print("3. Odd/Even (1:1)")
        print("4. 1-18/19-36 (1:1)")

    def play(self, balance):
        while True:
            print(f"\nYour balance: ${balance}")
            self.display_board()
            
            bet = input("\nEnter your bet amount (or 'q' to quit): ")
            if bet.lower() == 'q':
                return balance
                
            try:
                bet = int(bet)
                if bet <= 0 or bet > balance:
                    print("Invalid bet amount!")
                    continue
                    
                bet_type = input("""
Choose your bet type:
1. Single number
2. Red/Black
3. Odd/Even
4. 1-18/19-36
Enter (1-4): """)
                
                if bet_type not in ['1', '2', '3', '4']:
                    print("Invalid bet type!")
                    continue
                    
                # Get specific bet details
                if bet_type == '1':
                    number = input("Enter a number (0-36): ")
                    try:
                        number = int(number)
                        if number not in range(37):
                            print("Invalid number!")
                            continue
                    except ValueError:
                        print("Invalid input!")
                        continue
                elif bet_type == '2':
                    color = input("Choose Red (R) or Black (B): ").upper()
                    if color not in ['R', 'B']:
                        print("Invalid choice!")
                        continue
                elif bet_type == '3':
                    choice = input("Choose Odd (O) or Even (E): ").upper()
                    if choice not in ['O', 'E']:
                        print("Invalid choice!")
                        continue
                elif bet_type == '4':
                    choice = input("Choose 1-18 (L) or 19-36 (H): ").upper()
                    if choice not in ['L', 'H']:
                        print("Invalid choice!")
                        continue
                
                # Spin the wheel
                balance -= bet
                print("\nSpinning the wheel", end="")
                for _ in range(3):
                    print(".", end="", flush=True)
                    time.sleep(0.5)
                
                result = random.choice(self.numbers)
                result_color = self.get_color(result)
                
                print(f"\nThe ball landed on: {result} ({result_color})")
                
                # Check win conditions
                won = False
                if bet_type == '1':
                    if result == number:
                        balance += bet * 36
                        won = True
                elif bet_type == '2':
                    if (color == 'R' and result in self.red_numbers) or \
                       (color == 'B' and result in self.black_numbers):
                        balance += bet * 2
                        won = True
                elif bet_type == '3':
                    if (choice == 'O' and result % 2 == 1) or \
                       (choice == 'E' and result % 2 == 0 and result != 0):
                        balance += bet * 2
                        won = True
                elif bet_type == '4':
                    if (choice == 'L' and 1 <= result <= 18) or \
                       (choice == 'H' and 19 <= result <= 36):
                        balance += bet * 2
                        won = True
                
                if won:
                    print(f"{Fore.GREEN}Congratulations! You won!{Style.RESET_ALL}")
                else:
                    print(f"{Fore.RED}Sorry, you lost!{Style.RESET_ALL}")
                    
            except ValueError:
                print("Please enter a valid number!")
                
        return balance
