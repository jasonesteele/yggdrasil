describe("Navigation", () => {
  beforeEach(() => {
    cy.dbSetup();
  });

  it("log in and out", () => {
    cy.login();
    cy.get('[data-cy="user-profile-button"]').click();
    cy.contains("Logout").click();
    cy.contains("Sign in with Test Sign-in");
  });
});
