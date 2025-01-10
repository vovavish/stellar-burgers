import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { TOrder, TOrdersData } from '@utils-types';

import { getFeedsApi, getOrdersApi, orderBurgerApi } from '@api';
import { get } from 'http';

export const orderBurgerApiThunk = createAsyncThunk(
  'order/send',
  async (data: string[]) => orderBurgerApi(data)
);

export const getOrdersThunk = createAsyncThunk('orders/get', async () =>
  getOrdersApi()
);

export const getFeedsThunk = createAsyncThunk('feeds/get', async () =>
  getFeedsApi()
);

export interface IOrderSlice {
  orderRequest: boolean;
  orderModalData: TOrder | null;

  isLoadingOrders: boolean;
  orders: TOrder[];

  isLoadingFeeds: boolean;
  feeds: TOrdersData | null;
}

const initialState: IOrderSlice = {
  orderRequest: false,
  orderModalData: null,

  isLoadingOrders: false,
  orders: [],

  isLoadingFeeds: false,
  feeds: null
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
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
  }
});

export const { setOrderRequest, setOrderModalData } = orderSlice.actions;

export const {
  getOrderRequest,
  getOrderModalData,
  getOrders,
  getIsLoadingOrders,
  getFeeds,
  getIsLoadingFeeds
} = orderSlice.selectors;

export const order = orderSlice.reducer;
