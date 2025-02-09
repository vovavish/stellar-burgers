jest.mock('../../../utils/cookie', () => ({
  setCookie: jest.fn(),
  deleteCookie: jest.fn(),
  getCookie: jest.fn()
}));

jest.mock('../../../utils/burger-api', () => ({
  getUserApi: jest.fn()
}));

import {
  userSliceInitialState,
  user,
  authChecked,
  setUserData,
  setUserAuth,
  loginUserThunk,
  registerUserThunk,
  logoutUserThunk,
  updateUserThunk,
  checkUserAuth
} from './userSlice';

import { setCookie, deleteCookie, getCookie } from '../../../utils/cookie';
import { configureStore } from '@reduxjs/toolkit';
import { getUserApi } from '@api';

const mockUser = { name: 'test_name', email: 'email@test.ru' };

describe('[userSlice] reducers', () => {
  it('Редьюсер authChecked', () => {
    const nextState = user(userSliceInitialState, authChecked());

    expect(nextState.isAuthChecked).toBe(true);
  });

  it('Редьюсер setUserData', () => {
    const nextState = user(userSliceInitialState, setUserData(mockUser));

    expect(nextState.user).toEqual(mockUser);
  });

  it('Редьюсер setUserAuth', () => {
    const nextState = user(userSliceInitialState, setUserAuth(true));

    expect(nextState.isUserAuth).toBe(true);
  });
});

describe('[userSlice] async thunk actions', () => {
  const userCredentials = {
    email: '',
    password: ''
  };

  const userCredentialsWithName = {
    ...userCredentials,
    name: ''
  };

  const mockUserAuthPayload = {
    success: true,
    user: mockUser
  };

  const mockUserAuthWithAtRtPayload = {
    ...mockUserAuthPayload,
    accessToken: 'mockToken',
    refreshToken: 'mockRefreshToken'
  };

  beforeEach(() => {
    Storage.prototype.setItem = jest.fn();
    Storage.prototype.removeItem = jest.fn();
    global.document.cookie = '';
  });

  describe('loginUserThunk', () => {
    it('loginUserThunk.pending', () => {
      const nextState = user(
        userSliceInitialState,
        loginUserThunk.pending('requestId', userCredentials)
      );

      expect(nextState.isUserLoading).toBe(true);
    });

    it('loginUserThunk.rejected', () => {
      const nextState = user(
        userSliceInitialState,
        loginUserThunk.rejected(
          new Error('Error'),
          'requestId',
          userCredentials
        )
      );

      expect(nextState.isUserLoading).toBe(false);
      expect(nextState.isUserAuth).toBe(false);
    });

    it('loginUserThunk.fulfilled', () => {
      const nextState = user(
        userSliceInitialState,
        loginUserThunk.fulfilled(
          mockUserAuthWithAtRtPayload,
          'requestId',
          userCredentials
        )
      );

      expect(nextState.isUserLoading).toBe(false);
      expect(nextState.user).toEqual(mockUserAuthWithAtRtPayload.user);
      expect(nextState.isUserAuth).toBe(true);

      expect(setCookie).toHaveBeenCalledWith(
        'accessToken',
        mockUserAuthWithAtRtPayload.accessToken
      );
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'refreshToken',
        mockUserAuthWithAtRtPayload.refreshToken
      );
    });
  });

  describe('registerUserThunk', () => {
    it('registerUserThunk.pending', () => {
      const nextState = user(
        userSliceInitialState,
        registerUserThunk.pending('requestId', userCredentialsWithName)
      );

      expect(nextState.isUserLoading).toBe(true);
    });

    it('registerUserThunk.rejected', () => {
      const nextState = user(
        userSliceInitialState,
        registerUserThunk.rejected(
          new Error('Error'),
          'requestId',
          userCredentialsWithName
        )
      );

      expect(nextState.isUserLoading).toBe(false);
    });

    it('registerUserThunk.fulfilled', () => {
      const nextState = user(
        userSliceInitialState,
        registerUserThunk.fulfilled(
          mockUserAuthWithAtRtPayload,
          'requestId',
          userCredentialsWithName
        )
      );

      expect(nextState.isUserLoading).toBe(false);
      expect(nextState.user).toEqual(mockUserAuthWithAtRtPayload.user);

      expect(setCookie).toHaveBeenCalledWith(
        'accessToken',
        mockUserAuthWithAtRtPayload.accessToken
      );
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'refreshToken',
        mockUserAuthWithAtRtPayload.refreshToken
      );
    });
  });

  describe('logoutUserThunk', () => {
    it('logoutUserThunk.pending', () => {
      const nextState = user(
        userSliceInitialState,
        logoutUserThunk.pending('requestId', undefined)
      );

      expect(nextState.isUserLogoutLoading).toBe(true);
    });

    it('logoutUserThunk.rejected', () => {
      const nextState = user(
        userSliceInitialState,
        logoutUserThunk.rejected(new Error('Error'), 'requestId', undefined)
      );

      expect(nextState.isUserLogoutLoading).toBe(false);
    });

    it('logoutUserThunk.fulfilled', () => {
      const nextState = user(
        userSliceInitialState,
        logoutUserThunk.fulfilled({ success: true }, 'requestId', undefined)
      );

      expect(nextState.isUserLogoutLoading).toBe(false);
      expect(nextState.user).toBe(null);
      expect(nextState.isUserAuth).toBe(false);

      expect(deleteCookie).toHaveBeenCalledWith('accessToken');
      expect(localStorage.removeItem).toHaveBeenCalledWith('refreshToken');
    });
  });

  describe('updateUserThunk', () => {
    it('updateUserThunk.pending', () => {
      const nextState = user(
        userSliceInitialState,
        updateUserThunk.pending('requestId', mockUser)
      );

      expect(nextState.isUserUpdaing).toBe(true);
    });

    it('updateUserThunk.rejected', () => {
      const nextState = user(
        userSliceInitialState,
        updateUserThunk.rejected(new Error('Error'), 'requestId', mockUser)
      );

      expect(nextState.isUserUpdaing).toBe(false);
    });

    it('updateUserThunk.fulfilled', () => {
      const nextState = user(
        userSliceInitialState,
        updateUserThunk.fulfilled(mockUserAuthPayload, 'requestId', mockUser)
      );

      expect(nextState.isUserUpdaing).toBe(false);
      expect(nextState.user).toEqual(mockUserAuthPayload.user);
    });
  });

  describe('checkUserAuth', () => {
    let store = configureStore({
      reducer: { user }
    });

    afterEach(() => {
      jest.clearAllMocks();
      store = configureStore({
        reducer: { user }
      });
    });

    it('Успешное обращение к getUserApi', async () => {
      (getCookie as jest.Mock).mockReturnValue('mockToken');
      (getUserApi as jest.Mock).mockResolvedValue(mockUserAuthPayload);

      await store.dispatch(checkUserAuth());

      const state = store.getState();

      expect(getUserApi).toHaveBeenCalled();
      expect(state.user.isAuthChecked).toBe(true);
      expect(state.user.user).toEqual(mockUser);
      expect(state.user.isUserAuth).toBe(true);
    });

    it('Ошибка при обращении к getUserApi', async () => {
      (getCookie as jest.Mock).mockReturnValue('mockToken');
      (getUserApi as jest.Mock).mockResolvedValue(Promise.reject(new Error()));

      await store.dispatch(checkUserAuth());

      const state = store.getState();

      expect(getUserApi).toHaveBeenCalled();
      expect(state.user.isAuthChecked).toBe(true);
      expect(state.user.user).toBe(null);
      expect(state.user.isUserAuth).toBe(false);
    });

    it('Отсутствует accessToken', async () => {
      (getCookie as jest.Mock).mockReturnValue(null);

      await store.dispatch(checkUserAuth());

      const state = store.getState();

      expect(getUserApi).not.toHaveBeenCalled();
      expect(state.user.isAuthChecked).toBe(true);
      expect(state.user.user).toBe(null);
      expect(state.user.isUserAuth).toBe(false);
    });
  });
});
