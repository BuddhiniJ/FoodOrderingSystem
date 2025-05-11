describe("User Profile Page - View and Edit Profile", () => {
  const email = "testcus@gmail.com";
  const password = "testcus";

  beforeEach(() => {
    // Login before each test
    cy.visit("http://localhost:5173/login");

    cy.get("input[type='email']").type(email);
    cy.get("input[type='password']").type(password);
    cy.get("button[type='submit']").click();

    cy.url().should("not.include", "/login");
    cy.visit("http://localhost:5173/profile");
    cy.contains("My Profile").should("exist");
  });

  it("Displays user profile information", () => {
    cy.get(".profile-details").within(() => {
      cy.contains("Personal Information").should("exist");
      cy.get(".info-item").should("have.length.at.least", 3);
      cy.contains("Email:").next().should("contain", email);
    });
  });

  it("Navigates to edit profile page", () => {
    cy.contains("Edit Profile").click();
    cy.url().should("include", "/profile/edit");
    cy.contains("Update Profile").should("exist");
  });

  it("Edits profile and updates successfully", () => {
    cy.visit("http://localhost:5173/profile/edit");

    const updatedName = "Updated Test User";
    cy.get("input#name").clear().type(updatedName);
    cy.get("button[type='submit']").click();

    cy.url().should("include", "/profile");
    cy.contains("My Profile").should("exist");
    cy.contains(updatedName).should("exist");
  });

  it("Cancels update and navigates back to profile", () => {
    cy.visit("http://localhost:5173/profile/edit");
    cy.get("button").contains("Cancel").click();
    cy.url().should("include", "/profile");
  });

  it("Displays validation error messages on empty submit", () => {
    cy.visit("http://localhost:5173/profile/edit");

    cy.get("input#name").clear();
    cy.get("input#phone").clear();
    cy.get("button[type='submit']").click();

    cy.contains("Name is required").should("exist");
    cy.contains("Phone number is required").should("exist");
  });

  it("Does not update profile if no changes are made", () => {
    cy.visit("http://localhost:5173/profile/edit");

    cy.get("button[type='submit']").click();

    cy.url().should("include", "/profile");
    cy.contains("Profile updated").should("not.exist"); // Assuming your app shows success message only if updated
  });

  it("Allows partial update (only name changed)", () => {
    cy.visit("http://localhost:5173/profile/edit");

    const partialUpdateName = "Partially Updated User";
    cy.get("input#name").clear().type(partialUpdateName);
    cy.get("button[type='submit']").click();

    cy.url().should("include", "/profile");
    cy.contains(partialUpdateName).should("exist");
  });

  it("Preserves data after cancelling update", () => {
    cy.visit("http://localhost:5173/profile/edit");

    const tempName = "Temp Name Change";
    cy.get("input#name").clear().type(tempName);
    cy.get("button").contains("Cancel").click();

    cy.url().should("include", "/profile");
    cy.contains(tempName).should("not.exist");
  });
});
