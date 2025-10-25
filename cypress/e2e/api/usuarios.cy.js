describe('API Usuários - ServeRest', () => {
  let authToken;
  let userId;

  before(() => {
    // Login para obter token
    cy.login('beltrano@qa.com', 'teste').then((response) => {
      authToken = response.body.authorization;
    });
  });

  // Helper para gerar dados de usuário
  const createUserData = () => ({
    nome: `Usuario ${Date.now()}`,
    email: `test${Date.now()}@qa.com`,
    password: "teste123",
    administrador: "true"
  });

  /// POST ///
  /// Create User
  it('deve criar um usuário válido com sucesso @users', () => {
    const userData = createUserData();

    cy.createUser(userData).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('_id');
      expect(response.body.message).to.eq('Cadastro realizado com sucesso');
      
      userId = response.body._id;
    });
  });

  /// Error creating user with email already used 
  it('deve retornar erro ao criar usuário com email duplicado @users', () => {
    const userData = createUserData();

    cy.createUser(userData).then(() => {
      cy.createUser(userData).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.message).to.eq('Este email já está sendo usado');
      });
    });
  });

  /// Error creating User without name
  it('deve retornar erro ao criar usuário sem nome @users', () => {
    const userData = {
      email: `test${Date.now()}@qa.com`,
      password: "teste123",
      administrador: "true"
    };

    cy.createUser(userData).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property('nome', 'nome é obrigatório');
    });
  });

  /// Error creating User without email
  it('deve retornar erro ao criar usuário sem email @users', () => {
    const userData = {
      nome: `Usuario ${Date.now()}`,
      password: "teste123", 
      administrador: "true"
    };

    cy.createUser(userData).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property('email', 'email é obrigatório');
    });
  });

  /// Error creating User without password
  it('deve retornar erro ao criar usuário sem senha @users', () => {
    const userData = {
      nome: `Usuario ${Date.now()}`,
      email: `test${Date.now()}@qa.com`,
      administrador: "true"
    };

    cy.createUser(userData).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property('password', 'password é obrigatório');
    });
  });





  /// GET ///
  /// Get user by ID
  it('deve buscar usuário existente por ID @users', () => {
    const userData = createUserData();

    cy.createUser(userData).then((createResponse) => {
      const testUserId = createResponse.body._id;
      
      cy.getUser(testUserId).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body._id).to.eq(testUserId);
        expect(response.body.nome).to.eq(userData.nome);
      });
    });
  });

  /// Error get filtered by non-existing ID
  it('deve retornar erro ao buscar usuário com ID inexistente @users', () => {
    const invalidId = '1234567890121234';

    cy.getUser(invalidId).then((response) => {
      cy.log('Response status:', response.status);
      cy.log('Response body:', JSON.stringify(response.body));
      
      expect(response.status).to.eq(400);
      
      if (response.body.message) {
        expect(response.body.message).to.include('Usuário não encontrado');
      } else if (response.body.error) {
        expect(response.body.error).to.include('Usuário não encontrado');
      } else {
        expect(JSON.stringify(response.body)).to.include('Usuário não encontrado');
      }
    });
  });

  /// Error get filtered by invalid text ID
  it('deve retornar erro ao buscar usuário com ID inválido @users', () => {
    const invalidId = 'id_invalido';

    cy.getUser(invalidId).then((response) => {
    
      expect(response.status).to.eq(400);
      expect(JSON.stringify(response.body)).to.include('id deve ter exatamente 16 caracteres alfanuméricos');
      
    });
  });

  /// Get all users
  it('deve listar todos os usuários cadastrados @users @listusers', () => {
    cy.getAllUsers().then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('quantidade');
      expect(response.body).to.have.property('usuarios');
      expect(response.body.usuarios).to.be.an('array');
    });
  });






  /// PUT
  /// Edit User
  it('deve editar usuário existente com sucesso @users', () => {
    const userData = createUserData();

    cy.createUser(userData).then((createResponse) => {
      const userIdToUpdate = createResponse.body._id;
      const updatedData = {
        nome: "Nome Atualizado",
        email: `updated${Date.now()}@qa.com`,
        password: "teste123",
        administrador: "true"
      };

      cy.updateUser(userIdToUpdate, updatedData).then((updateResponse) => {
        expect(updateResponse.status).to.eq(200);

        expect(updateResponse.body).to.satisfy((body) => {
          return body.message === 'Registro alterado com sucesso' ||
                 body.message === 'Cadastro realizado com sucesso' ||
                 JSON.stringify(body).includes('alterado') ||
                 JSON.stringify(body).includes('sucesso');
        });

        cy.getUser(userIdToUpdate).then((getResponse) => {
          expect(getResponse.body.nome).to.eq(updatedData.nome);
        });
      });
    });
  });


  /// DELETE
  /// Delete user
  it('deve excluir usuário existente com sucesso @users', () => {
    const userData = createUserData();

    cy.createUser(userData).then((createResponse) => {
      const userIdToDelete = createResponse.body._id;

      cy.deleteUser(userIdToDelete).then((deleteResponse) => {
        expect(deleteResponse.status).to.eq(200);
        expect(deleteResponse.body).to.satisfy((body) => {
          return body.message === 'Registro excluído com sucesso' ||
                 body.message === 'Nenhum registro excluído' ||
                 JSON.stringify(body).includes('excluído');
        });

        cy.getUser(userIdToDelete).then((getResponse) => {
          expect(getResponse.status).to.eq(400);
        });
      });
    });
  });

  /// Error deleting user non-existing 
  it('deve retornar mensagem ao tentar excluir usuário não existente @users', () => {
    const nonExistentId = '123456789012345678901234';

    cy.deleteUser(nonExistentId).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.satisfy((body) => {
        return body.message === 'Nenhum registro excluído' ||
               body.message === 'Registro excluído com sucesso' ||
               JSON.stringify(body).includes('excluído') ||
               JSON.stringify(body).includes('Nenhum');
      });
    });
  });
});






/*
TAGS:

@users - Gerais
@listusers - Get All Users



*/

/*  CENÁRIOS DE TESTES
 
  POST 
- ✅ Criar usuário válido
- ✅ Criar usuário com email já existente
- ✅ Criar usuário com campos faltando (Sem Nome, Email, Senha)

  GET
- ✅ Buscar usuário por ID
- ✅ Buscar usuário não existente (Id inexistente e inválido)
- ✅ Listar todos os usuários

  PUT
- ✅ Editar usuário

  DELETE
- ✅ Excluir usuário
- ✅ Tentar excluir usuário não existente

*/