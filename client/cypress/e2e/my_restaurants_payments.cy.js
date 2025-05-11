describe("My Restaurants Payments Page - Repeated Login", () => {
  const email = "fitmefirebase@gmail.com";
  const password = "eshmika123";

  beforeEach(() => {
    // Visit login page
    cy.visit("http://localhost:5173/login");

    // Fill in login form
    cy.get("input[type='email']").type(email);
    cy.get("input[type='password']").type(password);
    cy.get("button[type='submit']").click();

    // Confirm login and navigate
    cy.url().should("not.include", "/login");
    cy.visit("http://localhost:5173/resturants-payments");
    cy.contains("Payments by Restaurant").should("exist");
  });

  it("Displays payments by restaurant", () => {
    cy.get(".restaurant-name").should("exist");
    cy.get(".payment-card").should("exist");
  });

  it("Searches by Order ID or User ID", () => {
    cy.get("input[placeholder='Search by Order ID or User ID']")
      .type("test")
      .should("have.value", "test");
  });

  it("Changes status and updates", () => {
    cy.get(".payment-card")
      .first()
      .within(() => {
        cy.get("select").select("completed");
        cy.get(".update-btn").click();
      });
  });

  it("Deletes a payment", () => {
    cy.get(".payment-card")
      .first()
      .within(() => {
        cy.window().then((win) => cy.stub(win, "confirm").returns(true));
        cy.get(".delete-btn").click();
      });
  });

  // Additional Tests

  it("Shows message when no payments are available", () => {
    cy.intercept("GET", "**/payments/restaurant/**", []).as("getPayments");
    cy.visit("http://localhost:5173/resturants-payments");
    cy.contains("No payments found.").should("exist");
  });

  it("Displays error on failed fetch", () => {
    cy.intercept("GET", "**/restaurants/my-restaurants", {
      statusCode: 500,
      body: {},
    }).as("getRestaurants");

    cy.visit("http://localhost:5173/resturants-payments");
    cy.contains("Failed to load payments.").should("exist");
  });

  it("Displays payment amount with currency", () => {
    cy.get(".payment-card")
      .first()
      .within(() => {
        cy.contains(/Amount: \d+ (USD|LKR|EUR|GBP)/i).should("exist");
      });
  });
});
