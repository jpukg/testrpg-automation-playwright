import { test, expect } from '@playwright/test';
import * as path from 'path';

test('automate character creation form', async ({ page }) => {
  // Navigate to your page
  await page.goto('https://test-rpg.vercel.app/play');

  // Fill in "Character name"
  await page.fill('input[name="name"]', 'John Doe');

  const isButtonVisible = await page.isVisible('button:has-text("Start!")');
  console.log("Visible" + isButtonVisible);

  await page.click('text=Start!');

  // Wait for the button to be enabled
  const button = page.locator('button:has-text("Click me")');

  // Click the button 5 times
  for (let i = 0; i < 5; i++) {
    await button.click();
    await page.waitForTimeout(1000);
  }

  // Optionally, check if the counter on the button or feedback message has changed
  const feedbackMessage = await page.locator('span[data-task="clicker"]').textContent();
  console.log('Feedback after clicks:', feedbackMessage);
  
  // Verify the feedback or result (if the text changes after clicking 5 times)
  expect(feedbackMessage).toContain('You levelled up');

  // Locate the file input field using the data-testid or other selectors
  const fileInput = await page.locator('input[type="file"]');
  
  // Define the path to the file you want to upload
  const filePath = path.resolve(__dirname, 'example.spec.ts');

  // Upload the file
  await fileInput.setInputFiles(filePath);

  // Optionally, wait for a confirmation message that the character has leveled up
  const levelUpMessage = await page.locator('span:has-text("You levelled up")');
  
  // Verify that the level-up message is displayed
  await expect(levelUpMessage).toBeVisible();

  // Optionally, print the confirmation message
  console.log('Level up confirmation:', await levelUpMessage.textContent());

  
  const adventureTyperSection = page.locator('[data-testid="adventure-typer"]');

  // Locate the input element within the section and type "Lorem Ipsum"
  const adventureTyperSectionInput = adventureTyperSection.locator('input');
  await adventureTyperSectionInput.fill('Lorem Ipsum');  
  
  // Assert that the section is visible on the page
  await expect(adventureTyperSection).toBeVisible();

  // Locate the span with data-task="typer" inside this section
  const typerTaskSpan = await adventureTyperSection.locator('[data-task="typer"]');

  // Assert that the span is visible and contains the expected text "Dolar sit amet!"
  await expect(typerTaskSpan).toBeVisible();
  await expect(typerTaskSpan).toHaveText('Dolar sit amet!');
  
  // Optionally, print the text content for debugging purposes
  console.log('Typer Task Text:', await typerTaskSpan.textContent());


  const adventureSliderSection = page.locator('[data-testid="adventure-slider"]');

  // Locate the slider element
  const slider = adventureSliderSection.locator('[role="slider"]');

  // Get the slider element's bounding box to use for dragging
  const boundingBox = await slider.boundingBox();

  console.log('boundingBox:', boundingBox);

  if (boundingBox) {
    const { x, y, width, height } = boundingBox;

    // Define the end position of the slider
    const endX = x + width * 100; // Assuming you want to drag beyond the current width (adjust multiplier if needed)

    // Drag the slider to the right end
    await page.mouse.move(x + width / 2, y + height / 2); // Move mouse to start position
    await page.mouse.down(); // Press mouse down
    await page.mouse.move(endX, y + height / 2, { steps: 50 }); // Smoothly move to the right end
    await page.mouse.up(); // Release mouse

    // Optionally, wait for any updates to complete
    await page.waitForTimeout(5000); // Adjust if necessary
  } else {
    throw new Error('Slider bounding box is null');
  }

  // Verify that the confirmation message is shown
  const confirmationMessage = adventureSliderSection.locator('[data-task="slider"]');
  await expect(confirmationMessage).toHaveText('Slid to the next level!');


  await expect(adventureTyperSectionInput).toBeDisabled();
  await expect(fileInput).toBeDisabled();  
  // await expect(button).toBeDisabled();
  // await page.pause();

});
