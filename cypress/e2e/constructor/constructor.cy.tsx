describe('Интеграционные тесты на Cypress', () => {
  beforeEach(() => {
    cy.intercept('GET', `api/ingredients`, {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.visit('http://localhost:4000');
  });

  it('Добавление ингредиента, булок, начинок из списка в конструктор', () => {
    cy.wait('@getIngredients');

    cy.get('[data-cy-ingredient="bun"]').find('button').eq(0).click();
    cy.get('[data-cy-ingredient="main"]').find('button').eq(0).click();
    cy.get('[data-cy-ingredient="sauce"]').find('button').eq(0).click();

    cy.get('[data-cy-constructor="bun-up"]')
      .find('.constructor-element__text')
      .should('have.text', 'Краторная булка N-200i (верх)');

    cy.get('[data-cy-constructor="bun-bottom"]')
      .find('.constructor-element__text')
      .should('have.text', 'Краторная булка N-200i (низ)');

    cy.get('[data-cy-constructor="main"]')
      .find('.constructor-element__text')
      .should('have.text', 'Биокотлета из марсианской Магнолии');

    cy.get('[data-cy-constructor="sauce"]')
      .find('.constructor-element__text')
      .should('have.text', 'Соус Spicy-X');
  });

  describe('Работа модальных окон', () => {
    it('Открытие модального окна ингредиента', () => {
      cy.get('[data-cy-ingredient="modal-link"]').eq(0).click();

      cy.get('[id="modals"]').should('be.visible');
      cy.get('[id="modals"]')
        .find('[data-cy-ingredient="modal-details-name"]')
        .should('have.text', 'Краторная булка N-200i');
    });

    it('Закрытие по клику на крестик', () => {
      cy.get('[data-cy-ingredient="modal-link"]').eq(0).click();

      cy.get('[id="modals"]')
        .find('[data-cy-modal="modal-close"]')
        .click();

      cy.get('[id="modals"]').should('not.be.visible');
    });

    it('Закрытие по клику на оверлей', () => {
      cy.get('[data-cy-ingredient="modal-link"]').eq(0).click();

      cy.get('body').click(0, 0);

      cy.get('[id="modals"]').should('not.be.visible');
    });
  });

  describe('Создание заказа:', () => {
    beforeEach(() => {
      cy.intercept('POST', `api/auth/token`).as('refreshToken');
      
      cy.intercept('GET', `api/auth/user`, {
        fixture: 'auth_user.json'
      }).as('getUser');
  
      cy.intercept('POST', `api/orders`, {
        fixture: 'send_order.json'
      }).as('sendOrder');
      
      cy.setCookie('accessToken', 'mockAccessToken');
      cy.visit('http://localhost:4000');
    });

    it('Сборка бургера и отправка заказа', () => {
      cy.wait('@getUser');

      cy.get('[data-cy-ingredient="bun"]').find('button').eq(0).click();
      cy.get('[data-cy-ingredient="main"]').find('button').eq(0).click();
      cy.get('[data-cy-ingredient="sauce"]').find('button').eq(0).click();

      cy.contains('button', 'Оформить заказ').click();
      cy.wait('@sendOrder');

      cy.get('[id="modals"]').should('be.visible');

      cy.get('[data-cy="order-details-number"]').should('have.text', '67895');

      cy.get('[id="modals"]')
        .find('[data-cy-modal="modal-close"]')
        .click();
        
      cy.get('[id="modals"]').should('not.be.visible');

      cy.get('[data-cy-constructor="bun-up"]').should('not.exist');
      cy.get('[data-cy-constructor="bun-bottom"]').should('not.exist');
      cy.get('[data-cy-constructor="main"]').should('not.exist');
      cy.get('[data-cy-constructor="sauce"]').should('not.exist');
    });
  })
});
