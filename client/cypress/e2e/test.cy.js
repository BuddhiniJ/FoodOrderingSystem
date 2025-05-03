// cypress/e2e/deliveryHome.cy.js

describe("Delivery Home Page - Authenticated Test", () => {
  const email = "delivery@gmail.com"; // Use a valid delivery-personnel user
  const password = "password123";     // Replace with actual password

  before(() => {
    // Login and set token and user info
    cy.visit("http://localhost:5173/login");

    cy.get("input[type='email']").type(email);
    cy.get("input[type='password']").type(password);
    cy.get("button[type='submit']").click();

    // Wait for redirection
    cy.url().should("not.include", "/login");

    // Ensure token is saved
    cy.window().then((win) => {
      const token = win.localStorage.getItem("token");
      const user = JSON.parse(win.localStorage.getItem("user"));
      expect(token).to.exist;
      expect(user).to.have.property("role", "delivery-personnel");
    });
  });

  beforeEach(() => {
    // Visit DeliveryHome
    cy.visit("http://localhost:5173/delivery-home");
  });

  it("Displays welcome message and instructions", () => {
    cy.contains("Welcome, Delivery Personnel! ").should("exist");
    cy.contains("Ready to deliver happiness?").should("exist");
  });

  it("Displays 'Find Orders Near Me' button", () => {
    cy.contains("Find Orders Near Me").should("exist");
  });

  it("Navigates to Location Updater page on button click", () => {
    cy.contains("Find Orders Near Me").click();
    cy.url().should("include", "/location-updater");
  });
});
