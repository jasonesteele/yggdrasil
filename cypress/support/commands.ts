// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (user) => {
//
// })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

const { DATABASE_URL } = Cypress.env("test");

Cypress.Commands.add("dbSetup", () => {
  cy.exec(`cross-env DATABASE_URL=${DATABASE_URL} prisma migrate dev`);
  cy.exec(`cross-env DATABASE_URL=${DATABASE_URL} prisma db seed`);
});

Cypress.Commands.add("login", (user?: string) => {
  cy.visit("/");
  if (user) cy.get(`#input-username-for-credentials-provider`).type(user);
  cy.contains("Sign in with Test Sign-in").click();
});
