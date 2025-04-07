import pygame
import sys
import os
import blackjack
import roulette
import craps
import slots

# Initialize Pygame
pygame.init()

# Constants
WINDOW_WIDTH = 1024
WINDOW_HEIGHT = 768
BUTTON_WIDTH = 200
BUTTON_HEIGHT = 150
BUTTON_MARGIN = 30
GOLD = (255, 215, 0)
RED = (150, 0, 0)
WHITE = (255, 255, 255)

class CasinoButton:
    def __init__(self, x, y, width, height, text, image_name=None):
        self.rect = pygame.Rect(x, y, width, height)
        self.text = text
        self.color = RED
        self.hover_color = (200, 0, 0)
        self.is_hovered = False
        self.image = None
        if image_name:
            try:
                image_path = os.path.join('assets', image_name)
                self.image = pygame.image.load(image_path)
                self.image = pygame.transform.scale(self.image, (width - 20, height - 40))
            except:
                print(f"Could not load image: {image_name}")

    def draw(self, screen):
        # Draw button background
        color = self.hover_color if self.is_hovered else self.color
        pygame.draw.rect(screen, color, self.rect)
        pygame.draw.rect(screen, GOLD, self.rect, 3)  # Gold border

        # Draw image if available
        if self.image:
            image_rect = self.image.get_rect(center=self.rect.center)
            screen.blit(self.image, image_rect)

        # Draw text
        font = pygame.font.Font(None, 36)
        text_surface = font.render(self.text, True, GOLD)
        text_rect = text_surface.get_rect(center=self.rect.center)
        if self.image:
            text_rect.centery = self.rect.bottom - 20
        screen.blit(text_surface, text_rect)

    def handle_event(self, event):
        if event.type == pygame.MOUSEMOTION:
            self.is_hovered = self.rect.collidepoint(event.pos)
        elif event.type == pygame.MOUSEBUTTONDOWN:
            if self.is_hovered:
                return True
        return False

class Casino:
    def __init__(self):
        self.screen = pygame.display.set_mode((WINDOW_WIDTH, WINDOW_HEIGHT))
        pygame.display.set_caption("VIBEZZZZZZ Casino")
        
        # Create assets directory if it doesn't exist
        if not os.path.exists('assets'):
            os.makedirs('assets')
        
        # Calculate button positions
        center_x = WINDOW_WIDTH // 2
        center_y = WINDOW_HEIGHT // 2
        offset_x = (BUTTON_WIDTH + BUTTON_MARGIN) // 2
        offset_y = (BUTTON_HEIGHT + BUTTON_MARGIN) // 2

        # Create buttons
        self.buttons = [
            CasinoButton(center_x - offset_x - BUTTON_WIDTH, center_y - offset_y - BUTTON_HEIGHT, 
                        BUTTON_WIDTH, BUTTON_HEIGHT, "Blackjack", "blackjack.png"),
            CasinoButton(center_x + offset_x, center_y - offset_y - BUTTON_HEIGHT,
                        BUTTON_WIDTH, BUTTON_HEIGHT, "Roulette", "roulette.png"),
            CasinoButton(center_x - offset_x - BUTTON_WIDTH, center_y + offset_y,
                        BUTTON_WIDTH, BUTTON_HEIGHT, "Craps", "craps.png"),
            CasinoButton(center_x + offset_x, center_y + offset_y,
                        BUTTON_WIDTH, BUTTON_HEIGHT, "Slots", "slots.png")
        ]
        
        # Background
        self.background = pygame.Surface(self.screen.get_size())
        self.background = self.background.convert()
        self.background.fill((0, 100, 0))  # Dark green casino felt color

    def run(self):
        clock = pygame.time.Clock()
        running = True
        
        while running:
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    running = False
                    pygame.quit()
                    sys.exit()
                
                for i, button in enumerate(self.buttons):
                    if button.handle_event(event):
                        # Launch the corresponding game
                        pygame.display.iconify()  # Minimize window
                        if i == 0:
                            blackjack.play_blackjack()
                        elif i == 1:
                            roulette.play_roulette()
                        elif i == 2:
                            craps.play_craps()
                        elif i == 3:
                            slots.play_slots()
                        pygame.display.flip()  # Restore window

            # Draw
            self.screen.blit(self.background, (0, 0))
            
            # Draw title
            font = pygame.font.Font(None, 72)
            title = font.render("VIBEZZZZZZ CASINO", True, GOLD)
            title_rect = title.get_rect(center=(WINDOW_WIDTH//2, 100))
            self.screen.blit(title, title_rect)
            
            # Draw buttons
            for button in self.buttons:
                button.draw(self.screen)
            
            pygame.display.flip()
            clock.tick(60)

def main():
    casino = Casino()
    casino.run()

if __name__ == "__main__":
    main()
