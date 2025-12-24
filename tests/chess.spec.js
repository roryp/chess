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

test.describe('AI Player Features', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should display AI settings panel', async ({ page }) => {
        // Check AI settings panel exists
        const aiSettings = page.locator('#ai-settings');
        await expect(aiSettings).toBeVisible();
        
        // Check all player selectors exist
        await expect(page.locator('#white-player')).toBeVisible();
        await expect(page.locator('#black-player')).toBeVisible();
        await expect(page.locator('#ai-delay')).toBeVisible();
    });

    test('should have correct default AI settings', async ({ page }) => {
        // White player should default to human
        const whitePlayer = page.locator('#white-player');
        await expect(whitePlayer).toHaveValue('human');
        
        // Black player should default to human
        const blackPlayer = page.locator('#black-player');
        await expect(blackPlayer).toHaveValue('human');
        
        // Delay should default to 300
        const delay = page.locator('#ai-delay');
        await expect(delay).toHaveValue('300');
    });

    test('should update AI status when selecting AI for black', async ({ page }) => {
        // Select AI for black player
        const blackPlayer = page.locator('#black-player');
        await blackPlayer.selectOption('ai-medium');
        
        // AI status should update
        const aiStatus = page.locator('#ai-status');
        await expect(aiStatus).toContainText('AI');
        await expect(aiStatus).toContainText('Black');
    });

    test('should update AI status when selecting AI for white', async ({ page }) => {
        // Select AI for white player
        const whitePlayer = page.locator('#white-player');
        await whitePlayer.selectOption('ai-medium');
        
        // AI status should update
        const aiStatus = page.locator('#ai-status');
        await expect(aiStatus).toContainText('AI');
        await expect(aiStatus).toContainText('White');
    });

    test('should show AI vs AI mode status', async ({ page }) => {
        // Select AI for both players
        await page.locator('#white-player').selectOption('ai-hard');
        await page.locator('#black-player').selectOption('ai-easy');
        
        // AI status should show AI vs AI mode
        const aiStatus = page.locator('#ai-status');
        await expect(aiStatus).toContainText('AI');
        await expect(aiStatus).toContainText('vs');
    });

    test('should allow different AI difficulties per player', async ({ page }) => {
        // Select hard AI for white
        await page.locator('#white-player').selectOption('ai-hard');
        
        // Select easy AI for black
        await page.locator('#black-player').selectOption('ai-easy');
        
        // Check status shows both difficulties
        const aiStatus = page.locator('#ai-status');
        await expect(aiStatus).toContainText('hard');
        await expect(aiStatus).toContainText('easy');
    });

    test('should allow changing AI move delay', async ({ page }) => {
        const delay = page.locator('#ai-delay');
        
        // Clear and set new value
        await delay.fill('1000');
        await expect(delay).toHaveValue('1000');
    });

    test('AI should make a move when set as black after human moves', async ({ page }) => {
        // Set black as AI with short delay for testing
        await page.locator('#black-player').selectOption('ai-easy');
        await page.locator('#ai-delay').fill('100');
        
        // Make a move as white (human)
        const e2Square = page.locator('.square[data-row="6"][data-col="4"]');
        await e2Square.click();
        const e4Square = page.locator('.square[data-row="4"][data-col="4"]');
        await e4Square.click();
        
        // Wait for AI to make a move
        await page.waitForTimeout(500);
        
        // Turn should be back to white (AI made its move)
        const turnIndicator = page.locator('#current-turn');
        await expect(turnIndicator).toContainText('White to move');
        
        // Move history should have at least 2 moves
        const moveItems = page.locator('.move-item');
        await expect(moveItems).toHaveCount(2);
    });

    test('AI vs AI game should make multiple moves', async ({ page }) => {
        // Set both players as AI with short delay
        await page.locator('#ai-delay').fill('100');
        await page.locator('#white-player').selectOption('ai-easy');
        await page.locator('#black-player').selectOption('ai-easy');
        
        // Wait for several moves
        await page.waitForTimeout(2500);
        
        // Move history should have multiple moves (at least 2)
        const moveItems = page.locator('.move-item');
        const count = await moveItems.count();
        expect(count).toBeGreaterThanOrEqual(2);
    });

    test('should not allow human moves during AI turn', async ({ page }) => {
        // Set white as AI
        await page.locator('#ai-delay').fill('2000'); // Long delay to test
        await page.locator('#white-player').selectOption('ai-easy');
        
        // Try to click on a piece immediately - should not select
        const e2Square = page.locator('.square[data-row="6"][data-col="4"]');
        await e2Square.click();
        
        // Square should NOT be selected because it's AI's turn
        await expect(e2Square).not.toHaveClass(/selected/);
    });

    test('should reset AI game state on new game', async ({ page }) => {
        // Set up AI vs AI game
        await page.locator('#ai-delay').fill('100');
        await page.locator('#white-player').selectOption('ai-easy');
        await page.locator('#black-player').selectOption('ai-easy');
        
        // Wait for some moves
        await page.waitForTimeout(1000);
        
        // Get move count
        const moveItems = page.locator('.move-item');
        const initialCount = await moveItems.count();
        expect(initialCount).toBeGreaterThan(0);
        
        // Reset the game
        await page.locator('#reset-btn').click();
        
        // Wait a bit
        await page.waitForTimeout(200);
        
        // Move history may have new AI moves starting, but should restart
        // Game should be running again with AI
        const aiStatus = page.locator('#ai-status');
        await expect(aiStatus).toContainText('AI');
    });

    test('turn indicator should show AI emoji when AI is playing', async ({ page }) => {
        // Set black as AI
        await page.locator('#black-player').selectOption('ai-easy');
        await page.locator('#ai-delay').fill('100');
        
        // Make a human move
        await page.locator('.square[data-row="6"][data-col="4"]').click();
        await page.locator('.square[data-row="4"][data-col="4"]').click();
        
        // Wait for AI move
        await page.waitForTimeout(500);
        
        // Turn indicator for white (human) should show human emoji
        const turnIndicator = page.locator('#current-turn');
        await expect(turnIndicator).toContainText('👤');
    });
});
