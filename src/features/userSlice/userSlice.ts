import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { TUser } from '@utils-types';

import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData
} from '@api';
import { getCookie, setCookie, deleteCookie } from '../../utils/cookie';

export const loginUserThunk = createAsyncThunk(
  'user/login',
  async ({ email, password }: TLoginData) => loginUserApi({ email, password })
);

export const registerUserThunk = createAsyncThunk(
  'user/register',
  async ({ email, name, password }: TRegisterData) =>
    registerUserApi({ email, name, password })
);

export const logoutUserThunk = createAsyncThunk('user/logout', async () =>
  logoutApi()
);

export interface IUserSlice {
  isUserLoading: boolean;
  isAuthChecked: boolean;
  user: TUser | null;
}

const initialState: IUserSlice = {
  isUserLoading: false,
  isAuthChecked: false,
  user: null
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authChecked: (state) => {
      state.isAuthChecked = true;
    },
    setUserData: (state, { payload }: { payload: TUser }) => {
      state.user = payload;
    }
  },
  selectors: {
    getUser: (state) => state.user,
    getIsAuthChecked: (state) => state.isAuthChecked
  },
  extraReducers: (builder) => {
    builder.addCase(loginUserThunk.pending, (state) => {
      state.isUserLoading = true;
    });
    builder.addCase(loginUserThunk.rejected, (state) => {
      state.isUserLoading = false;
    });
    builder.addCase(loginUserThunk.fulfilled, (state, { payload }) => {
      state.isUserLoading = false;
      state.user = payload.user;
      setCookie('accessToken', payload.accessToken);
      localStorage.setItem('refreshToken', payload.refreshToken);
    });

    builder.addCase(registerUserThunk.pending, (state) => {
      state.isUserLoading = true;
    });
    builder.addCase(registerUserThunk.rejected, (state) => {
      state.isUserLoading = false;
    });
    builder.addCase(registerUserThunk.fulfilled, (state, { payload }) => {
      state.isUserLoading = false;
      state.user = payload.user;
      setCookie('accessToken', payload.accessToken);
      localStorage.setItem('refreshToken', payload.refreshToken);
    });

    builder.addCase(logoutUserThunk.pending, (state) => {
      state.isUserLoading = true;
    });
    builder.addCase(logoutUserThunk.rejected, (state) => {
      state.isUserLoading = false;
    });
    builder.addCase(logoutUserThunk.fulfilled, (state) => {
      state.isUserLoading = false;
      state.user = null;
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
    });
  }
});

export const { authChecked, setUserData } = userSlice.actions;

export const checkUserAuth = createAsyncThunk(
  'user/checkAuth',
  async (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      try {
        const userResponse = await getUserApi();
        dispatch(authChecked());
        dispatch(setUserData(userResponse.user));
      } catch (error) {
        dispatch(authChecked());
      }
    } else {
      dispatch(authChecked());
    }
  }
);

export const { getUser, getIsAuthChecked } = userSlice.selectors;

export const user = userSlice.reducer;
