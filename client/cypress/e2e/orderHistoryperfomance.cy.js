describe("Order History Page Performance Tests", () => {
  const email = "testcus@gmail.com";
  const password = "testcus";

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
    
    // Set token in local storage
    localStorage.setItem("token", "mock-token");
  });

  it("should load order history page quickly", () => {
    // Mock orders data
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
        }
      ]
    }).as("getOrders");
    
    const startTime = performance.now();
    
    // Visit the order history page
    cy.visit("http://localhost:5173/myorders");
    
    // Wait for orders to load
    cy.wait("@getOrders");
    cy.contains("Your Order History").should("be.visible");
    
    cy.window().then(() => {
      const loadTime = performance.now() - startTime;
      cy.log(`Order history page load time: ${loadTime.toFixed(2)}ms`);
      expect(loadTime).to.be.lessThan(3000); // Page should load in under 3 seconds
    });
  });

  it("should render large order list efficiently", () => {
    // Generate a large dataset with 50 orders
    const orders = Array(50).fill().map((_, i) => ({
      _id: `order${i}`,
      reference: `REF${i}`,
      status: i % 3 === 0 ? "confirmed" : i % 3 === 1 ? "pending" : "delivered",
      totalAmount: 1000 + (i * 100),
      createdAt: new Date(Date.now() - i * 86400000).toISOString(), // Each a day apart
      items: [
        { name: "Pizza", quantity: i % 5 + 1, price: 500 },
        { name: "Burger", quantity: i % 3 + 1, price: 1500 },
      ],
    }));
    
    cy.intercept("GET", "**/orders/user/*", {
      statusCode: 200,
      body: orders
    }).as("getOrders");
    
    const startTime = performance.now();
    
    // Visit the order history page
    cy.visit("http://localhost:5173/myorders");
    
    // Wait for orders to load
    cy.wait("@getOrders");
    
    // Check that at least the first and last orders rendered
    cy.contains(`Ref: REF0`).should("be.visible");
    cy.contains(`Ref: REF49`).should("exist");
    
    cy.window().then(() => {
      const renderTime = performance.now() - startTime;
      cy.log(`Rendering time for 50 orders: ${renderTime.toFixed(2)}ms`);
      expect(renderTime).to.be.lessThan(5000); // Should render in under 5 seconds
    });
  });

  it("should handle error state efficiently", () => {
    cy.intercept("GET", "**/orders/user/*", {
      statusCode: 500,
      body: {}
    }).as("getErrorOrders");
    
    const startTime = performance.now();
    
    // Visit the order history page
    cy.visit("http://localhost:5173/myorders");
    
    // Wait for error state
    cy.wait("@getErrorOrders");
    cy.contains("No past orders found.").should("exist");
    
    cy.window().then(() => {
      const errorHandlingTime = performance.now() - startTime;
      cy.log(`Error handling time: ${errorHandlingTime.toFixed(2)}ms`);
      expect(errorHandlingTime).to.be.lessThan(2000); // Error handling should be quick
    });
  });
});