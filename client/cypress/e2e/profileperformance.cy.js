describe("User Profile Performance Tests", () => {
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
  });

  it("should load profile page quickly", () => {
    const startTime = performance.now();
    
    // Visit the profile page
    cy.visit("http://localhost:5173/profile");
    
    // Wait for content to confirm page is loaded
    cy.contains("My Profile").should("exist");
    
    cy.window().then(() => {
      const loadTime = performance.now() - startTime;
      cy.log(`Profile page load time: ${loadTime.toFixed(2)}ms`);
      expect(loadTime).to.be.lessThan(3000); // Page should load in under 3 seconds
    });
  });

  it("should transition to edit profile page efficiently", () => {
    cy.visit("http://localhost:5173/profile");
    
    // Wait for page to load
    cy.contains("My Profile").should("exist");
    
    const startTime = performance.now();
    
    // Click on edit profile button
    cy.contains("Edit Profile").click();
    
    // Wait for edit page to load
    cy.contains("Update Profile").should("exist");
    
    cy.window().then(() => {
      const transitionTime = performance.now() - startTime;
      cy.log(`Profile to Edit Profile navigation time: ${transitionTime.toFixed(2)}ms`);
      expect(transitionTime).to.be.lessThan(2000); // Navigation should complete in under 2 seconds
    });
  });

  it("should update profile data efficiently", () => {
    cy.visit("http://localhost:5173/profile/edit");
    
    // Wait for edit page to load
    cy.contains("Update Profile").should("exist");
    
    const updatedName = "Performance Test User";
    cy.get("input#name").clear().type(updatedName);
    
    const startTime = performance.now();
    
    // Submit the form
    cy.get("button[type='submit']").click();
    
    // Wait for redirect to profile page to confirm update
    cy.url().should("include", "/profile");
    cy.contains("My Profile").should("exist");
    
    cy.window().then(() => {
      const updateTime = performance.now() - startTime;
      cy.log(`Profile update operation time: ${updateTime.toFixed(2)}ms`);
      expect(updateTime).to.be.lessThan(3000); // Update should complete in under 3 seconds
    });
  });
  
});