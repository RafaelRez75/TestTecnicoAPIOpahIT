Cypress.Commands.add('createUser', (userData) => {
  return cy.request({
    method: 'POST',
    url: '/usuarios',
    body: userData,
    failOnStatusCode: false
  });
});

Cypress.Commands.add('login', (email, password) => {
  return cy.request({
    method: 'POST',
    url: '/login',
    body: { email, password },
    failOnStatusCode: false
  });
});

Cypress.Commands.add('getAuthToken', (email, password) => {
  return cy.login(email, password).then((response) => {
    return response.body.authorization;
  });
});