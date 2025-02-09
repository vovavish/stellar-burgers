describe('Интеграционные тесты на Cypress', () => {
  beforeEach(() => {
    cy.intercept('GET', `api/ingredients`, {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.visit('/');
  });

  it('Добавление ингредиента, булок, начинок из списка в конструктор', () => {
    cy.wait('@getIngredients');

    cy.addIngredient('bun', 0);
    cy.addIngredient('main', 0);
    cy.addIngredient('sauce', 0);

    cy.checkConstructorItem('bun-up', 'Краторная булка N-200i (верх)');
    cy.checkConstructorItem('bun-bottom', 'Краторная булка N-200i (низ)');
    cy.checkConstructorItem('main', 'Биокотлета из марсианской Магнолии');
    cy.checkConstructorItem('sauce', 'Соус Spicy-X');
  });

  describe('Работа модальных окон', () => {
    it('Открытие модального окна ингредиента', () => {
      cy.get('[data-cy-ingredient="modal-link"]').eq(0).click();

      cy.get('[id="modals"]').as('modalWindow').should('be.visible');
      cy.get('@modalWindow')
        .find('[data-cy-ingredient="modal-details-name"]')
        .should('have.text', 'Краторная булка N-200i');
    });

    it('Закрытие по клику на крестик', () => {
      cy.get('[data-cy-ingredient="modal-link"]').eq(0).click();
      
      cy.closeModalByButton();
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

      cy.visit('/');
    });

    it('Сборка бургера и отправка заказа', () => {
      cy.wait('@getUser');

      cy.addIngredient('bun', 0);
      cy.addIngredient('main', 0);
      cy.addIngredient('sauce', 0);

      cy.contains('button', 'Оформить заказ').click();

      cy.wait('@sendOrder');

      cy.get('[id="modals"]').as('modalWindow').should('be.visible');

      cy.get('[data-cy="order-details-number"]').should('have.text', '67895');

      cy.closeModalByButton();

      cy.get('[data-cy-constructor="bun-up"]').should('not.exist');
      cy.get('[data-cy-constructor="bun-bottom"]').should('not.exist');
      cy.get('[data-cy-constructor="main"]').should('not.exist');
      cy.get('[data-cy-constructor="sauce"]').should('not.exist');
    });
  })
});
