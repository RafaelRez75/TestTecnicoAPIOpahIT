# 📚 Documentação dos Testes - API ServeRest

## 📋 Visão Geral

Esta suíte de testes automatizados valida a API ServeRest, cobrindo endpoints de **Usuários**, **Produtos** e **Carrinhos**. Os testes são implementados em Cypress e seguem padrões de BDD (Behavior-Driven Development).

---

## 🚀 Como Executar os Testes

### Pré-requisitos
```bash
# Instalar dependências
npm install

# Instalar Cypress (se necessário)
npm install cypress --save-dev

# Executar todos os testes
npx cypress run

# Executar testes em modo interativo
npx cypress open

# Executar testes específicos por tag
npx cypress run --env grepTags="@users"
npx cypress run --env grepTags="@products" 
npx cypress run --env grepTags="@carts"

# Executar arquivos específicos
npx cypress run --spec "cypress/e2e/api/users.cy.js"
npx cypress run --spec "cypress/e2e/api/products.cy.js"
npx cypress run --spec "cypress/e2e/api/carts.cy.js"



🏗️ Estrutura dos Testes
Arquivos Principais
text
cypress/
├── e2e/
│   ├── api/
│   │   ├── users.cy.js      # Testes de Usuários
│   │   ├── products.cy.js   # Testes de Produtos  
│   │   └── carts.cy.js      # Testes de Carrinhos
│   └── support/
│       └── commands.js      # Commands personalizados





## 📊 Casos de Teste Implementados

### 🔐 USUÁRIOS (`users.cy.js`)

#### **POST /usuarios - Criação**
| Cenário | Status Esperado | Validações |
|---------|-----------------|------------|
| Criar usuário válido | 201 | ID gerado, mensagem de sucesso |
| Email duplicado | 400 | Mensagem de email em uso |
| Sem nome | 400 | Campo obrigatório |
| Sem email | 400 | Campo obrigatório |
| Sem senha | 400 | Campo obrigatório |

#### **GET /usuarios - Consulta**
| Cenário | Status Esperado | Validações |
|---------|-----------------|------------|
| Buscar por ID existente | 200 | Dados do usuário |
| ID inexistente | 400 | Usuário não encontrado |
| ID inválido | 400 | Formato inválido |
| Listar todos | 200 | Array de usuários |

#### **PUT /usuarios - Atualização**
| Cenário | Status Esperado | Validações |
|---------|-----------------|------------|
| Editar usuário | 200 | Dados atualizados |

#### **DELETE /usuarios - Exclusão**
| Cenário | Status Esperado | Validações |
|---------|-----------------|------------|
| Excluir usuário | 200 | Registro excluído |
| Usuário não existe | 200 | Nenhum registro excluído |

---

### 🛍️ PRODUTOS (`products.cy.js`)

#### **POST /produtos - Criação**
| Cenário | Status Esperado | Validações |
|---------|-----------------|------------|
| Criar produto (admin) | 201 | Produto criado com sucesso |
| Sem autenticação | 401 | Token ausente/inválido |
| Sem nome | 400 | Campo obrigatório |
| Preço zero | 400 | Preço deve ser positivo |
| Quantidade negativa | 400 | Quantidade inválida |

#### **GET /produtos - Consulta**  
| Cenário | Status Esperado | Validações |
|---------|-----------------|------------|
| Buscar por ID | 200 | Dados completos do produto |
| Listar todos | 200 | Array com estrutura correta |
| Filtrar por nome (existente) | 200 | Produtos encontrados |
| Filtrar por nome (inexistente) | 200 | Array vazio |
| ID inexistente | 400 | Produto não encontrado |

#### **PUT /produtos - Atualização**
| Cenário | Status Esperado | Validações |
|---------|-----------------|------------|
| Editar produto (admin) | 200 | Dados atualizados |
| Sem autenticação | 401 | Token ausente |

#### **DELETE /produtos - Exclusão**
| Cenário | Status Esperado | Validações |
|---------|-----------------|------------|
| Excluir produto (admin) | 200 | Produto excluído |
| Sem autenticação | 401 | Token ausente |
| Buscar produto excluído | 400 | Produto não encontrado |

---

### 🛒 CARRINHOS (`carts.cy.js`)

#### **POST /carrinhos - Criação**
| Cenário | Status Esperado | Validações |
|---------|-----------------|------------|
| Criar carrinho com produtos | 201 | Carrinho criado com produtos |
| Carrinho vazio com token | 400 | Produtos obrigatório |
| Sem token | 401 | Token ausente |
| Token inválido (texto) | 401 | Token inválido |
| Token expirado | 401 | Token expirado |
| Token de usuário deletado | 401 | Usuário não existe |
| Bearer token inválido | 401 | Formato incorreto |
| Token vazio | 401 | Token ausente |
| Token com caracteres especiais | 401 | Token inválido |

#### **GET /carrinhos/{id} - Consulta por ID**
| Cenário | Status Esperado | Validações |
|---------|-----------------|------------|
| ID válido | 200 | Dados do carrinho |
| ID inexistente | 400 | Carrinho não encontrado |

#### **GET /carrinhos - Consulta com Filtros**
| Cenário | Status Esperado | Validações |
|---------|-----------------|------------|
| Sem parâmetros | 200 | Todos os carrinhos |
| Filtrar por ID válido | 200 | Carrinho específico |
| ID inexistente | 200 | Array vazio |
| ID malformado | 200/400 | Comportamento esperado |
| Por quantidade total | 200 | Carrinhos com quantidade específica |
| Quantidade não existente | 200 | Array vazio |
| Quantidade como string | 200/400 | Conversão ou erro |
| Por preço total | 200 | Carrinhos com preço específico |
| Preço não existente | 200/400 | Array vazio ou erro |
| Preço decimal | 200/400 | Suporte a decimais |
| Por ID usuário | 200 | Carrinhos do usuário |
| Usuário inexistente | 200 | Array vazio |

#### **DELETE /carrinhos/concluir-compra - Finalização**
| Cenário | Status Esperado | Validações |
|---------|-----------------|------------|
| Concluir compra | 200 | Compra finalizada |
| Carrinho vazio | 200 | Operação permitida |

#### **DELETE /carrinhos/cancelar-compra - Cancelamento**
| Cenário | Status Esperado | Validações |
|---------|-----------------|------------|
| Cancelar compra | 200 | Compra cancelada |

---

## 🔧 Commands Personalizados

### Usuários
```javascript
cy.createUser(userData)
cy.getUser(userId)  
cy.updateUser(userId, userData)
cy.deleteUser(userId)
cy.getAllUsers()


### Produtos
- `cy.createProduct(productData, authToken)`
- `cy.getProduct(productId)`
- `cy.updateProduct(productId, productData, authToken)`  
- `cy.deleteProduct(productId, authToken)`
- `cy.getAllProducts(queryParams)`

### Carrinhos
- `cy.createCart(cartData, authToken)`
- `cy.getCartById(cartId, authToken)`
- `cy.getCarts(authToken)`
- `cy.checkoutCart(authToken)`
- `cy.cancelCart(authToken)`

### Autenticação
- `cy.login(email, password)`

---

## 🎯 Estratégia de Teste

### Cobertura por Tipo de Teste

**Testes Positivos**
- Fluxos de sucesso para todas as operações CRUD
- Criação de recursos com dados válidos
- Consultas com filtros válidos

**Testes Negativos** 
- Validações de campos obrigatórios
- Restrições de negócio (email único, preço positivo, etc.)
- Casos de erro esperados

**Testes de Segurança**
- Autenticação e autorização
- Validação de tokens (expirado, inválido, ausente)
- Acesso a recursos sem permissão

**Testes de Dados**
- Estrutura de respostas
- Tipos de dados
- Filtros e consultas

### Padrões Implementados

1. **Setup Isolado**
   - Dados únicos por teste usando `Date.now()`
   - Tokens frescos para evitar expiração
   - Cleanup automático de recursos

2. **Asserts Robusto**
```javascript
   // Para APIs com respostas variáveis
   expect(response.body).to.satisfy((body) => {
     return body.message.includes('sucesso') || 
            body.message.includes('realizado')
   })

   ## Validações Específicas

- Estrutura de dados
- Mensagens de erro
- Códigos de status HTTP
- Tipos de dados

## Organização por Tags

- `@users`, `@products`, `@carts` para categorização
- `@listusers` para operações específicas

## 📈 Métricas de Cobertura

| Módulo | Cenários | Cobertura |
|--------|----------|-----------|
| **Usuários** | 12 cenários | CRUD completo + validações |
| **Produtos** | 14 cenários | CRUD + autenticação + filtros |
| **Carrinhos** | 25+ cenários | CRUD + autenticação + filtros + operações |
| **Total** | **51+ cenários** | Cobertura abrangente |

## 🐛 Solução de Problemas Comuns

### Token Expirado

```javascript
// Usar beforeEach para token fresco
beforeEach(() => {
  const userData = {
    nome: `User ${Date.now()}`,
    email: `user${Date.now()}@qa.com`,
    password: "teste123",
    administrador: "false"
  };

  cy.createUser(userData)
    .then(() => cy.login(userData.email, userData.password))
    .then((loginRes) => {
      userToken = loginRes.body.authorization;
    });
});

### Dados Duplicados

```javascript
// Usar timestamps para unicidade
const createProductData = () => ({
  nome: `Produto ${Date.now()}`,
  preco: 100,
  descricao: 'Descrição do produto teste',
  quantidade: 50
});

### Debug de Respostas

```javascript
// Logar respostas para debugging
cy.getUser(invalidId).then((response) => {
  cy.log('Response status:', response.status);
  cy.log('Response body:', JSON.stringify(response.body));
  // ... asserts
});


### Asserts Flexíveis para Mensagens Variáveis

```javascript
// Para diferentes formatos de mensagem
const successMessage = response.body.message || response.body.descricao;
expect(successMessage).to.include('sucesso');