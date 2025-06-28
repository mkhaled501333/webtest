import { test, expect } from '@playwright/test';

test.describe('AR and 3D Features', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a product page
    await page.goto('/');
    
    // Wait for the page to load
    await expect(page.locator('h1')).toContainText('Discover Local Fashion');
    
    // Navigate to first product
    await page.locator('[data-testid="product-card"]').first().click();
    await page.waitForLoadState('networkidle');
  });

  test('3D viewer loads and displays controls', async ({ page }) => {
    // Click to show 3D viewer
    await page.locator('button:has-text("Show 3D View")').click();
    
    // Check if 3D viewer container appears
    await expect(page.locator('[data-testid="3d-viewer"]')).toBeVisible();
    
    // Check for 3D viewer controls
    await expect(page.locator('button:has-text("Pause")')).toBeVisible();
    await expect(page.locator('button:has-text("Hide")')).toBeVisible();
    
    // Test fullscreen toggle
    await page.locator('button[title="Toggle Fullscreen"]').click();
    await expect(page.locator('[data-testid="3d-viewer"]')).toHaveClass(/fixed/);
    
    // Exit fullscreen
    await page.locator('button:has-text("✕")').click();
    await expect(page.locator('[data-testid="3d-viewer"]')).not.toHaveClass(/fixed/);
  });

  test('AR try-on modal opens and displays features', async ({ page }) => {
    // Mock camera permissions
    await page.context().grantPermissions(['camera']);
    
    // Click Enhanced AR button
    await page.locator('button:has-text("Enhanced AR")').click();
    
    // Check if AR modal opens
    await expect(page.locator('[data-testid="ar-modal"]')).toBeVisible();
    await expect(page.locator('h2:has-text("Enhanced AR Try-On")')).toBeVisible();
    
    // Check for AR controls
    await expect(page.locator('button:has-text("Capture")')).toBeVisible();
    await expect(page.locator('button:has-text("Record")')).toBeVisible();
    await expect(page.locator('button:has-text("Share")')).toBeVisible();
    
    // Test lighting controls
    await page.locator('[data-testid="lighting-toggle"]').click();
    
    // Test color selection in AR
    await page.locator('[data-testid="color-selector"] button').first().click();
    
    // Close AR modal
    await page.locator('button[aria-label="Close AR Try-On"]').click();
    await expect(page.locator('[data-testid="ar-modal"]')).not.toBeVisible();
  });

  test('size recommendation system works', async ({ page }) => {
    // Check if size recommendation section is visible
    await expect(page.locator('h3:has-text("Size Recommendations")')).toBeVisible();
    
    // If no measurements, should show measurement form button
    const addMeasurementsBtn = page.locator('button:has-text("Add My Measurements")');
    if (await addMeasurementsBtn.isVisible()) {
      await addMeasurementsBtn.click();
      
      // Fill in measurement form
      await page.locator('input[placeholder="Height"]').fill('170');
      await page.locator('input[placeholder="Weight"]').fill('65');
      await page.locator('input[placeholder="Chest"]').fill('88');
      await page.locator('input[placeholder="Waist"]').fill('74');
      
      await page.locator('button:has-text("Save Measurements")').click();
      
      // Wait for recommendations to load
      await expect(page.locator('[data-testid="size-recommendation"]')).toBeVisible();
      await expect(page.locator('text=RECOMMENDED')).toBeVisible();
    }
    
    // Test size selection
    await page.locator('[data-testid="size-option"]').first().click();
    await expect(page.locator('[data-testid="size-option"]').first()).toHaveClass(/ring-primary/);
  });

  test('performance monitoring works', async ({ page }) => {
    // Add performance monitoring script
    await page.addInitScript(() => {
      window.performanceMetrics = [];
      const originalConsoleLog = console.log;
      console.log = (...args) => {
        if (args[0]?.includes?.('Performance:')) {
          window.performanceMetrics.push(args);
        }
        originalConsoleLog.apply(console, args);
      };
    });
    
    // Interact with 3D viewer
    await page.locator('button:has-text("Show 3D View")').click();
    await page.waitForTimeout(2000); // Allow time for 3D rendering
    
    // Check if performance metrics are being collected
    const metrics = await page.evaluate(() => window.performanceMetrics);
    expect(metrics.length).toBeGreaterThan(0);
  });

  test('mobile responsiveness for AR features', async ({ page, isMobile }) => {
    if (!isMobile) {
      test.skip('This test is only for mobile devices');
    }
    
    // Test 3D viewer on mobile
    await page.locator('button:has-text("Show 3D View")').click();
    
    // Check if controls are adapted for mobile
    await expect(page.locator('[data-testid="3d-viewer-controls"]')).toBeVisible();
    
    // Test touch interactions (simulated)
    const viewer = page.locator('[data-testid="3d-canvas"]');
    await viewer.hover();
    
    // Test AR on mobile
    await page.locator('button:has-text("Enhanced AR")').click();
    await expect(page.locator('[data-testid="ar-modal"]')).toBeVisible();
    
    // Check mobile-specific AR controls
    await expect(page.locator('[data-testid="mobile-ar-controls"]')).toBeVisible();
  });

  test('accessibility compliance for AR/3D features', async ({ page }) => {
    // Test keyboard navigation
    await page.keyboard.press('Tab'); // Should focus on first interactive element
    await page.keyboard.press('Tab'); // Navigate to 3D viewer button
    await page.keyboard.press('Enter'); // Should open 3D viewer
    
    await expect(page.locator('[data-testid="3d-viewer"]')).toBeVisible();
    
    // Test ARIA labels
    await expect(page.locator('button[aria-label="Toggle 3D rotation"]')).toBeVisible();
    await expect(page.locator('button[aria-label="Enter fullscreen mode"]')).toBeVisible();
    
    // Test screen reader announcements
    await page.locator('button:has-text("Enhanced AR")').click();
    await expect(page.locator('[aria-live="polite"]')).toBeVisible();
  });

  test('error handling for unsupported devices', async ({ page }) => {
    // Mock WebGL as unavailable
    await page.addInitScript(() => {
      const originalGetContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function(type) {
        if (type === 'webgl' || type === 'webgl2') {
          return null;
        }
        return originalGetContext.call(this, type);
      };
    });
    
    await page.reload();
    
    // Try to open 3D viewer
    await page.locator('button:has-text("Show 3D View")').click();
    
    // Should show fallback message
    await expect(page.locator('text=WebGL not supported')).toBeVisible();
    await expect(page.locator('button:has-text("View Images Instead")')).toBeVisible();
  });

  test('AR photo capture and sharing', async ({ page }) => {
    // Mock camera permissions
    await page.context().grantPermissions(['camera']);
    
    // Open AR modal
    await page.locator('button:has-text("Enhanced AR")').click();
    await expect(page.locator('[data-testid="ar-modal"]')).toBeVisible();
    
    // Wait for AR to initialize (mocked)
    await page.waitForTimeout(2000);
    
    // Capture AR photo
    await page.locator('button:has-text("Capture")').click();
    
    // Check if photo appears in gallery
    await expect(page.locator('[data-testid="ar-photo-gallery"]')).toBeVisible();
    await expect(page.locator('[data-testid="captured-photo"]')).toBeVisible();
    
    // Test sharing functionality
    await page.locator('[data-testid="share-photo"]').click();
    
    // Should trigger share dialog or copy to clipboard
    // This would be browser-specific behavior
  });
}); 