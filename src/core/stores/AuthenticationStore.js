import _ from 'lodash';
import { observable, decorate, action, computed } from 'mobx';
import * as AuthenticationAPI from '../api/AuthenticationAPI';

class AuthenticationStore {
  dataStore;

  constructor(dataStoreRef) {
    this.dataStore = dataStoreRef;
  }

  // Stored data
  data = {
    user: undefined
  };

  // Loaders
  loaders = {};

  // Actions
  setValueByKey = (key, value) => {
    this.data[key] = value;
  };

  // Computed Values
  get isAuthenticated() {
    return !_.isNil(this.data.user);
  }

  logIn = async ({ email, password }) => {
    this.loaders.user = true;

    const response = await AuthenticationAPI.logIn({ email, password }).finally(
      () => {
        this.loaders.user = false;
      }
    );

    return response;
  };

  signUp = async ({ email, password }) => {
    this.loaders.user = true;

    const response = await AuthenticationAPI.signUp({
      email,
      password
    }).finally(() => {
      this.loaders.user = false;
    });

    return response;
  };

  resetPassword = async ({ email }) => {
    this.loaders.user = true;

    const response = await AuthenticationAPI.resetPassword({ email }).finally(
      () => {
        this.loaders.user = false;
      }
    );

    return response;
  };

  logOut = async () => {
    this.loaders.user = true;

    // const response = await AuthenticationAPI.logOut().finally(() => {
    //   this.loaders.user = false;
    // });

    localStorage._accessToken = undefined;
    this.setValueByKey('user', undefined);

    this.loaders.user = false;

    return;
  };

  fetchUserByToken = async ({ token, additionalData = {} }) => {
    this.loaders.user = true;

    const response = await AuthenticationAPI.fetchUserByToken({
      token
    }).finally(() => {
      this.loaders.user = false;
    });

    if (response.success && response.data) {
      const user = response.data;

      this.setValueByKey('user', user);
    }

    return response;
  };
}

decorate(AuthenticationStore, {
  data: observable,
  loaders: observable,
  setValueByKey: action,
  isAuthenticated: computed,
  logIn: action,
  logOut: action,
  fetchUserByToken: action,
});

export default AuthenticationStore;
