describe('Страница конструктора бургера', () => {
  afterEach(() => {
    cy.clearCookie('accessToken');
    cy.clearLocalStorage('refreshToken');
  });

  beforeEach(() => {
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
  });

  it('добавляет булку и начинку в конструктор', () => {
    cy.visit('/');
    cy.wait('@getIngredients');

    cy.get('[data-cy="ingredient-card-bun-1"]')
      .contains('button', 'Добавить')
      .click();

    cy.get('[data-cy="ingredient-card-main-1"]')
      .contains('button', 'Добавить')
      .click();

    cy.get('[data-cy="burger-constructor"]').within(() => {
      cy.contains('Флюоресцентная булка R2-D3 (верх)').should('exist');
      cy.contains('Флюоресцентная булка R2-D3 (низ)').should('exist');
      cy.contains('Биокотлета из марсианской Магнолии').should('exist');
    });
  });

  it('открывает модалку ингредиента и закрывает по крестику', () => {
    cy.visit('/');
    cy.wait('@getIngredients');

    cy.get('[data-cy="ingredient-link-main-1"]').click();

    cy.get('[data-cy="modal"]').should('be.visible');
    cy.get('[data-cy="ingredient-name"]').should(
      'contain',
      'Биокотлета из марсианской Магнолии'
    );

    cy.get('[data-cy="modal-close"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');
  });

  it('закрывает модалку ингредиента по клику на оверлей', () => {
    cy.visit('/');
    cy.wait('@getIngredients');

    cy.get('[data-cy="ingredient-link-sauce-1"]').click();

    cy.get('[data-cy="modal"]').should('be.visible');
    cy.get('[data-cy="modal-overlay"]').click({ force: true });
    cy.get('[data-cy="modal"]').should('not.exist');
  });

  it('создает заказ, показывает номер и очищает конструктор', () => {
    cy.intercept('GET', '**/auth/user', { fixture: 'user.json' }).as('getUser');
    cy.intercept('POST', '**/orders', { fixture: 'order.json' }).as(
      'createOrder'
    );

    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('refreshToken', 'test-refresh-token');
        win.document.cookie = 'accessToken=test-access-token';
      }
    });

    cy.wait('@getIngredients');
    cy.wait('@getUser');

    cy.get('[data-cy="ingredient-card-bun-1"]')
      .contains('button', 'Добавить')
      .click();

    cy.get('[data-cy="ingredient-card-main-1"]')
      .contains('button', 'Добавить')
      .click();

    cy.contains('button', 'Оформить заказ').click();
    cy.wait('@createOrder');

    cy.get('[data-cy="modal"]').should('be.visible');
    cy.get('[data-cy="order-number"]').should('contain', '12345');

    cy.get('[data-cy="modal-close"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');

    cy.get('[data-cy="burger-constructor"]').within(() => {
      cy.contains('Выберите булки').should('exist');
      cy.contains('Выберите начинку').should('exist');
    });

  });
});