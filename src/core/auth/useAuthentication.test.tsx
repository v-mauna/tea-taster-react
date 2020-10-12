import React from 'react';
import { renderHook, act, cleanup } from '@testing-library/react-hooks';
import { useAuthentication } from './useAuthentication';
import { AuthProvider } from './AuthContext';
import { AuthService, IdentityService } from '../services';
import { User } from '../models';

const wrapper = ({ children }: any) => <AuthProvider>{children}</AuthProvider>;

const mockUser: User = {
  id: 42,
  firstName: 'Joe',
  lastName: 'Tester',
  email: 'test@test.org',
};

describe('useAuthentication', () => {
  let authService: AuthService;
  let identityService: IdentityService;

  beforeEach(() => {
    authService = AuthService.getInstance();
    identityService = IdentityService.getInstance();
    identityService.init = jest.fn();
  });

  describe('login', () => {
    beforeEach(() => {
      authService.login = jest.fn(() => {
        identityService['_user'] = mockUser;
        return Promise.resolve(true);
      });
      identityService['_user'] = undefined;
      identityService['_token'] = undefined;
    });

    describe('on success', () => {
      it('sets the status to authenticated', async () => {
        const { result, waitForNextUpdate } = renderHook(
          () => useAuthentication(),
          { wrapper },
        );
        await waitForNextUpdate();
        await act(() => result.current.login('test@test.com', 'P@ssword'));
        expect(result.current.status).toEqual('authenticated');
      });

      it('sets the user on successful login', async () => {
        const { result, waitForNextUpdate } = renderHook(
          () => useAuthentication(),
          { wrapper },
        );
        await waitForNextUpdate();
        identityService['_user'] = mockUser;
        await act(() => result.current.login('test@test.com', 'P@ssword'));
        expect(result.current.user).toEqual(mockUser);
      });
    });

    describe('on failure', () => {
      beforeEach(() => {
        authService.login = jest.fn(() => Promise.resolve(false));
      });

      it('sets the error', async () => {
        const { result, waitForNextUpdate } = renderHook(
          () => useAuthentication(),
          { wrapper },
        );
        await waitForNextUpdate();
        await act(() => result.current.login('test@test.com', 'P@ssword'));
        expect(result.current.error).toBeDefined();
      });
    });
  });

  describe('logout', () => {
    beforeEach(() => {
      identityService['_user'] = mockUser;
      authService.logout = jest.fn(() => {
        identityService['_user'] = undefined;
        return Promise.resolve();
      });
    });

    it('sets the status to unauthenticated', async () => {
      const { result, waitForNextUpdate } = renderHook(
        () => useAuthentication(),
        { wrapper },
      );
      await waitForNextUpdate();
      await act(() => result.current.login('test@test.com', 'P@ssword'));
      await act(() => result.current.logout());
      expect(result.current.status).toEqual('unauthenticated');
    });

    it('sets the user to undefined', async () => {
      const { result, waitForNextUpdate } = renderHook(
        () => useAuthentication(),
        { wrapper },
      );
      await waitForNextUpdate();
      await act(() => result.current.login('test@test.com', 'P@ssword'));
      await act(() => result.current.logout());
      expect(result.current.user).not.toBeDefined();
    });
  });

  afterEach(() => {
    cleanup();
    jest.restoreAllMocks();
  });
});
