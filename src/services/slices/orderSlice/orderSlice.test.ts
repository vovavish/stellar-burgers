import { TOrder } from '@utils-types';
import {
  order,
  orderSliceInitialState,
  setOrderRequest,
  setOrderModalData,
  orderBurgerApiThunk,
  getOrdersThunk,
  getFeedsThunk,
  getOrderByNumberThunk
} from './orderSlice';

import { mockIngredients } from '../ingredientsSlice/ingredientsMock';

const mockOrder1: TOrder = {
  _id: '1',
  status: 'done',
  name: 'test',
  createdAt: 'test',
  updatedAt: 'test',
  number: 1,
  ingredients: ['test']
};

const mockOrder2: TOrder = {
  _id: '2',
  status: 'done',
  name: 'test2',
  createdAt: 'test2',
  updatedAt: 'test2',
  number: 2,
  ingredients: ['test2']
};

describe('[orderSlice] reducers', () => {
  it('Редьюсер setOrderRequest', () => {
    const state = {
      ...orderSliceInitialState
    };

    const newState = order(state, setOrderRequest(true));

    expect(newState.orderRequest).toEqual(true);
  });

  it('Редьюсер setOrderModalData', () => {
    const state = {
      ...orderSliceInitialState
    };

    const newState = order(state, setOrderModalData(mockOrder1));

    expect(newState.orderModalData).toEqual(mockOrder1);
  });
});

describe('[orderSlice] async thunk actions', () => {
  describe('orderBurgerApiThunk', () => {
    it('orderBurgerApiThunk.pending', () => {
      const nextState = order(
        orderSliceInitialState,
        orderBurgerApiThunk.pending('requestId', [
          mockIngredients[0]._id,
          mockIngredients[1]._id
        ])
      );

      expect(nextState.orderRequest).toBe(true);
    });

    it('orderBurgerApiThunk.rejected', () => {
      const nextState = order(
        orderSliceInitialState,
        orderBurgerApiThunk.rejected(new Error('Error'), 'requestId', [
          mockIngredients[0]._id,
          mockIngredients[1]._id
        ])
      );

      expect(nextState.orderRequest).toBe(false);
    });

    it('orderBurgerApiThunk.fulfilled', () => {
      const mockOrder1Fulfilled = {
        success: true,
        order: mockOrder1,
        name: 'test'
      };
      const nextState = order(
        orderSliceInitialState,
        orderBurgerApiThunk.fulfilled(mockOrder1Fulfilled, 'requestId', [
          mockIngredients[0]._id,
          mockIngredients[1]._id
        ])
      );

      expect(nextState.orderRequest).toBe(false);
      expect(nextState.orderModalData).toEqual(mockOrder1);
    });
  });

  describe('getOrdersThunk', () => {
    it('getOrdersThunk.pending', () => {
      const nextState = order(
        orderSliceInitialState,
        getOrdersThunk.pending('requestId')
      );

      expect(nextState.isLoadingOrders).toBe(true);
    });

    it('getOrdersThunk.rejected', () => {
      const nextState = order(
        orderSliceInitialState,
        getOrdersThunk.rejected(new Error('Error'), 'requestId')
      );

      expect(nextState.isLoadingOrders).toBe(false);
    });

    it('getOrdersThunk.fulfilled', () => {
      const nextState = order(
        orderSliceInitialState,
        getOrdersThunk.fulfilled([mockOrder1, mockOrder1], 'requestId')
      );

      expect(nextState.isLoadingOrders).toBe(false);
      expect(nextState.orders).toEqual([mockOrder1, mockOrder1]);
    });
  });

  describe('getFeedsThunk', () => {
    it('getFeedsThunk.pending', () => {
      const nextState = order(
        orderSliceInitialState,
        getFeedsThunk.pending('requestId')
      );

      expect(nextState.isLoadingFeeds).toBe(true);
    });

    it('getFeedsThunk.rejected', () => {
      const nextState = order(
        orderSliceInitialState,
        getFeedsThunk.rejected(new Error('Error'), 'requestId')
      );

      expect(nextState.isLoadingFeeds).toBe(false);
    });

    it('getFeedsThunk.fulfilled', () => {
      const mockOrder1Fulfilled = {
        success: true,
        orders: [mockOrder1, mockOrder1],
        total: 1,
        totalToday: 1
      };

      const nextState = order(
        orderSliceInitialState,
        getFeedsThunk.fulfilled(mockOrder1Fulfilled, 'requestId')
      );

      expect(nextState.isLoadingFeeds).toBe(false);

      expect(nextState.feeds).toEqual(mockOrder1Fulfilled);
    });
  });

  describe('getOrderByNumberThunk', () => {
    it('getOrderByNumberThunk.pending', () => {
      const nextState = order(
        orderSliceInitialState,
        getOrderByNumberThunk.pending('requestId', 1)
      );

      expect(nextState.isLoadingOrderByNumber).toBe(true);
    });

    it('getOrderByNumberThunk.rejected', () => {
      const nextState = order(
        orderSliceInitialState,
        getOrderByNumberThunk.rejected(new Error('Error'), 'requestId', 1)
      );

      expect(nextState.isLoadingOrderByNumber).toBe(false);
    });

    it('getOrderByNumberThunk.fulfilled', () => {
      const mockOrder1Fulfilled = {
        success: true,
        orders: [mockOrder2, mockOrder1]
      };

      const nextState = order(
        orderSliceInitialState,
        getOrderByNumberThunk.fulfilled(mockOrder1Fulfilled, 'requestId', 1)
      );

      console.log(nextState.orderByNumber);

      expect(nextState.isLoadingOrderByNumber).toBe(false);
      expect(nextState.orderByNumber).toEqual(mockOrder2);
    });
  });
});
