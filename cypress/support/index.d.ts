
/// <reference types="cypress" />

declare namespace Cypress {
  import { TTabMode } from '@utils-types';

  interface Chainable {
    addIngredient(ingredientType: TTabMode, index: number): void;
    checkConstructorItem(type: "bun-up" | "bun-bottom" | "main" | "sauce", text: string): void;
    closeModalByButton(): void;
  }
}
