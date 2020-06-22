import { processErrorResponse, processResponse, client } from './Client';
import constants from '../constants';

export const logIn = async ({ email, password }) => {
  try {
    const res = await client().get('/');
    return processResponse(res);
  } catch (err) {
    console.error(err);
    return processErrorResponse(err);
  }
};


export const signUp = async ({ email, password }) => {
  try {
    const res = await client().get('/');
    return processResponse(res);
  } catch (err) {
    console.error(err);
    return processErrorResponse(err);
  }
};

export const resetPassword = async ({ email }) => {
  try {
    const res = await client().get('/');
    return processResponse(res);
  } catch (err) {
    console.error(err);
    return processErrorResponse(err);
  }
};

export const fetchUserByToken = async ({ token }) => {
  try {
    let query = `/me?at=${token}`;

    const res = await client().get(query);
    return processResponse(res);
  } catch (err) {
    console.error(err);
    return processErrorResponse(err);
  }
};
