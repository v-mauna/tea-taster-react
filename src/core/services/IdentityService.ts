import { Plugins } from '@capacitor/core';
import Axios from 'axios';
import { User } from '../models';

export class IdentityService {
  private static instance: IdentityService | undefined = undefined;
  private _key = 'auth-token';
  private _token: string | undefined = undefined;
  private _user: User | undefined = undefined;

  get token(): string | undefined {
    return this._token;
  }

  get user(): User | undefined {
    return this._user;
  }

  private constructor() {}

  public static getInstance(): IdentityService {
    if (!IdentityService.instance) {
      IdentityService.instance = new IdentityService();
    }
    return IdentityService.instance;
  }

  async init(): Promise<void> {
    const { Storage } = Plugins;
    const { value } = await Storage.get({ key: this._key });

    if (!value) return;

    this._token = value;
    this._user = await this.fetchUser(this._token);
  }

  async set(user: User, token: string): Promise<void> {
    const { Storage } = Plugins;
    await Storage.set({ key: this._key, value: token });
    this._token = token;
    this._user = user;
  }

  async clear(): Promise<void> {
    const { Storage } = Plugins;
    await Storage.remove({ key: this._key });
    this._token = undefined;
    this._user = undefined;
  }

  private async fetchUser(token: string): Promise<User> {
    const headers = { Authorization: 'Bearer ' + token };
    const url = `${process.env.REACT_APP_DATA_SERVICE}/users/current`;
    const { data } = await Axios.get(url, { headers });
    return data;
  }
}
