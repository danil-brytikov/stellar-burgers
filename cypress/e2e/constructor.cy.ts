const SELECTORS = {
  ingredientCardBun: '[data-cy="ingredient-card-bun-1"]',
  ingredientCardMain: '[data-cy="ingredient-card-main-1"]',
  burgerConstructor: '[data-cy="burger-constructor"]',
  ingredientLinkMain1: '[data-cy="ingredient-link-main-1"]',
  modal: '[data-cy="modal"]',
  ingredientName: '[data-cy="ingredient-name"]',
  modalClose: '[data-cy="modal-close"]',
  overlay: '[data-cy="modal-overlay"]',
  orderNumber: '[data-cy="order-number"]',
};

describe('Страница конструктора бургера', () => {
  afterEach(() => {
    cy.clearCookie('accessToken');
    cy.clearLocalStorage('refreshToken');
  });

  beforeEach(() => {
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
  });

  it('добавляет булку и начинку в конструктор', () => {
    cy.visit('/');
    cy.wait('@getIngredients');

    cy.get(SELECTORS.ingredientCardBun)
      .contains('button', 'Добавить')
      .click();

    cy.get(SELECTORS.ingredientCardMain)
      .contains('button', 'Добавить')
      .click();

    cy.get(SELECTORS.burgerConstructor).within(() => {
      cy.contains('Флюоресцентная булка R2-D3 (верх)').should('exist');
      cy.contains('Флюоресцентная булка R2-D3 (низ)').should('exist');
      cy.contains('Биокотлета из марсианской Магнолии').should('exist');
    });
  });

  it('открывает модалку ингредиента и закрывает по крестику', () => {
    cy.visit('/');
    cy.wait('@getIngredients');

    cy.get(SELECTORS.ingredientLinkMain1).click();

    cy.get(SELECTORS.modal).should('be.visible');
    cy.get(SELECTORS.ingredientName).should(
      'contain',
      'Биокотлета из марсианской Магнолии'
    );

    cy.get(SELECTORS.modalClose).click();
    cy.get(SELECTORS.modal).should('not.exist');
  });

  it('закрывает модалку ингредиента по клику на оверлей', () => {
    cy.visit('/');
    cy.wait('@getIngredients');

    cy.get('[data-cy="ingredient-link-sauce-1"]').click();

    cy.get(SELECTORS.modal).should('be.visible');
    cy.get(SELECTORS.overlay).click({ force: true });
    cy.get(SELECTORS.modal).should('not.exist');
  });

  it('создает заказ, показывает номер и очищает конструктор', () => {
    cy.intercept('GET', '**/auth/user', { fixture: 'user.json' }).as('getUser');
    cy.intercept('POST', '**/orders', { fixture: 'order.json' }).as('createOrder');

    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('refreshToken', 'test-refresh-token');
        win.document.cookie = 'accessToken=test-access-token';
      }
    });

    cy.wait('@getIngredients');
    cy.wait('@getUser');

    cy.get(SELECTORS.ingredientCardBun)
      .contains('button', 'Добавить')
      .click();

    cy.get(SELECTORS.ingredientCardMain)
      .contains('button', 'Добавить')
      .click();

    cy.contains('button', 'Оформить заказ').click();
    cy.wait('@createOrder');

    cy.get(SELECTORS.modal).should('be.visible');
    cy.get(SELECTORS.orderNumber).should('contain', '12345');

    cy.get(SELECTORS.modalClose).click();
    cy.get(SELECTORS.modal).should('not.exist');

    cy.get(SELECTORS.burgerConstructor).within(() => {
      cy.contains('Выберите булки').should('exist');
      cy.contains('Выберите начинку').should('exist');
    });
  });
});