describe('API Produtos - ServeRest', () => {
  let authToken;
  let productId;

  before(() => {
    cy.login('beltrano@qa.com', 'teste').then((response) => {
      authToken = response.body.authorization;
    });
  });

  it('Deve criar um novo produto', () => {
    const productData = {
      nome: `Produto Teste ${Date.now()}`,
      preco: 100,
      descricao: "Descrição do produto",
      quantidade: 10
    };

    cy.request({
      method: 'POST',
      url: '/produtos',
      headers: {
        Authorization: authToken
      },
      body: productData
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('message', 'Cadastro realizado com sucesso');
      productId = response.body._id;
    });
  });

  it('Deve listar todos os produtos', () => {
    cy.request({
      method: 'GET',
      url: '/produtos'
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('produtos');
      expect(response.body.produtos).to.be.an('array');
    });
  });
});