import http from './httpService';
import jwtDecode from 'jwt-decode';

const apiEndpoint = process.env.REACT_APP_API_URL + '/auth';

export async function register(data) {
  const { headers } = await http.post(`${apiEndpoint}/register`, {
    team: data.team,
    name: data.name,
    email: data.email,
    password: data.password,
  });
  localStorage.setItem(http.tokenKey, headers['x-auth-token']);
}

export async function login(data) {
  const { headers } = await http.post(`${apiEndpoint}/login`, {
    team: data.team,
    email: data.email,
    password: data.password,
  });
  localStorage.setItem(http.tokenKey, headers['x-auth-token']);
}

export function logout() {
  localStorage.removeItem(http.tokenKey);
}

export function getCurrentUser() {
  try {
    const jwt = localStorage.getItem(http.tokenKey);
    return jwtDecode(jwt);
  } catch (ex) {
    return null;
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  login,
  register,
  logout,
  getCurrentUser,
};
