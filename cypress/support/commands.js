/* USERS COMMANDS */
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

Cypress.Commands.add('getUser', (userId) => {
  return cy.request({
    method: 'GET',
    url: `/usuarios/${userId}`,
    failOnStatusCode: false
  });
});

Cypress.Commands.add('updateUser', (userId, userData) => {
  return cy.request({
    method: 'PUT',
    url: `/usuarios/${userId}`,
    body: userData,
    failOnStatusCode: false
  });
});

Cypress.Commands.add('deleteUser', (userId) => {
  return cy.request({
    method: 'DELETE',
    url: `/usuarios/${userId}`,
    failOnStatusCode: false
  });
});

Cypress.Commands.add('getAllUsers', (queryParams = {}) => {
  return cy.request({
    method: 'GET',
    url: '/usuarios',
    qs: queryParams,
    failOnStatusCode: false
  });
});

/* PRODUCTS COMMANDS */
Cypress.Commands.add('createProduct', (productData, authToken = null) => {
  const options = {
    method: 'POST',
    url: '/produtos',
    body: productData,
    failOnStatusCode: false
  };

  if (authToken) {
    options.headers = { Authorization: authToken };
  }

  return cy.request(options);
});

Cypress.Commands.add('getProduct', (productId) => {
  return cy.request({
    method: 'GET',
    url: `/produtos/${productId}`,
    failOnStatusCode: false
  });
});

Cypress.Commands.add('getAllProducts', (queryParams = {}) => {
  return cy.request({
    method: 'GET',
    url: '/produtos',
    qs: queryParams,
    failOnStatusCode: false
  });
});

Cypress.Commands.add('updateProduct', (productId, productData, authToken = null) => {
  const options = {
    method: 'PUT',
    url: `/produtos/${productId}`,
    body: productData,
    failOnStatusCode: false
  };

  if (authToken) {
    options.headers = { Authorization: authToken };
  }

  return cy.request(options);
});

Cypress.Commands.add('deleteProduct', (productId, authToken = null) => {
  const options = {
    method: 'DELETE',
    url: `/produtos/${productId}`,
    failOnStatusCode: false
  };

  if (authToken) {
    options.headers = { Authorization: authToken };
  }

  return cy.request(options);
});

/* CARTS COMMANDS */
/* COMMANDS PARA CARRINHO - NOMES SIMPLIFICADOS */

// POST /carrinhos - Criar carrinho
Cypress.Commands.add('createCart', (cartData = {}, authToken = null) => {
  const options = {
    method: 'POST',
    url: '/carrinhos',
    body: cartData,
    failOnStatusCode: false
  };

  if (authToken) {
    options.headers = { Authorization: authToken };
  }

  return cy.request(options);
});

// GET /carrinhos - Listar carrinhos
Cypress.Commands.add('getCarts', (authToken = null) => {
  const options = {
    method: 'GET',
    url: '/carrinhos',
    failOnStatusCode: false
  };

  if (authToken) {
    options.headers = { Authorization: authToken };
  }

  return cy.request(options);
});

// GET /carrinhos/_id - Buscar carrinho por ID
Cypress.Commands.add('getCartById', (cartId, authToken = null) => {
  const options = {
    method: 'GET',
    url: `/carrinhos/${cartId}`,
    failOnStatusCode: false
  };

  if (authToken) {
    options.headers = { Authorization: authToken };
  }

  return cy.request(options);
});

// DELETE /carrinhos/concluir-compra - Concluir compra
Cypress.Commands.add('checkoutCart', (authToken = null) => {
  const options = {
    method: 'DELETE',
    url: '/carrinhos/concluir-compra',
    failOnStatusCode: false
  };

  if (authToken) {
    options.headers = { Authorization: authToken };
  }

  return cy.request(options);
});

// DELETE /carrinhos/cancelar-compra - Cancelar compra
Cypress.Commands.add('cancelCart', (authToken = null) => {
  const options = {
    method: 'DELETE',
    url: '/carrinhos/cancelar-compra',
    failOnStatusCode: false
  };

  if (authToken) {
    options.headers = { Authorization: authToken };
  }

  return cy.request(options);
});