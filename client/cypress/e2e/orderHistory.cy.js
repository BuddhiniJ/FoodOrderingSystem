describe("Order History Page", () => {
  const email = "testcus@gmail.com";
  const password = "testcus";

  beforeEach(() => {
    // Visit login page
    cy.visit("http://localhost:5173/login");

    // Fill in login form
    cy.get("input[type='email']").type(email);
    cy.get("input[type='password']").type(password);
    cy.get("button[type='submit']").click();

    // Confirm login and navigate to order history page
    cy.url().should("not.include", "/login");
    cy.visit("/myorders");

    // Optionally set a token for local storage
    localStorage.setItem("token", "mock-token");

    // Mock user data in context if needed
    cy.intercept("GET", "**/orders/user/*", {
      statusCode: 200,
      body: [
        {
          _id: "order123",
          reference: "REF123",
          status: "confirmed",
          totalAmount: 2500,
          createdAt: new Date().toISOString(),
          items: [
            { name: "Pizza", quantity: 2, price: 500 },
            { name: "Burger", quantity: 1, price: 1500 },
          ],
        },
      ],
    }).as("getOrders");
  });

  it("should display order history title", () => {
    cy.contains("Your Order History").should("be.visible");
  });

  it("should display order list with correct items and total", () => {
    cy.wait("@getOrders");
    cy.contains("Ref: REF123").should("be.visible");
    cy.contains("Pizza x 2 - Rs. 1000").should("exist");
    cy.contains("Burger x 1 - Rs. 1500").should("exist");
    cy.contains("Total: Rs. 2500").should("exist");
  });

  it("should show payment modal on clicking Pay Now", () => {
    cy.contains("Pay Now").click();
    cy.contains("Select Payment Method").should("be.visible");
    cy.contains("Pay with Cash").should("be.visible");
    cy.contains("Pay with Card").should("be.visible");
  });

  it("should close payment modal when Cancel is clicked", () => {
    cy.contains("Pay Now").click();
    cy.contains("Cancel").click();
    cy.contains("Select Payment Method").should("not.exist");
  });

  it("should show message when no orders are available", () => {
    cy.intercept("GET", "**/orders/user/*", []).as("getOrders");
    cy.visit("/myorders");
    cy.contains("No past orders found.").should("exist");
  });

  it("should display error on failed fetch", () => {
    cy.intercept("GET", "**/orders/user/*", {
      statusCode: 500,
      body: {},
    }).as("getOrders");

    cy.visit("/myorders");
    cy.contains("No past orders found.").should("exist");
  });
});
