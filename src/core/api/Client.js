import axios from 'axios';
import constants from '../constants';

export const client = ({ apiUrl, ...otherOptions } = {}) => {
  const defaultOptions = {
    baseURL: apiUrl || `${constants.BASE_API_URL}`,
    withCredentials: true,
    ...otherOptions
  };

  const instance = axios.create({
    ...defaultOptions
  });

  return instance;
};

export const processResponse = response => {
  const result = {
    ...response,
    success: true
  };

  return result;
};

export const processErrorResponse = response => {
  const result = {
    ...response,
    success: true,
    error: true
  };

  return result;
};
