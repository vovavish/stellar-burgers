import { configureStore } from '@reduxjs/toolkit';

import {
  userSliceInitialState,
  ingredientsSliceInitialState,
  orderSliceInitialState
} from './slices';
import { rootReducer } from './store';

describe('Инициализация rootReducer', () => {
  it('Инициализация со слайсами user, ingredients, order', () => {
    const store = configureStore({ reducer: rootReducer });

    const state = store.getState();

    expect(state).toHaveProperty('user');
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('order');

    expect(state.user).toEqual(userSliceInitialState);
    expect(state.ingredients).toEqual(ingredientsSliceInitialState);
    expect(state.order).toEqual(orderSliceInitialState);
  });

  it('Возвращает начальное состояние при неизвестном экшене', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state).toEqual({
      user: userSliceInitialState,
      ingredients: ingredientsSliceInitialState,
      order: orderSliceInitialState
    });
  });
});
