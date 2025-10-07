from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Go to the main page
    page.goto("http://localhost:3000")

    # Fill out the form
    page.get_by_label("Submitted By").fill("Test User")
    page.get_by_label("Register Number").fill("12345")
    page.get_by_label("Group Members").fill("Test Group")

    # Click the submit button and wait for the download to start
    with page.expect_download():
        page.get_by_role("button", name="Generate & Download PDF").click()

    # Go to the admin page with basic auth
    # Credentials are mitnic:230408
    context.set_extra_http_headers({"Authorization": "Basic bWl0bmljOjIzMDQwOA=="})
    page.goto("http://localhost:3000/admin")

    # Expect the heading to be visible
    expect(page.get_by_role("heading", name="Analytics Data")).to_be_visible()

    # Take a screenshot
    page.screenshot(path="carmel-pdf-generator/jules-scratch/verification/verification.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)