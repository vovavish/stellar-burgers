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

describe('[userSlice] reducers', () => {
  it('Редьюсер authChecked', () => {
    const nextState = user(userSliceInitialState, authChecked());

    expect(nextState.isAuthChecked).toBe(true);
  });

  it('Редьюсер setUserData', () => {
    const mockUser = { name: 'test_name', email: 'email@test.ru' };

    const nextState = user(userSliceInitialState, setUserData(mockUser));

    expect(nextState.user).toEqual(mockUser);
  });

  it('Редьюсер setUserAuth', () => {
    const nextState = user(userSliceInitialState, setUserAuth(true));

    expect(nextState.isUserAuth).toBe(true);
  });
});

describe('[userSlice] async thunk actions', () => {
  beforeEach(() => {
    Storage.prototype.setItem = jest.fn();
    Storage.prototype.removeItem = jest.fn();
    global.document.cookie = '';
  });

  describe('loginUserThunk', () => {
    it('loginUserThunk.pending', () => {
      const nextState = user(
        userSliceInitialState,
        loginUserThunk.pending('requestId', { email: '', password: '' })
      );

      expect(nextState.isUserLoading).toBe(true);
    });

    it('loginUserThunk.rejected', () => {
      const nextState = user(
        userSliceInitialState,
        loginUserThunk.rejected(new Error('Error'), 'requestId', {
          email: '',
          password: ''
        })
      );

      expect(nextState.isUserLoading).toBe(false);
      expect(nextState.isUserAuth).toBe(false);
    });

    it('loginUserThunk.fulfilled', () => {
      const mockPayload = {
        success: true,
        user: { name: 'test_name', email: 'email@test.ru' },
        accessToken: 'mockToken',
        refreshToken: 'mockRefreshToken'
      };

      const nextState = user(
        userSliceInitialState,
        loginUserThunk.fulfilled(mockPayload, 'requestId', {
          email: '',
          password: ''
        })
      );

      expect(nextState.isUserLoading).toBe(false);
      expect(nextState.user).toEqual(mockPayload.user);
      expect(nextState.isUserAuth).toBe(true);

      expect(setCookie).toHaveBeenCalledWith(
        'accessToken',
        mockPayload.accessToken
      );
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'refreshToken',
        mockPayload.refreshToken
      );
    });
  });

  describe('registerUserThunk', () => {
    it('registerUserThunk.pending', () => {
      const nextState = user(
        userSliceInitialState,
        registerUserThunk.pending('requestId', {
          name: '',
          email: '',
          password: ''
        })
      );

      expect(nextState.isUserLoading).toBe(true);
    });

    it('registerUserThunk.rejected', () => {
      const nextState = user(
        userSliceInitialState,
        registerUserThunk.rejected(new Error('Error'), 'requestId', {
          name: '',
          email: '',
          password: ''
        })
      );

      expect(nextState.isUserLoading).toBe(false);
    });

    it('registerUserThunk.fulfilled', () => {
      const mockPayload = {
        success: true,
        user: { name: 'Jane Doe', email: 'jane@example.com' },
        accessToken: 'mockToken',
        refreshToken: 'mockRefreshToken'
      };

      const nextState = user(
        userSliceInitialState,
        registerUserThunk.fulfilled(mockPayload, 'requestId', {
          name: '',
          email: '',
          password: ''
        })
      );

      expect(nextState.isUserLoading).toBe(false);
      expect(nextState.user).toEqual(mockPayload.user);

      expect(setCookie).toHaveBeenCalledWith(
        'accessToken',
        mockPayload.accessToken
      );
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'refreshToken',
        mockPayload.refreshToken
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
        updateUserThunk.pending('requestId', {
          name: '',
          email: ''
        })
      );

      expect(nextState.isUserUpdaing).toBe(true);
    });

    it('updateUserThunk.rejected', () => {
      const nextState = user(
        userSliceInitialState,
        updateUserThunk.rejected(new Error('Error'), 'requestId', {
          name: '',
          email: ''
        })
      );

      expect(nextState.isUserUpdaing).toBe(false);
    });

    it('updateUserThunk.fulfilled', () => {
      const mockPayload = {
        success: true,
        user: {
          name: 'John Updated',
          email: 'john.updated@example.com'
        }
      };
      const nextState = user(
        userSliceInitialState,
        updateUserThunk.fulfilled(mockPayload, 'requestId', {
          name: 'John Updated',
          email: 'john.updated@example.com'
        })
      );

      expect(nextState.isUserUpdaing).toBe(false);
      expect(nextState.user).toEqual(mockPayload.user);
    });
  });

  describe('checkUserAuth', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('Успешное обращение к getUserApi', async () => {
      (getCookie as jest.Mock).mockReturnValue('mockToken');
      (getUserApi as jest.Mock).mockResolvedValue({
        success: true,
        user: { name: 'test_name', email: 'email@test.ru' }
      });

      const store = configureStore({
        reducer: { user }
      });

      await store.dispatch(checkUserAuth());

      const state = store.getState();

      expect(getUserApi).toHaveBeenCalled();
      expect(state.user.isAuthChecked).toBe(true);
      expect(state.user.user).toEqual({
        name: 'test_name',
        email: 'email@test.ru'
      });
      expect(state.user.isUserAuth).toBe(true);
    });

    it('Ошибка при обращении к getUserApi', async () => {
      (getCookie as jest.Mock).mockReturnValue('mockToken');
      (getUserApi as jest.Mock).mockResolvedValue(Promise.reject(new Error()));

      const store = configureStore({
        reducer: { user }
      });

      await store.dispatch(checkUserAuth());

      const state = store.getState();

      expect(getUserApi).toHaveBeenCalled();
      expect(state.user.isAuthChecked).toBe(true);
      expect(state.user.user).toBe(null);
      expect(state.user.isUserAuth).toBe(false);
    });

    it('Отсутствует accessToken', async () => {
      (getCookie as jest.Mock).mockReturnValue(null);

      const store = configureStore({
        reducer: { user }
      });

      await store.dispatch(checkUserAuth());

      const state = store.getState();

      expect(getUserApi).not.toHaveBeenCalled();
      expect(state.user.isAuthChecked).toBe(true);
      expect(state.user.user).toBe(null);
      expect(state.user.isUserAuth).toBe(false);
    });
  });
});
