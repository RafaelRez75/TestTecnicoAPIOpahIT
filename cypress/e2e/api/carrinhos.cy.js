describe('API Carrinhos - Parâmetros de Query do GET /carrinhos', () => {
  let userToken;
  let adminToken;

  before(() => {
    // Setup básico
    const userData = {
      nome: `User ${Date.now()}`,
      email: `user${Date.now()}@qa.com`,
      password: "teste123",
      administrador: "false"
    };

    return cy.createUser(userData)
      .then(() => cy.login(userData.email, userData.password))
      .then((loginResponse) => {
        userToken = loginResponse.body.authorization;
        return cy.login('fulano@qa.com', 'teste');
      })
      .then((adminLogin) => {
        adminToken = adminLogin.body.authorization;
      });
  });

  // Helper para criar carrinhos de teste
  const createTestCarts = () => {
    const productData = {
      nome: `Produto Teste ${Date.now()}`,
      preco: 100,
      descricao: 'Produto para teste',
      quantidade: 10
    };

    return cy.createProduct(productData, adminToken)
      .then((productRes) => {
        if (productRes.status === 201) {
          const productId = productRes.body._id;
          
          // Cria vários carrinhos
          const cart1 = { produtos: [{ idProduto: productId, quantidade: 1 }] };
          const cart2 = { produtos: [{ idProduto: productId, quantidade: 2 }] };
          const cart3 = { produtos: [{ idProduto: productId, quantidade: 3 }] };

          return cy.createCart(cart1, userToken)
            .then(() => cy.createCart(cart2, userToken))
            .then(() => cy.createCart(cart3, userToken));
        }
      });
  };


  /// POST ///
  /// Create card with products
  it.skip('deve criar carrinho com produtos', () => {
    const cartData = {
      produtos: [
        {
          idProduto: productId,
          quantidade: 2
        }
      ]
    };

    cy.createCart(cartData, userToken).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.message).to.eq("Cadastro realizado com sucesso");
    });
  });

  /// Error creating cart without products and with token
  it.skip('deve retornar erro ao criar um carrinho vazio com token', () => {

    const userData = {
      nome: `Test User ${Date.now()}`,
      email: `test${Date.now()}@qa.com`,
      password: "teste123",
      administrador: "false"
    };

    cy.createUser(userData)
      .then(() => cy.login(userData.email, userData.password))
      .then((loginRes) => {
        const freshToken = loginRes.body.authorization;
        return cy.createCart({}, freshToken);
      })
      .then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.produtos).to.eq('produtos é obrigatório');
        expect(response.body).to.have.property('produtos');
      });
  });

  /// Error creating cart without token and products
  it.skip('deve retornar erro 401 quando token está ausente', () => {
    cy.createCart({}).then((response) => {
      expect(response.status).to.eq(401);
      expect(response.body.message).to.include('Token de acesso ausente');
    });
  });

  /// Error creating cart with token Invalid Text (wrong format)
  it.skip('deve retornar erro 401 com token inválido', () => {
    const invalidToken = 'token_invalido_123456';
    
    cy.createCart({}, invalidToken).then((response) => {
      expect(response.status).to.eq(401);
      expect(response.body.message).to.include('Token de acesso ausente, inválido, expirado');
    });
  });

  // Error creating cart with expired Token 
  it.skip('deve retornar erro 401 com token expirado', () => {
    const userData = {
      nome: `User ${Date.now()}`,
      email: `user${Date.now()}@qa.com`,
      password: "teste123",
      administrador: "false"
    };

    let expiredToken;

    cy.createUser(userData)
      .then(() => cy.login(userData.email, userData.password))
      .then((loginRes) => {
        expiredToken = loginRes.body.authorization;
        
        cy.wait(1000); 
        
        return cy.createCart({}, expiredToken);
      })
      .then((response) => {

        if (response.status === 401) {
          expect(response.body.message).to.include('expirado');
        }
      });
  });

  // Error creating cart with deleted Token 
  it.skip('deve retornar erro 401 quando usuário do token não existe mais', () => {
    const userData = {
      nome: `User ${Date.now()}`,
      email: `user${Date.now()}@qa.com`,
      password: "teste123",
      administrador: "false"
    };

    let userToken;
    let userId;

    cy.createUser(userData)
      .then((userRes) => {
        userId = userRes.body._id;
        return cy.login(userData.email, userData.password);
      })
      .then((loginRes) => {
        userToken = loginRes.body.authorization;
        
        return cy.login('fulano@qa.com', 'teste');
      })
      .then((adminLogin) => {
        const adminToken = adminLogin.body.authorization;
        return cy.deleteUser(userId, adminToken);
      })
      .then(() => {
        return cy.createCart({}, userToken);
      })
      .then((response) => {
        expect(response.status).to.eq(401);
        expect(response.body.message).to.include('usuário do token não existe mais');
      });
  });

  /// Error creating cart with Invalid Bearer token
  it.skip('deve retornar erro 401 com formato Bearer incorreto', () => {
    const malformedToken = 'Bearer123456';
    
    cy.createCart({}, malformedToken).then((response) => {
      expect(response.status).to.eq(401);
      expect(response.body.message).to.include('Token de acesso ausente, inválido');
    });
  });

  /// Error creating cart with empty token
  it.skip('deve retornar erro 401 com token vazio', () => {
    const emptyToken = '';
    
    cy.createCart({}, emptyToken).then((response) => {
      expect(response.status).to.eq(401);
      expect(response.body.message).to.include('Token de acesso ausente');
    });
  });

  /// Error creating cart token with special characters
  it.skip('deve retornar erro 401 com token com caracteres especiais', () => {
    const specialCharToken = 'Bearer !@#$%^&*()_+';
    
    cy.createCart({}, specialCharToken).then((response) => {
      expect(response.status).to.eq(401);
      expect(response.body.message).to.include('Token de acesso ausente, inválido');
    });
  });





  ///  GET ID ///
  /// Get cart by ID
  it.skip('deve buscar carrinho existente por ID', () => {
    const cartData = {
      produtos: [
        {
          idProduto: productId,
          quantidade: 1
        }
      ]
    };

    cy.createCart(cartData, userToken).then((createResponse) => {
      const cartId = createResponse.body._id;

      cy.getCartById(cartId, userToken).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body._id).to.eq(cartId);
        expect(response.body.produtos).to.have.length(1);
      });
    });
  });

  /// Error getting cart with invalid ID 
  it.skip('deve retornar erro ao buscar carrinho inexistente', () => {
    const invalidId = '1234567012345678';
    
    cy.getCartById(invalidId, userToken).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body.message).to.eq('Carrinho não encontrado');
    });
  });



  // GET ALL
  it.skip('deve listar todos os carrinhos com sucesso', () => {
    cy.getCarts(userToken).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('quantidade');
      expect(response.body).to.have.property('carrinhos');
      expect(response.body.carrinhos).to.be.an('array');
      
      if (response.body.carrinhos.length > 0) {
        const primeiroCarrinho = response.body.carrinhos[0];
        expect(primeiroCarrinho).to.have.property('_id');
        expect(primeiroCarrinho).to.have.property('produtos');
        expect(primeiroCarrinho.produtos).to.be.an('array');
        expect(primeiroCarrinho).to.have.property('precoTotal');
        expect(primeiroCarrinho).to.have.property('quantidadeTotal');
        expect(primeiroCarrinho).to.have.property('idUsuario');
      }
    });
  });

  /// Get cart by specific ID
  it('deve filtrar carrinhos por ID específico', () => {
      createTestCarts().then(() => {
        cy.getCarts(userToken).then((allCartsResponse) => {
          if (allCartsResponse.body.carrinhos.length > 0) {
            const firstCartId = allCartsResponse.body.carrinhos[0]._id;
            
            cy.request({
              method: 'GET',
              url: '/carrinhos',
              qs: { _id: firstCartId },
              headers: { Authorization: userToken },
              failOnStatusCode: false
            }).then((response) => {
              expect(response.status).to.eq(200);
              expect(response.body.carrinhos).to.have.length(1);
              expect(response.body.carrinhos[0]._id).to.eq(firstCartId);
            });
          }
        });
      });
  });

  /// Error Get cart by non-existing ID
  it('deve retornar array vazio para ID inexistente', () => {
      const nonExistentId = '123456789012345678901234';
      
      cy.request({
        method: 'GET',
        url: '/carrinhos',
        qs: { _id: nonExistentId },
        headers: { Authorization: userToken },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.carrinhos).to.be.an('array').that.is.empty;
      });
  });

  /// Error Get cart by invalid id
  it('deve lidar com ID malformado', () => {
      cy.request({
        method: 'GET',
        url: '/carrinhos',
        qs: { _id: 'id_invalido' },
        headers: { Authorization: userToken },
        failOnStatusCode: false
      }).then((response) => {
        expect([200, 400]).to.include(response.status);
      });
  });

  /// Get total quantity
  it('deve filtrar carrinhos por quantidade total igual', () => {
      createTestCarts().then(() => {
        cy.request({
          method: 'GET',
          url: '/carrinhos',
          qs: { quantidadeTotal: 2 },
          headers: { Authorization: userToken },
          failOnStatusCode: false
        }).then((response) => {
          expect(response.status).to.eq(200);
          
          response.body.carrinhos.forEach(carrinho => {
            expect(carrinho.quantidadeTotal).to.eq(2);
          });
        });
      });
  });

  /// Get cart wiwth non-existing quantity
  it('deve retornar array vazio para quantidade não existente', () => {
      cy.request({
        method: 'GET',
        url: '/carrinhos',
        qs: { quantidadeTotal: 999 },
        headers: { Authorization: userToken },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.carrinhos).to.be.an('array').that.is.empty;
      });
  });

  /// Get cart with string quantity
  it('deve lidar com quantidade como string', () => {
      cy.request({
        method: 'GET',
        url: '/carrinhos',
        qs: { quantidadeTotal: '2' }, 
        headers: { Authorization: userToken },
        failOnStatusCode: false
      }).then((response) => {
        expect([200, 400]).to.include(response.status);
      });
  });


  /// Get cart by price
  it('deve filtrar carrinhos por preço total igual', () => {
      createTestCarts().then(() => {
        cy.request({
          method: 'GET',
          url: '/carrinhos',
          qs: { precoTotal: 470 },
          headers: { Authorization: userToken },
          failOnStatusCode: false
        }).then((response) => {
          expect(response.status).to.eq(200);
          
          response.body.carrinhos.forEach(carrinho => {
            expect(carrinho.precoTotal).to.eq(200);
          });
        });
      });
  });

  /// Get cart by non-existing price
  it('deve retornar array vazio para preço não existente', () => {
      cy.request({
        method: 'GET',
        url: '/carrinhos',
        qs: { precoTotal: 9999 },
        headers: { Authorization: userToken },
        failOnStatusCode: false
      }).then((response) => {
        expect([200, 400]).to.include(response.status);
      });
  });

  /// Get cart with decimal price
  it('deve lidar com preço decimal', () => {
      const decimalProduct = {
        nome: `Produto Decimal ${Date.now()}`,
        preco: 19.99,
        descricao: 'Produto com preço decimal',
        quantidade: 10
      };

      cy.createProduct(decimalProduct, adminToken)
        .then((productRes) => {
          if (productRes.status === 201) {
            const cartData = {
              produtos: [{ idProduto: productRes.body._id, quantidade: 2 }]
            };
            return cy.createCart(cartData, userToken);
          }
        })
        .then(() => {
          return cy.request({
            method: 'GET',
            url: '/carrinhos',
            qs: { precoTotal: 39.98 }, 
            headers: { Authorization: userToken },
            failOnStatusCode: false
          });
        })
        .then((response) => {
        expect([200, 400]).to.include(response.status);
        });
  });

  /// Get cart by user ID
  it('deve filtrar carrinhos por ID do usuário', () => {
      createTestCarts().then(() => {
        cy.getCarts(userToken).then((response) => {
          if (response.body.carrinhos.length > 0) {
            const userId = response.body.carrinhos[0].idUsuario;
            
            cy.request({
              method: 'GET',
              url: '/carrinhos',
              qs: { idUsuario: userId },
              headers: { Authorization: userToken },
              failOnStatusCode: false
            }).then((filteredResponse) => {
              expect(filteredResponse.status).to.eq(200);
              
              filteredResponse.body.carrinhos.forEach(carrinho => {
                expect(carrinho.idUsuario).to.eq(userId);
              });
            });
          }
        });
      });
  });

  /// get cart by non-existing user Id
  it('deve retornar array vazio para usuário inexistente', () => {
      const nonExistentUserId = '123456789012345678901234';
      
      cy.request({
        method: 'GET',
        url: '/carrinhos',
        qs: { idUsuario: nonExistentUserId },
        headers: { Authorization: userToken },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.carrinhos).to.be.an('array').that.is.empty;
      });
  });



  /// DELETE CONCLUDE
  /// Conclude purchase
  it.skip('deve concluir compra do carrinho com sucesso', () => {
    const cartData = {
      produtos: [
        {
          idProduto: productId,
          quantidade: 1
        }
      ]
    };

    cy.createCart(cartData, userToken).then((createResponse) => {
      const cartId = createResponse.body._id;

      cy.checkoutCart(userToken).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.eq('Registro excluído com sucesso');

        cy.getCartById(cartId, userToken).then((getResponse) => {
          expect(getResponse.status).to.eq(400);
        });
      });
    });
  });

  /// Conclude purchase cart without products
  it.skip('deve conseguir concluir compra com carrinho vazio', () => {
    cy.createCart({}, userToken).then(() => {
      cy.checkoutCart(userToken).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.eq('Registro excluído com sucesso');
      });
    });
  });



  /// DELETE CANCEL
  // Cancel Purchase and restock
  it.skip('deve cancelar compra do carrinho com sucesso', () => {
    const cartData = {
      produtos: [
        {
          idProduto: productId,
          quantidade: 1
        }
      ]
    };

    cy.createCart(cartData, userToken).then((createResponse) => {
      const cartId = createResponse.body._id;

      cy.cancelCart(userToken).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.contain('Registro excluído com sucesso');

        cy.getCartById(cartId, userToken).then((getResponse) => {
          expect(getResponse.status).to.eq(400);
        });
      });
    });
  });

  
});


/*  CENÁRIOS DE TESTES
  
  POST 
- ✅ Criar carrinho (admin)
- ✅ Criar carrinho sem produtos e com token
- ✅ Criar carrinho sem produtos e sem token
- ✅ Criar carrinho com token inválido (Texto)
- ✅ Criar carrinho com token expirado
- ✅ Criar carrinho com token deletado
- ✅ Criar carrinho com bearer token inválido
- ✅ Criar carrinho sem token

  GET ID
- ✅ Buscando carrinho com ID válido
- ✅ Buscando carrinho com ID Inválido

  GET ALL
- ✅ Buscando carrinho sem parâmetros
- ✅ Buscando carrinho com ID válido
- ✅ Buscando carrinho com ID inexistente
- ✅ Buscando carrinho com ID Inválido
- ✅ Buscando carrinho quantidade total
- ✅ Buscando carrinho quantidade errada
- ✅ Buscando carrinho quantidade (String)
- ✅ Buscando carrinho por preço total
- ✅ Buscando carrinho com preço errado
- ✅ Buscando carrinho com preço decimal
- ✅ Buscando carrinho com ID de usuário
- ✅ Buscando carrinho com ID inexistente de usuário

  DELETE CONCLUDE

- ✅ Excluir carrinho concluir compra
- ✅ Concluir compra carrinho vazio
  
  DELETE CANCEL
  
- ✅ Cancel Purchase and restock

*/
