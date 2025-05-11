describe("Login Page", () => {
  beforeEach(() => {
    // Visit the login page before each test
    cy.visit("http://localhost:5173/login");
  });

  it("should display login form", () => {
    cy.contains("h2", "Login").should("be.visible");
    cy.get('input[name="email"]').should("be.visible");
    cy.get('input[name="password"]').should("be.visible");
    cy.get('button[type="submit"]')
      .should("be.visible")
      .and("contain", "Login");
  });

  it("should show validation errors for empty fields", () => {
    cy.get('button[type="submit"]').click();
    cy.get(".error-text").should("be.visible");
  });

  it("should show error message for invalid email format", () => {
    cy.get('input[name="email"]').type("invalid-email"); // No @ or domain
    cy.get('input[name="password"]').type("password123");
    cy.get('button[type="submit"]').click();
    cy.get(".error-text")
      .should("be.visible")
      .and("contain", "Invalid email address");
  });

  it("should show error message for invalid credentials", () => {
    cy.get('input[name="email"]').type("invalid@example.com");
    cy.get('input[name="password"]').type("wrongpassword");
    cy.get('button[type="submit"]').click();
    cy.get(".error-message")
      .should("be.visible")
      .and("contain", "Invalid credentials");
  });

  it("should login and redirect regular user to home page", () => {
    cy.get('input[name="email"]').type("testeshmika@gmail.com"); // replace with real user email
    cy.get('input[name="password"]').type("eshmika123"); // replace with real user password
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/"); // or exact path
  });

  it("should show loading state on login button while logging in", () => {
    cy.get('input[name="email"]').type("test@gmail.com");
    cy.get('input[name="password"]').type("loey#exo");
    cy.get('button[type="submit"]').click();
    cy.get('button[type="submit"]').should("contain", "Logging in...");
  });

  it("should navigate to register page when clicking Register link", () => {
    cy.contains("a", "Register").click();
    cy.url().should("include", "/register");
  });
});
