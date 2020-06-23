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
  loaders = {
    user: false,
    signUp: false,
    logIn: false,
    changePassword: false,
    deleteAccount: false,
  };

  // Actions
  setValueByKey = (key, value) => {
    this.data[key] = value;
  };

  // Computed Values
  get isAuthenticated() {
    return !_.isNil(this.data.user);
  }

  logIn = async ({ email, password }) => {
    this.loaders.logIn = true;

    const response = await AuthenticationAPI.logIn({ email, password }).finally(
      () => {
        this.loaders.logIn = false;
      }
    );

    return response;
  };

  signUp = async ({ email, password }) => {
    this.loaders.signUp = true;

    const response = await AuthenticationAPI.signUp({
      email,
      password
    }).finally(() => {
      this.loaders.signUp = false;
    });

    return response;
  };

  changePassword = async ({ email, oldPassword, newPassword }) => {
    this.loaders.changePassword = true;

    const response = await AuthenticationAPI.changePassword({ email, oldPassword, newPassword }).finally(
      () => {
        this.loaders.changePassword = false;
      }
    );

    return response;
  };

  deleteAccount = async ({ email, password }) => {
    this.loaders.deleteAccount = true;

    const response = await AuthenticationAPI.deleteAccount({ email, password }).finally(
      () => {
        this.loaders.deleteAccount = false;
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
}

decorate(AuthenticationStore, {
  data: observable,
  loaders: observable,
  setValueByKey: action,
  isAuthenticated: computed,
  logIn: action,
  logOut: action,
  fetchUserByToken: action,
  deleteAccount: action,
  changePassword: action,
  signUp: action,
});

export default AuthenticationStore;
