import { Plugins } from '@capacitor/core';
import Axios from 'axios';
import { User } from '../models';

import { IdentityService } from './IdentityService';

const mockUser: User = {
  id: 42,
  firstName: 'Joe',
  lastName: 'Tester',
  email: 'test@test.org',
};

describe('IdentityService', () => {
  let identityService: IdentityService;

  beforeEach(() => {
    identityService = IdentityService.getInstance();
    identityService['_token'] = undefined;
    identityService['_user'] = undefined;
  });

  it('should use a single instance', () => {
    expect(identityService).toBeDefined();
  });

  describe('init', () => {
    beforeEach(() => {
      (Plugins.Storage as any) = jest.fn();
      (Plugins.Storage.get as any) = jest.fn(() =>
        Promise.resolve({ value: '3884915llf950' }),
      );
      (Axios.get as any) = jest.fn(() => Promise.resolve({ data: mockUser }));
    });

    it('gets the stored token', async () => {
      await identityService.init();
      expect(Plugins.Storage.get).toHaveBeenCalledTimes(1);
      expect(Plugins.Storage.get).toHaveBeenCalledWith({ key: 'auth-token' });
    });

    describe('if there is a token', () => {
      it('assigns the token', async () => {
        await identityService.init();
        expect(identityService.token).toEqual('3884915llf950');
      });

      it('gets the current user', async () => {
        await identityService.init();
        const url = `${process.env.REACT_APP_DATA_SERVICE}/users/current`;
        const headers = { Authorization: 'Bearer ' + '3884915llf950' };
        expect(Axios.get).toHaveBeenCalledWith(url, { headers });
      });

      it('assigns the user', async () => {
        await identityService.init();
        expect(identityService.user).toEqual(mockUser);
      });
    });

    describe('if there is not a token', () => {
      beforeEach(() => {
        (Plugins.Storage.get as any) = jest.fn(() =>
          Promise.resolve({ value: null }),
        );
      });

      it('does not assign a token', async () => {
        await identityService.init();
        expect(identityService.token).toBeUndefined();
      });

      it('does not get the current user', async () => {
        await identityService.init();
        expect(identityService.user).toBeUndefined();
      });
    });
  });

  describe('set', () => {
    beforeEach(() => {
      (Plugins.Storage as any) = jest.fn();
      (Plugins.Storage.set as any) = jest.fn(() => Promise.resolve());
    });

    it('sets the user', async () => {
      await identityService.set(mockUser, '19940059fkkf039');
      expect(identityService.user).toEqual(mockUser);
    });

    it('sets the token', async () => {
      await identityService.set(mockUser, '19940059fkkf039');
      expect(identityService.token).toEqual('19940059fkkf039');
    });

    it('saves the token in storage', async () => {
      await identityService.set(mockUser, '19940059fkkf039');
      expect(Plugins.Storage.set).toHaveBeenCalledTimes(1);
      expect(Plugins.Storage.set).toHaveBeenCalledWith({
        key: 'auth-token',
        value: '19940059fkkf039',
      });
    });
  });

  describe('clear', () => {
    beforeEach(() => {
      identityService['_user'] = mockUser;
      identityService['_token'] = '19940059fkkf039';
      (Plugins.Storage as any) = jest.fn();
      (Plugins.Storage.remove as any) = jest.fn(() => Promise.resolve());
    });

    it('clears the user', async () => {
      await identityService.clear();
      expect(identityService.user).toBeUndefined();
    });

    it('clears the token', async () => {
      await identityService.clear();
      expect(identityService.token).toBeUndefined();
    });

    it('clears the storage', async () => {
      await identityService.clear();
      expect(Plugins.Storage.remove).toHaveBeenCalledTimes(1);
      expect(Plugins.Storage.remove).toHaveBeenCalledWith({
        key: 'auth-token',
      });
    });
  });

  afterEach(() => jest.restoreAllMocks());
});
