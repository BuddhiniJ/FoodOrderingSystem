describe("Login Page Performance", () => {
  beforeEach(() => {
    // Clear cache and cookies before each test
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it("should load login page quickly", () => {    
    const startTime = performance.now();
    
    // Visit the login page
    cy.visit("http://localhost:5173/login");    
    
    cy.window().then(() => {
      const loadTime = performance.now() - startTime;
      cy.log(`Login page load time: ${loadTime.toFixed(2)}ms`);
      expect(loadTime).to.be.lessThan(5000); // Page should load in under 5 seconds
    });
  });

  it("should respond to login form submission quickly", () => {
    cy.visit("http://localhost:5173/login");
    
    // Fill in the form
    cy.get('input[name="email"]').type("testeshmika@gmail.com");
    cy.get('input[name="password"]').type("eshmika123");
    
    const startTime = performance.now();
    cy.get('button[type="submit"]').click();
    
    cy.url().should("include", "/").then(() => {
      const responseTime = performance.now() - startTime;
      cy.log(`Login response time: ${responseTime.toFixed(2)}ms`);
      
      expect(responseTime).to.be.lessThan(2000); // Login should process in under 2 seconds
    });
  });

  it("should handle multiple rapid login attempts efficiently", () => {    
    const attempts = 5;
    const startTime = performance.now();
    
    const attemptLogin = (index) => {
      cy.visit("http://localhost:5173/login");
      cy.get('input[name="email"]').type(`test${index}@example.com`);
      cy.get('input[name="password"]').type("password123");
      cy.get('button[type="submit"]').click();     
    };
    
    // Make multiple attempts
    for(let i = 0; i < attempts; i++) {
      attemptLogin(i);
    }
    
    cy.then(() => {
      const totalTime = performance.now() - startTime;
      cy.log(`Average time per login attempt: ${(totalTime/attempts).toFixed(2)}ms`);     
      expect(totalTime/attempts).to.be.lessThan(1500); 
    });
  });
});