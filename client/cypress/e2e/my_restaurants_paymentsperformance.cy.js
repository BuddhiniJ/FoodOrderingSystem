describe("Restaurants Payments Page Performance", () => {
  const email = "fitmefirebase@gmail.com";
  const password = "eshmika123";

  beforeEach(() => {
    // Clear cache and cookies before each test
    cy.clearCookies();
    cy.clearLocalStorage();
    
    // Login before each test
    cy.visit("http://localhost:5173/login");
    cy.get("input[type='email']").type(email);
    cy.get("input[type='password']").type(password);
    cy.get("button[type='submit']").click();
    cy.url().should("not.include", "/login");
  });

  it("should load payments page quickly", () => {
    const startTime = performance.now();
    
    // Visit the payments page
    cy.visit("http://localhost:5173/resturants-payments");
    
    // Wait for content to confirm page is loaded
    cy.contains("Payments by Restaurant").should("exist");
    
    cy.window().then(() => {
      const loadTime = performance.now() - startTime;
      cy.log(`Payments page load time: ${loadTime.toFixed(2)}ms`);
      expect(loadTime).to.be.lessThan(5000); // Page should load in under 5 seconds
    });
  });

  it("should update payment status efficiently", () => {
    cy.visit("http://localhost:5173/resturants-payments");
    
    // Wait for page to load completely
    cy.contains("Payments by Restaurant").should("exist");
    cy.get(".payment-card").first().should("be.visible");
    
    const startTime = performance.now();
    
    // Change status and update
    cy.get(".payment-card")
      .first()
      .within(() => {
        cy.get("select").select("completed");
        cy.get(".update-btn").click();
      });
    
    // Wait for update to complete (look for success notification or updated state)
    cy.contains(/updated|success/i).should("exist");
    
    cy.window().then(() => {
      const updateTime = performance.now() - startTime;
      cy.log(`Payment status update time: ${updateTime.toFixed(2)}ms`);
      expect(updateTime).to.be.lessThan(2000); // Updates should complete in under 2 seconds
    });
  });

  it("should handle multiple payment cards rendering efficiently", () => {
    // Mock a large number of payment entries to test rendering performance
    cy.intercept("GET", "**/payments/restaurant/**", {
      statusCode: 200,
      body: Array(3).fill().map((_, i) => ({
        _id: `payment${i}`,
        userId: `user${i}`,
        orderId: `order${i}`,
        amount: 1000 + i,
        status: "pending",
        currency: "USD",
        createdAt: new Date().toISOString()
      }))
    }).as("getPayments");
    
    const startTime = performance.now();
    
    cy.visit("http://localhost:5173/resturants-payments");
    
    // Wait for all payment cards to render
    cy.wait("@getPayments");
    cy.get(".payment-card").should("have.length", 3);
    
    cy.window().then(() => {
      const renderTime = performance.now() - startTime;
      cy.log(`Rendering time for 3 payment cards: ${renderTime.toFixed(2)}ms`);
      expect(renderTime).to.be.lessThan(5000); // Should render in under 5 seconds
    });
  });

});