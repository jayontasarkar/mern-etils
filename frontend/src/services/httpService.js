import axios from 'axios';
import { toast } from 'react-toastify';

const tokenKey = 'etilsauthtoken';

axios.interceptors.response.use(null, (error) => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (!expectedError) {
    console.log(error);
    toast.error('An unexpected error occurrred.');
  }

  return Promise.reject(error);
});

axios.interceptors.request.use(function (config) {
  const token = getJwt() || '';
  config.headers['x-auth-token'] = token;

  return config;
});

export function getJwt() {
  return localStorage.getItem(tokenKey);
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  tokenKey,
};
