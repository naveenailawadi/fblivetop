import _ from 'lodash';
import { observable, decorate, action, computed, toJS } from 'mobx';
import * as AdminAPI from '../api/AdminAPI';

class AdminStore {
    dataStore;

    constructor(dataStoreRef) {
        this.dataStore = dataStoreRef;
    }

    // Stored data
    data = {
        allUsers: null,
        allStreamers: null,
        allFloatConstants: null,
    };

    // Loaders
    loaders = {
        getAllUsers: false,
        deleteUser: false,
        getAllStreamers: false,
        getAllFloatConstants: false,
    };

    // Actions
    setValueByKey = (key, value) => {
        this.data[key] = value;
    };

    getAllUsers = async ({ email, password, token }) => {
        this.loaders.getAllUsers = true;

        const response = await AdminAPI.getAllUsers({ email, password, token }).finally(
            () => {
                this.loaders.getAllUsers = false;
            }
        );

        if (response.success && response.data) {
            const allUsers = response.data.users;
            this.setValueByKey('allUsers', allUsers);
        }

        return response;
    };

    updateUserInUsersList = (userEmail, newValues) => {
        if (!this.data.allUsers) return;

        const userIndex = this.data.allUsers.findIndex(u => u.email === userEmail);

        if (userIndex === -1) return;

        const userObj = this.data.allUsers[userIndex];
        const newUserObj = { ...userObj, ...newValues };

        const newAllUsers = [...this.data.allUsers];
        newAllUsers[userIndex] = newUserObj;

        this.setValueByKey('allUsers', newAllUsers);
    }

    getAllStreamers = async ({ token }) => {
        this.loaders.getAllStreamers = true;

        const response = await AdminAPI.getAllStreamers({ token }).finally(
            () => {
                this.loaders.getAllStreamers = false;
            }
        );

        if (response.success && response.data) {
            const allStreamers = response.data.streamers;
            this.setValueByKey('allStreamers', allStreamers);
        }

        return response;
    };

    getAllFloatConstants = async ({ token }) => {
        this.loaders.getAllFloatConstants = true;

        const response = await AdminAPI.getAllFloatConstants({ token }).finally(
            () => {
                this.loaders.getAllFloatConstants = false;
            }
        );

        if (response.success && response.data) {
            const allFloatConstants = response.data.constants;
            this.setValueByKey('allFloatConstants', allFloatConstants);
        }

        return response;
    };

    deleteUser = async ({ token, userEmail }) => {
        this.loaders.deleteUser = true;

        const response = await AdminAPI.deleteUser({
            token,
            userEmail
        }).finally(() => {
            this.loaders.deleteUser = false;
        });

        return response;
    };

    setUserBalance = async ({ token, userEmail, balance }) => {
        this.loaders.setUserBalance = true;

        const response = await AdminAPI.setUserBalance({ token, userEmail, balance }).finally(
            () => {
                this.loaders.setUserBalance = false;
            }
        );

        if (response.success && !response.error) {
            this.updateUserInUsersList(userEmail, { balance })
        }

        return response;
    };

    setFloatConstantValue = async ({ token, name, newConstantValue }) => {
        this.loaders.setFloatConstantValue = true;

        const response = await AdminAPI.setFloatConstantValue({ token, name, newConstantValue }).finally(
            () => {
                this.loaders.setFloatConstantValue = false;
            }
        );

        return response;
    };

    addStreamer = async ({ token, email, emailPassword, port, host, proxyUsername, proxyPassword }) => {
        this.loaders.addStreamer = true;

        const response = await AdminAPI.addStreamer({ token, email, emailPassword, port, host, proxyUsername, proxyPassword }).finally(
            () => {
                this.loaders.addStreamer = false;
            }
        );

        return response;
    };


}

decorate(AdminStore, {
    data: observable,
    loaders: observable,
    setValueByKey: action,
    getAllUsers: action,
    deleteUser: action,
    getAllStreamers: action,
    updateUserInUsersList: action,
    getAllFloatConstants: action,
    setFloatConstantValue: action,
    setUserBalance: action,
});

export default AdminStore;
