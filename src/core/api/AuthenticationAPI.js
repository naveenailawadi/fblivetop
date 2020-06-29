import { processErrorResponse, processResponse, client } from './Client';
import constants from '../constants';

export const logIn = async ({ email, password }) => {
  try {
    const res = await client().post('/Login', { email, password });
    return processResponse(res);
  } catch (err) {
    console.error(err);
    return processErrorResponse(err);
  }
};


export const signUp = async ({ email, password }) => {
  try {
    const res = await client().post('/UserManagement', { email, password, confirmed_password: password });
    return processResponse(res);
  } catch (err) {
    console.error(err);
    return processErrorResponse(err);
  }
};

export const deleteAccount = async ({ email, password }) => {
  try {
    const res = await client().delete('/UserManagement', { data: { email, password } });
    return processResponse(res);
  } catch (err) {
    console.error(err);
    return processErrorResponse(err);
  }
};

export const changePassword = async ({ email, oldPassword, newPassword }) => {
  try {
    const res = await client().put('/UserManagement', { email, old_password: oldPassword, new_password: newPassword });
    return processResponse(res);
  } catch (err) {
    console.error(err);
    return processErrorResponse(err);
  }
};

export const forgotPassword = async ({ email }) => {
  try {
    const res = await client().put('/UserManagement', { email });
    return processResponse(res);
  } catch (err) {
    console.error(err);
    return processErrorResponse(err);
  }
};

export const resetPassword = async ({ email, token, newPassword }) => {
  try {
    const res = await client().put('/UserManagement', { token, newPassword });
    return processResponse(res);
  } catch (err) {
    console.error(err);
    return processErrorResponse(err);
  }
};
