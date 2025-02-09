import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { TOrder, TOrdersData } from '@utils-types';

import {
  getFeedsApi,
  getOrderByNumberApi,
  getOrdersApi,
  orderBurgerApi
} from '@api';

export const orderBurgerApiThunk = createAsyncThunk(
  'order/send',
  orderBurgerApi
);

export const getOrdersThunk = createAsyncThunk('orders/get', getOrdersApi);

export const getFeedsThunk = createAsyncThunk('feeds/get', getFeedsApi);

export const getOrderByNumberThunk = createAsyncThunk(
  'order/getByNumber',
  getOrderByNumberApi
);

export interface IOrderSlice {
  orderRequest: boolean;
  orderModalData: TOrder | null;

  isLoadingOrders: boolean;
  orders: TOrder[];

  isLoadingOrderByNumber: boolean;
  orderByNumber: TOrder | null;

  isLoadingFeeds: boolean;
  feeds: TOrdersData | null;
}

export const orderSliceInitialState: IOrderSlice = {
  orderRequest: false,
  orderModalData: null,

  isLoadingOrders: false,
  orders: [],

  isLoadingOrderByNumber: false,
  orderByNumber: null,

  isLoadingFeeds: false,
  feeds: null
};

export const orderSlice = createSlice({
  name: 'order',
  initialState: orderSliceInitialState,
  reducers: {
    setOrderRequest: (state, { payload }: { payload: boolean }) => {
      state.orderRequest = payload;
    },
    setOrderModalData: (state, { payload }: { payload: TOrder | null }) => {
      state.orderModalData = payload;
    }
  },
  selectors: {
    getOrderRequest: (state) => state.orderRequest,
    getOrderModalData: (state) => state.orderModalData,

    getIsLoadingOrders: (state) => state.isLoadingOrders,
    getOrders: (state) => state.orders,

    getIsLoadingOrderByNumber: (state) => state.isLoadingOrderByNumber,
    getOrderByNumber: (state) => state.orderByNumber,

    getIsLoadingFeeds: (state) => state.isLoadingFeeds,
    getFeeds: (state) => state.feeds
  },
  extraReducers: (builder) => {
    builder.addCase(orderBurgerApiThunk.pending, (state) => {
      state.orderRequest = true;
    });
    builder.addCase(orderBurgerApiThunk.rejected, (state) => {
      state.orderRequest = false;
    });
    builder.addCase(orderBurgerApiThunk.fulfilled, (state, { payload }) => {
      state.orderRequest = false;
      state.orderModalData = payload.order;
    });

    builder.addCase(getOrdersThunk.pending, (state) => {
      state.isLoadingOrders = true;
    });
    builder.addCase(getOrdersThunk.rejected, (state) => {
      state.isLoadingOrders = false;
    });
    builder.addCase(getOrdersThunk.fulfilled, (state, { payload }) => {
      state.isLoadingOrders = false;
      state.orders = payload;
    });

    builder.addCase(getFeedsThunk.pending, (state) => {
      state.isLoadingFeeds = true;
    });
    builder.addCase(getFeedsThunk.rejected, (state) => {
      state.isLoadingFeeds = false;
    });
    builder.addCase(getFeedsThunk.fulfilled, (state, { payload }) => {
      state.isLoadingFeeds = false;
      state.feeds = payload;
    });

    builder.addCase(getOrderByNumberThunk.pending, (state) => {
      state.isLoadingOrderByNumber = true;
    });
    builder.addCase(getOrderByNumberThunk.rejected, (state) => {
      state.isLoadingOrderByNumber = false;
    });
    builder.addCase(getOrderByNumberThunk.fulfilled, (state, { payload }) => {
      state.isLoadingOrderByNumber = false;
      state.orderByNumber = payload.orders[0];
    });
  }
});

export const { setOrderRequest, setOrderModalData } = orderSlice.actions;

export const {
  getOrderRequest,
  getOrderModalData,
  getOrders,
  getIsLoadingOrders,
  getFeeds,
  getIsLoadingFeeds,
  getIsLoadingOrderByNumber,
  getOrderByNumber
} = orderSlice.selectors;

export const order = orderSlice.reducer;
