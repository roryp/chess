// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Chess Game', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should display the chess board with all pieces', async ({ page }) => {
        // Check title
        await expect(page.locator('h1')).toContainText('Chess Game');
        
        // Check board exists
        const board = page.locator('#chess-board');
        await expect(board).toBeVisible();
        
        // Check all 64 squares are rendered
        const squares = page.locator('.square');
        await expect(squares).toHaveCount(64);
        
        // Check pieces are present (32 pieces at start)
        const pieces = page.locator('.piece');
        await expect(pieces).toHaveCount(32);
    });

    test('should show correct turn indicator', async ({ page }) => {
        const turnIndicator = page.locator('#current-turn');
        await expect(turnIndicator).toContainText('White to move');
    });

    test('should allow selecting a white pawn on first move', async ({ page }) => {
        // Click on e2 pawn (row 6, col 4)
        const e2Square = page.locator('.square[data-row="6"][data-col="4"]');
        await e2Square.click();
        
        // Square should be selected
        await expect(e2Square).toHaveClass(/selected/);
    });

    test('should move pawn from e2 to e4', async ({ page }) => {
        // Click on e2 pawn
        const e2Square = page.locator('.square[data-row="6"][data-col="4"]');
        await e2Square.click();
        
        // Click on e4 square
        const e4Square = page.locator('.square[data-row="4"][data-col="4"]');
        await e4Square.click();
        
        // Pawn should now be on e4
        const pawnOnE4 = page.locator('.square[data-row="4"][data-col="4"] .piece');
        await expect(pawnOnE4).toBeVisible();
        
        // Turn should switch to black
        const turnIndicator = page.locator('#current-turn');
        await expect(turnIndicator).toContainText('Black to move');
        
        // Move should appear in history
        const moveHistory = page.locator('#move-list');
        await expect(moveHistory).toContainText('e2e4');
    });

    test('should flip the board', async ({ page }) => {
        const flipBtn = page.locator('#flip-btn');
        await flipBtn.click();
        
        // After flip, the first square should have data-row="7" (was 0)
        const firstSquare = page.locator('.square').first();
        await expect(firstSquare).toHaveAttribute('data-row', '7');
    });

    test('should reset the game', async ({ page }) => {
        // Make a move first
        const e2Square = page.locator('.square[data-row="6"][data-col="4"]');
        await e2Square.click();
        const e4Square = page.locator('.square[data-row="4"][data-col="4"]');
        await e4Square.click();
        
        // Verify move was made
        await expect(page.locator('#current-turn')).toContainText('Black to move');
        
        // Click reset
        const resetBtn = page.locator('#reset-btn');
        await resetBtn.click();
        
        // Turn should be back to white
        await expect(page.locator('#current-turn')).toContainText('White to move');
        
        // Move history should be empty
        const moveItems = page.locator('.move-item');
        await expect(moveItems).toHaveCount(0);
    });

    test('should have famous games selector', async ({ page }) => {
        const famousGamesSelect = page.locator('#famous-games-select');
        await expect(famousGamesSelect).toBeVisible();
        
        // Check it has options
        const options = page.locator('#famous-games-select option');
        await expect(options).toHaveCount(6); // 1 default + 5 games
    });

    test('should load a famous game', async ({ page }) => {
        // Select "The Immortal Game"
        const select = page.locator('#famous-games-select');
        await select.selectOption({ index: 1 });
        
        // Click load game
        const loadBtn = page.locator('#load-game-btn');
        await loadBtn.click();
        
        // Famous game info panel should appear
        const infoPanel = page.locator('#famous-game-info');
        await expect(infoPanel).toBeVisible();
        await expect(infoPanel).toContainText('The Immortal Game');
        await expect(infoPanel).toContainText('Anderssen vs Kieseritzky');
    });

    test('should not allow illegal pawn move', async ({ page }) => {
        // Click on e2 pawn
        const e2Square = page.locator('.square[data-row="6"][data-col="4"]');
        await e2Square.click();
        
        // Try to move to e5 (illegal - 3 squares)
        const e5Square = page.locator('.square[data-row="3"][data-col="4"]');
        await e5Square.click();
        
        // Pawn should still be on e2
        const pawnOnE2 = page.locator('.square[data-row="6"][data-col="4"] .piece');
        await expect(pawnOnE2).toBeVisible();
        
        // Turn should still be white
        await expect(page.locator('#current-turn')).toContainText('White to move');
    });

    test('should allow knight to move in L-shape', async ({ page }) => {
        // Click on g1 knight (row 7, col 6)
        const g1Square = page.locator('.square[data-row="7"][data-col="6"]');
        await g1Square.click();
        
        // Move to f3 (row 5, col 5)
        const f3Square = page.locator('.square[data-row="5"][data-col="5"]');
        await f3Square.click();
        
        // Knight should now be on f3
        const knightOnF3 = page.locator('.square[data-row="5"][data-col="5"] .piece');
        await expect(knightOnF3).toBeVisible();
        await expect(knightOnF3).toHaveText('♘');
    });
});
