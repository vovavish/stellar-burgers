import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { TUser } from '@utils-types';

import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { getCookie, setCookie, deleteCookie } from '../../../utils/cookie';
import { get } from 'http';

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

export const updateUserThunk = createAsyncThunk(
  'user/update',
  async (user: Partial<TRegisterData>) => updateUserApi(user)
);

export interface IUserSlice {
  isUserLoading: boolean;
  isUserLogoutLoading: boolean;
  isAuthChecked: boolean;
  isUserAuth: boolean;
  user: TUser | null;
  isUserUpdaing: boolean;
}

const initialState: IUserSlice = {
  isUserLoading: false,
  isUserLogoutLoading: false,
  isAuthChecked: false,
  isUserAuth: false,
  user: null,
  isUserUpdaing: false
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
    },
    setUserAuth: (state, { payload }: { payload: boolean }) => {
      state.isUserAuth = payload;
    }
  },
  selectors: {
    getUser: (state) => state.user,
    getIsUserLoading: (state) => state.isUserLoading,
    getIsAuthChecked: (state) => state.isAuthChecked,
    getIsUserAuth: (state) => state.isUserAuth,
    getIsUserUpdating: (state) => state.isUserUpdaing,
    getIsUserLogoutLoading: (state) => state.isUserLogoutLoading
  },
  extraReducers: (builder) => {
    builder.addCase(loginUserThunk.pending, (state) => {
      state.isUserLoading = true;
    });
    builder.addCase(loginUserThunk.rejected, (state) => {
      state.isUserLoading = false;
      state.isUserAuth = false;
    });
    builder.addCase(loginUserThunk.fulfilled, (state, { payload }) => {
      state.isUserLoading = false;
      state.user = payload.user;
      state.isUserAuth = true;
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
      state.isUserLogoutLoading = true;
    });
    builder.addCase(logoutUserThunk.rejected, (state) => {
      state.isUserLogoutLoading = false;
    });
    builder.addCase(logoutUserThunk.fulfilled, (state) => {
      state.isUserLogoutLoading = false;
      state.user = null;
      state.isUserAuth = false;
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
    });

    builder.addCase(updateUserThunk.pending, (state) => {
      state.isUserUpdaing = true;
    });
    builder.addCase(updateUserThunk.rejected, (state) => {
      state.isUserUpdaing = false;
    });
    builder.addCase(updateUserThunk.fulfilled, (state, { payload }) => {
      state.isUserUpdaing = false;
      state.user = payload.user;
    });
  }
});

export const { authChecked, setUserData, setUserAuth } = userSlice.actions;

export const checkUserAuth = createAsyncThunk(
  'user/checkAuth',
  async (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      try {
        const userResponse = await getUserApi();
        dispatch(authChecked());
        dispatch(setUserData(userResponse.user));
        dispatch(setUserAuth(true));
      } catch (error) {
        dispatch(authChecked());
        dispatch(setUserAuth(false));
      }
    } else {
      dispatch(authChecked());
    }
  }
);

export const {
  getUser,
  getIsUserLoading,
  getIsAuthChecked,
  getIsUserAuth,
  getIsUserUpdating,
  getIsUserLogoutLoading
} = userSlice.selectors;

export const user = userSlice.reducer;
