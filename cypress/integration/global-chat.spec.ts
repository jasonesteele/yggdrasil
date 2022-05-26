describe("Global Chat", () => {
  beforeEach(() => {
    cy.dbSetup();
  });

  it("sends and receives messages", () => {
    cy.login("Cypress");
    cy.get(`[data-cy="chat-command-input"]`)
      .type("Hello world{enter}")
      .type("This is a test{enter}");

    cy.get(`[data-cy="chat-messages"]`).contains("Hello world");
    cy.get(`[data-cy="chat-messages"]`).contains("This is a test");
  });
});
