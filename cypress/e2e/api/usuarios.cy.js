describe('API Usuários - ServeRest', () => {
  let authToken;

  before(() => {
    // Login para obter token
    cy.login('beltrano@qa.com', 'teste').then((response) => {
      authToken = response.body.authorization;
    });
  });

  it('Deve listar todos os usuários', () => {
    cy.request({
      method: 'GET',
      url: '/usuarios'
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('usuarios');
      expect(response.body.usuarios).to.be.an('array');
    });
  });

  it('Deve criar um novo usuário', () => {
    const userData = {
      nome: "Usuario Teste Cypress",
      email: `teste${Date.now()}@qa.com`,
      password: "teste123",
      administrador: "true"
    };

    cy.createUser(userData).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('message', 'Cadastro realizado com sucesso');
      expect(response.body).to.have.property('_id');
    });
  });

  it('Deve retornar erro ao criar usuário com email duplicado', () => {
    const userData = {
      nome: "Usuario Duplicado",
      email: "fulano@qa.com", // Email já existente
      password: "teste123",
      administrador: "true"
    };

    cy.createUser(userData).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property('message', 'Este email já está sendo usado');
    });
  });
});