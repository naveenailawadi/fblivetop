import _ from 'lodash';
import { observable, decorate, action, computed } from 'mobx';
import * as AuthenticationAPI from '../api/AuthenticationAPI';
import { setCookie, eraseCookie } from '../../app/AppHelper';

class AuthenticationStore {
  dataStore;

  constructor(dataStoreRef) {
    this.dataStore = dataStoreRef;
  }

  // Stored data
  data = {
    user: undefined,
    adminToken: undefined,
  };

  // Loaders
  loaders = {
    user: false,
    signUp: false,
    logIn: false,
    adminLogIn: false,
    changePassword: false,
    deleteAccount: false,
    forgotPassword: false,
    resetPassword: false,
  };

  // Actions
  setValueByKey = (key, value) => {
    this.data[key] = value;
  };

  // Computed Values
  get isAuthenticated() {
    return !_.isNil(this.data.user);
  }

  logIn = async ({ email, password, remember }) => {
    this.loaders.logIn = true;

    const response = await AuthenticationAPI.logIn({ email, password }).finally(
      () => {
        this.loaders.logIn = false;
      }
    );

    if (response.success && response.data) {
      // FIXME: Do not save password.
      const user = {
        email,
        password,
        token: response.data.token
      }

      // Case user wants to remember
      let sessionDays = 3 / 24; // 3 Hours
      if (remember) sessionDays = 7

      // Save access token
      //  const accessToken = response.data.token;
      //  localStorage._accessToken = accessToken;

      // FIXME: DO NOT SAVE ALL THIS SAVE ACCESS TOKEN IN THE FUTURE.
      const userString = JSON.stringify(user);
      setCookie("user", userString, sessionDays);


      this.setValueByKey('user', user);
    }

    return response;
  };

  adminLogIn = async ({ email, password, remember }) => {
    this.loaders.adminLogIn = true;

    const response = await AuthenticationAPI.adminLogIn({ email, password }).finally(
      () => {
        this.loaders.adminLogIn = false;
      }
    );

    if (response.success && response.data) {
      const adminToken = response.data.token;

      // Case user wants to remember
      let sessionDays = 3 / 24; // 3 Hours
      if (remember) sessionDays = 7

      setCookie("adminToken", adminToken, sessionDays);
      this.setValueByKey('adminToken', adminToken);
    }

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

    // Clear access token
    localStorage._accessToken = undefined;
    // this.setValueByKey('user', undefined);
    eraseCookie("user");

    this.loaders.user = false;

    return;
  };

  forgotPassword = async ({ email }) => {
    this.loaders.forgotPassword = true;

    const response = await AuthenticationAPI.forgotPassword({ email }).finally(
      () => {
        this.loaders.forgotPassword = false;
      }
    );

    return response;
  };

  resetPassword = async ({ email, newPassword, token }) => {
    this.loaders.resetPassword = true;

    const response = await AuthenticationAPI.resetPassword({ email, newPassword, token }).finally(
      () => {
        this.loaders.resetPassword = false;
      }
    );

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
  deleteAccount: action,
  changePassword: action,
  signUp: action,
  forgotPassword: action,
  resetPassword: action,
});

export default AuthenticationStore;
