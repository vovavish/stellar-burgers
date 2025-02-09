import { TConstructorIngredient, TIngredient } from '@utils-types';
import {
  ingredients,
  ingredientsSliceInitialState,
  setIngredientById,
  addIngridientInOrder,
  resetIngredients,
  removeIngridientInOrder,
  moveIngridientInDirection,
  getIngredientsThunk
} from './ingredientsSlice';

import { mockIngredients } from './ingredientsMock';

describe('[ingredientsSlice] reducers', () => {
  const stateWithIngredients = {
    ...ingredientsSliceInitialState,
    ingredients: mockIngredients
  };

  const mockIngredientsWithId = [
    { id: 'id_1', ...mockIngredients[1] },
    { id: 'id_2', ...mockIngredients[2] },
    { id: 'id_3', ...mockIngredients[3] }
  ];

  const stateWithIngredientsAndConstructor = {
    ...stateWithIngredients,
    constructorItems: {
      ingredients: mockIngredientsWithId,
      bun: { id: 'test_id_0', ...mockIngredients[0] }
    }
  };

  describe('Редьюсер setIngredientById', () => {
    it('Выбор ингредиента, когда ингредиенты есть', () => {
      const newState = ingredients(
        stateWithIngredients,
        setIngredientById('test_id_1')
      );

      expect(newState.selectedIngredient).toEqual(mockIngredients[0]);
    });

    it('Выбор ингредиента, когда ингредиентов нет', () => {
      const state = {
        ...ingredientsSliceInitialState
      };

      const newState = ingredients(state, setIngredientById('test_id_1'));

      expect(newState.selectedIngredient).toEqual(
        ingredientsSliceInitialState.selectedIngredient
      );
    });

    it('Выбор ингредиента, которого нет', () => {
      const newState = ingredients(
        stateWithIngredients,
        setIngredientById('test_id_unknown')
      );

      expect(newState.selectedIngredient).toEqual(null);
    });
  });

  describe('Редьюсер addIngridientInOrder', () => {
    it('Добавление ингредиента с типом bun', () => {
      const newState = ingredients(
        stateWithIngredients,
        addIngridientInOrder(mockIngredients[0])
      );

      expect(newState.constructorItems.bun).not.toEqual(
        ingredientsSliceInitialState.constructorItems.bun
      );
      expect(newState.constructorItems.bun?.id).toBeDefined();

      const { id, ...expectedBun } = newState.constructorItems.bun!;

      expect(expectedBun).toEqual(mockIngredients[0]);
    });

    it('Добавление ингредиента с типом main', () => {
      const newState = ingredients(
        stateWithIngredients,
        addIngridientInOrder(mockIngredients[1])
      );

      expect(newState.constructorItems.ingredients).not.toEqual(
        ingredientsSliceInitialState.constructorItems.ingredients
      );
      expect(newState.constructorItems.ingredients[0].id).toBeDefined();

      const { id, ...expectedMainIngredient } =
        newState.constructorItems.ingredients[0];

      expect(expectedMainIngredient).toEqual(mockIngredients[1]);
    });

    it('Добавление ингредиента с типом sauce', () => {
      const newState = ingredients(
        stateWithIngredients,
        addIngridientInOrder(mockIngredients[2])
      );

      expect(newState.constructorItems.ingredients).not.toEqual(
        ingredientsSliceInitialState.constructorItems.ingredients
      );
      expect(newState.constructorItems.ingredients[0].id).toBeDefined();

      const { id, ...expectedSauceIngredient } =
        newState.constructorItems.ingredients[0];

      expect(expectedSauceIngredient).toEqual(mockIngredients[2]);
    });

    it('Добавление четырех ингредиентов с типами bun, bun, main, sauce', () => {
      let newState = ingredients(
        stateWithIngredients,
        addIngridientInOrder(mockIngredients[0])
      );
      newState = ingredients(
        newState,
        addIngridientInOrder(mockIngredients[1])
      );
      newState = ingredients(
        newState,
        addIngridientInOrder(mockIngredients[2])
      );
      newState = ingredients(
        newState,
        addIngridientInOrder(mockIngredients[3])
      );

      const { id: bunId, ...expectedBun } = newState.constructorItems.bun!;

      expect(expectedBun).toEqual(mockIngredients[3]);

      const { id: ingredient0Id, ...expectedIngredient0 } =
        newState.constructorItems.ingredients[0];
      const { id: ingredient1Id, ...expectedIngredient1 } =
        newState.constructorItems.ingredients[1];

      expect([expectedIngredient0, expectedIngredient1]).toEqual([
        mockIngredients[1],
        mockIngredients[2]
      ]);
    });
  });

  it('Редьюсер resetIngredients', () => {
    const resetedIngredientsState = ingredients(
      stateWithIngredientsAndConstructor,
      resetIngredients()
    );

    expect(resetedIngredientsState.constructorItems).toEqual(
      ingredientsSliceInitialState.constructorItems
    );
  });

  it('Редьюсер removeIngridientInOrder', () => {
    const newState = ingredients(
      stateWithIngredientsAndConstructor,
      removeIngridientInOrder(mockIngredientsWithId[0])
    );

    expect(newState.constructorItems.ingredients).toEqual([
      mockIngredientsWithId[1],
      mockIngredientsWithId[2]
    ]);
  });

  describe('Редьюсер moveIngridientInDirection', () => {
    it('Двигаем самый верхний ингредиент вверх', () => {
      const newState = ingredients(
        stateWithIngredientsAndConstructor,
        moveIngridientInDirection({
          ingredient: mockIngredientsWithId[0],
          direction: 'up'
        })
      );

      expect(newState.constructorItems.ingredients).toEqual(
        mockIngredientsWithId
      );
    });

    it('Двигаем НЕ верхний ингредиент вверх', () => {
      const newState = ingredients(
        stateWithIngredientsAndConstructor,
        moveIngridientInDirection({
          ingredient: mockIngredientsWithId[2],
          direction: 'up'
        })
      );

      expect(newState.constructorItems.ingredients).toEqual([
        mockIngredientsWithId[0],
        mockIngredientsWithId[2],
        mockIngredientsWithId[1],
      ]);
    });

    it('Двигаем самый нижний ингредиент вниз', () => {
      const newState = ingredients(
        stateWithIngredientsAndConstructor,
        moveIngridientInDirection({
          ingredient: mockIngredientsWithId[2],
          direction: 'down'
        })
      );

      expect(newState.constructorItems.ingredients).toEqual(
        mockIngredientsWithId
      );
    });

    it('Двигаем НЕ самый нижний ингредиент вниз', () => {
      const newState = ingredients(
        stateWithIngredientsAndConstructor,
        moveIngridientInDirection({
          ingredient: mockIngredientsWithId[0],
          direction: 'down'
        })
      );

      expect(newState.constructorItems.ingredients).toEqual([
        mockIngredientsWithId[1],
        mockIngredientsWithId[0],
        mockIngredientsWithId[2],
      ]);
    });
  });
});

describe('[ingredientsSlice] async thunk actions', () => {
  describe('getIngredientsThunk', () => {
    it('getIngredientsThunk.pending', () => {
      const nextState = ingredients(
        ingredientsSliceInitialState,
        getIngredientsThunk.pending('requestId')
      );

      expect(nextState.isIngredientsLoading).toBe(true);
    });

    it('getIngredientsThunk.rejected', () => {
      const nextState = ingredients(
        ingredientsSliceInitialState,
        getIngredientsThunk.rejected(new Error('Error'), 'requestId')
      );

      expect(nextState.isIngredientsLoading).toBe(false);
    });

    it('getIngredientsThunk.fulfilled', () => {
      const nextState = ingredients(
        ingredientsSliceInitialState,
        getIngredientsThunk.fulfilled(mockIngredients, 'requestId')
      );

      expect(nextState.isIngredientsLoading).toBe(false);
      expect(nextState.ingredients).toEqual(mockIngredients);
    });
  });
});
