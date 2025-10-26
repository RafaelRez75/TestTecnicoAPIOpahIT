describe('API Produtos - ServeRest', () => {
  let authToken;
  let productId;
  let adminUser = {
    email: 'fulano@qa.com',
    password: 'teste'
  };

  before(() => {
    // Login para obter token
    cy.login(adminUser.email, adminUser.password).then((response) => {
      authToken = response.body.authorization;
    });
  });

  // Helper para gerar dados de produto
  const createProductData = () => ({
    nome: `Produto ${Date.now()}`,
    preco: 100,
    descricao: 'Descrição do produto teste',
    quantidade: 50
  });










  /// POST ///
  // Create Product with Admin token
  it('deve criar um produto com autenticação de admin', () => {
    const productData = createProductData();

    cy.createProduct(productData, authToken).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('_id');
      
      // A API pode retornar a mensagem em português diferente
      const successMessage = response.body.message || response.body.descricao;
      expect(successMessage).to.include('sucesso'); // "Cadastro realizado com sucesso"
      
      // Verifica se o id está no corpo da resposta
      expect(response.body).to.have.property('_id');
      
      productId = response.body._id;
    });
  });

  /// Error Creating Product without Admin token
  it('deve retornar erro ao criar produto sem autenticação', () => {
    const productData = createProductData();

    cy.createProduct(productData).then((response) => { // Sem authToken
      expect(response.status).to.eq(401);
      expect(response.body.message).to.eq('Token de acesso ausente, inválido, expirado ou usuário do token não existe mais');
    });
  });

  /// Create Product without name
  it('deve retornar erro ao criar produto sem nome', () => {
    const productData = {
      preco: 100,
      descricao: 'Descrição teste',
      quantidade: 50
    };

    cy.createProduct(productData, authToken).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body.nome).to.eq('nome é obrigatório');
    });
  });

  /// Create Product with price equals 0
  it('deve retornar erro ao criar produto com preço zero', () => {
    const productData = {
      nome: `Produto ${Date.now()}`,
      preco: 0,
      descricao: 'Descrição teste',
      quantidade: 50
    };

    cy.createProduct(productData, authToken).then((response) => {
      expect(response.status).to.eq(400);
      
      // A mensagem pode estar em diferentes campos
      const errorMessage = response.body.message || response.body.preco || response.body.error;
      if (errorMessage) {
        expect(errorMessage.toString()).to.include('preco');
      }
    });
  });

  /// Create Product with negative quantity
  it('deve retornar erro ao criar produto com quantidade negativa', () => {
    const productData = {
      nome: `Produto ${Date.now()}`,
      preco: 100,
      descricao: 'Descrição teste',
      quantidade: -5
    };

    cy.createProduct(productData, authToken).then((response) => {
      expect(response.status).to.eq(400);
      
      // Verifica diferentes possibilidades de mensagem de erro
      const errorMessage = response.body.message || response.body.quantidade || response.body.error;
      if (errorMessage) {
        expect(errorMessage.toString()).to.include('quantidade');
      }
    });
  });




  
  /// GET ///
  /// Get Product by ID
  it('deve buscar produto existente por ID', () => {
    // Primeiro cria um produto
    const productData = createProductData();
    
    cy.createProduct(productData, authToken).then((createResponse) => {
      const testProductId = createResponse.body._id;

      // Busca o produto criado
      cy.getProduct(testProductId).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body._id).to.eq(testProductId);
        expect(response.body.nome).to.eq(productData.nome);
        expect(response.body.preco).to.eq(productData.preco);
        expect(response.body.descricao).to.eq(productData.descricao);
        expect(response.body.quantidade).to.eq(productData.quantidade);
      });
    });
  });

  /// Get All Products
  it('deve listar todos os produtos cadastrados', () => {
    cy.getAllProducts().then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('quantidade');
      expect(response.body).to.have.property('produtos');
      expect(response.body.produtos).to.be.an('array');
      expect(response.body.quantidade).to.be.greaterThan(0);

      if (response.body.produtos.length > 0) {
        const firstProduct = response.body.produtos[0];
        expect(firstProduct).to.have.property('_id');
        expect(firstProduct).to.have.property('nome');
        expect(firstProduct).to.have.property('preco');
        expect(firstProduct).to.have.property('descricao');
        expect(firstProduct).to.have.property('quantidade');
      }
    });
  });

  /// Get Products filtered by name
  it('deve listar produtos filtrados por nome', () => {
    const productData = createProductData();
    
    cy.createProduct(productData, authToken).then(() => {
      cy.getAllProducts({ nome: productData.nome }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.quantidade).to.be.greaterThan(0);
        
        const foundProduct = response.body.produtos.find(
          prod => prod.nome === productData.nome
        );
        expect(foundProduct).to.exist;
        expect(foundProduct.nome).to.eq(productData.nome);
      });
    });
  });
 
  /// Get Products filtered by non-existing name
  it('deve retornar lista vazia para nome não existente', () => {
    cy.getAllProducts({ nome: 'NomeInexistenteXYZ123' }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.quantidade).to.eq(0);
      expect(response.body.produtos).to.be.an('array').that.is.empty;
    });
  });

  /// Get Product filtered by non-existing ID
  it('deve retornar erro ao buscar produto com ID inexistente', () => {
   const nonExistentId = '1234567890123456';

   cy.getProduct(nonExistentId).then((response) => {
    cy.log(response.body);

    expect(response.status).to.eq(400);
    expect(response.body.message).to.eq('Produto não encontrado');
   });
  });





  /// PUT ///
  /// Edit product with Admin Token
  it('deve editar produto existente com autenticação de admin', () => {
    const productData = createProductData();

    cy.createProduct(productData, authToken).then((createResponse) => {
      const productIdToUpdate = createResponse.body._id;
      const updatedData = {
        nome: `Produto Atualizado ${Date.now()}`,
        preco: 200,
        descricao: 'Descrição atualizada',
        quantidade: 100
      };

      cy.updateProduct(productIdToUpdate, updatedData, authToken).then((updateResponse) => {
        expect(updateResponse.status).to.eq(200);
        expect(updateResponse.body.message).to.eq('Registro alterado com sucesso');

        // Verifica se os dados foram atualizados
        cy.getProduct(productIdToUpdate).then((getResponse) => {
          expect(getResponse.body.nome).to.eq(updatedData.nome);
          expect(getResponse.body.preco).to.eq(updatedData.preco);
          expect(getResponse.body.descricao).to.eq(updatedData.descricao);
          expect(getResponse.body.quantidade).to.eq(updatedData.quantidade);
        });
      });
    });
  });

  /// Edit product without Admin Token
  it('deve retornar erro ao editar produto sem autenticação', () => {
    const productData = createProductData();

    cy.createProduct(productData, authToken).then((createResponse) => {
      const productIdToUpdate = createResponse.body._id;
      const updatedData = { nome: 'Produto Atualizado' };

      cy.updateProduct(productIdToUpdate, updatedData).then((response) => {
        expect(response.status).to.eq(401);
        expect(response.body.message).to.include('Token de acesso ausente');
      });
    });
  });





  /// DELETE ///
  ///
  it('deve excluir produto existente com autenticação de admin', () => {
    const productData = createProductData();

    cy.createProduct(productData, authToken).then((createResponse) => {
      const productIdToDelete = createResponse.body._id;

      cy.deleteProduct(productIdToDelete, authToken).then((deleteResponse) => {
        expect(deleteResponse.status).to.eq(200);
        expect(deleteResponse.body.message).to.eq('Registro excluído com sucesso');

        // Verifica se o produto foi realmente excluído
        cy.getProduct(productIdToDelete).then((getResponse) => {
          expect(getResponse.status).to.eq(400);
          expect(getResponse.body.message).to.eq('Produto não encontrado');
        });
      });
    });
  });

  ///
  it('deve retornar erro ao excluir produto sem autenticação', () => {
    const productData = createProductData();

    cy.createProduct(productData, authToken).then((createResponse) => {
      const productIdToDelete = createResponse.body._id;

      cy.deleteProduct(productIdToDelete).then((response) => {
        expect(response.status).to.eq(401);
        expect(response.body.message).to.include('Token de acesso ausente');
      });
    });
  });

  ///
  it('deve retornar erro ao buscar produto excluído', () => {
    const productData = createProductData();

    /// Cria o Produto
    cy.createProduct(productData, authToken).then((createResponse) => {
      const productIdToDelete = createResponse.body._id;

      // Exclui o produto
      cy.deleteProduct(productIdToDelete, authToken).then(() => {
        // Tenta buscar o produto excluído
        cy.getProduct(productIdToDelete).then((response) => {
          expect(response.status).to.eq(400);
          expect(response.body.message).to.eq('Produto não encontrado');
        });
      });
    });
  });



});


/*  CENÁRIOS DE TESTES
  
  POST 
- ✅ Criar produto (admin)
- ✅ Criar produto sem autenticação
- ✅ Criar produto com campos inválidos (Sem Nome, Preço, Quantidade negativa)


  GET
- ✅ Buscar produto por ID
- ✅ Listar todos os produtos
- ✅ Listar produtos por nome (Existente e não existente)
- ✅ Buscar produto ID Inexistente


  PUT
- ✅ Editar produto (admin)
- ✅ Criar produto sem autenticação


  DELETE
- ✅ Excluir produto (admin)  
- ✅ Excluir produto sem autenticação  
- ✅ Buscar produto excluído 


*/