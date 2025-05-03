describe("My Restaurants Payments Page - Repeated Login", () => {
  const email = "test@gmail.com";
  const password = "loey#exo";

  beforeEach(() => {
    // Login before every test
    cy.visit("http://localhost:5173/login");

    cy.get("input[type='email']").type(email);
    cy.get("input[type='password']").type(password);
    cy.get("button[type='submit']").click();

    // Confirm login success
    cy.url().should("not.include", "/login");

    // Navigate to the payments page
    cy.visit("http://localhost:5173/resturants-payments");

    // Confirm page load
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
});
