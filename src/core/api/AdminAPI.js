import { processErrorResponse, processResponse, client } from './Client';
import constants from '../constants';

export const getAllUsers = async ({ email, password, token }) => {
    try {
        const res = await client({ headers: { token } }).get('/AdminUserManagement');
        return processResponse(res);
    } catch (err) {
        console.error(err);
        return processErrorResponse(err);
    }
};

export const getAllStreamers = async ({ token }) => {
    try {
        const res = await client({ headers: { token } }).get('/StreamerManagement');
        return processResponse(res);
    } catch (err) {
        console.error(err);
        return processErrorResponse(err);
    }
};

export const getAllFloatConstants = async ({ token }) => {
    try {
        const res = await client({ headers: { token } }).get('/FloatConstants');
        return processResponse(res);
    } catch (err) {
        console.error(err);
        return processErrorResponse(err);
    }
};

export const setFloatConstantValue = async ({ token, name, newConstantValue }) => {
    try {
        const res = await client({ headers: { token } }).put('/FloatConstants', { token, name, newConstantValue });
        return processResponse(res);
    } catch (err) {
        console.error(err);
        return processErrorResponse(err);
    }
};

export const deleteUser = async ({ token, userEmail }) => {
    try {
        const res = await client().delete('/AdminUserManagement', { data: { token, user_email: userEmail } });
        return processResponse(res);
    } catch (err) {
        console.error(err);
        return processErrorResponse(err);
    }
};

export const setUserBalance = async ({ token, userEmail, balance }) => {
    try {
        const res = await client({ headers: { token } }).put('/AdminUserManagement', { token: token, user_email: userEmail, new_balance: balance });
        return processResponse(res);
    } catch (err) {
        console.error(err);
        return processErrorResponse(err);
    }
};

export const addStreamer = async ({ token, email, emailPassword, port, host, proxyUsername, proxyPassword }) => {
    try {
        const res = await client({ headers: { token } }).post('/StreamerManagement', { token: token, email: email, emailPassword, port, host, proxyUsername, proxyPassword });
        return processResponse(res);
    } catch (err) {
        console.error(err);
        return processErrorResponse(err);
    }
};

