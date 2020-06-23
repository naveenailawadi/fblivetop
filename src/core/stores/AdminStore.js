import _ from 'lodash';
import { observable, decorate, action, computed } from 'mobx';
import * as AdminAPI from '../api/AdminAPI';

class AuthenticationStore {
    dataStore;

    constructor(dataStoreRef) {
        this.dataStore = dataStoreRef;
    }

    // Stored data
    data = {
        allUsers: undefined
    };

    // Loaders
    loaders = {};

    // Actions
    setValueByKey = (key, value) => {
        this.data[key] = value;
    };

    getAllUsers = async ({ email, password }) => {
        this.loaders.getAllUsers = true;

        const response = await AdminAPI.getAllUsers({ email, password }).finally(
            () => {
                this.loaders.getAllUsers = false;
            }
        );

        if (response.success && response.data) {
            const allUsers = response.data;
            this.setValueByKey('allUsers', allUsers);
        }

        return response;
    };

    deleteUser = async ({ email, password, userEmail }) => {
        this.loaders.deleteUser = true;

        const response = await AdminAPI.deleteUser({
            email,
            password,
            userEmail
        }).finally(() => {
            this.loaders.deleteUser = false;
        });

        return response;
    };
}

decorate(AuthenticationStore, {
    data: observable,
    loaders: observable,
    setValueByKey: action,
    isAuthenticated: computed,
    getAllUsers: action,
    deleteUser: action,
});

export default AuthenticationStore;
