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

export const deleteUser = async ({ token, userEmail }) => {
    try {
        const res = await client().delete('/AdminUserManagement', { data: { token, user_email: userEmail } });
        return processResponse(res);
    } catch (err) {
        console.error(err);
        return processErrorResponse(err);
    }
};
