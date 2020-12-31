import http from './httpService';

const apiEndpoint = process.env.REACT_APP_API_URL + '/teams';

export async function setup(payload) {
  const { data } = await http.post(`${apiEndpoint}/setup`, payload);
  localStorage.setItem(http.tokenKey, data);
  return data;
}

export async function members(except = false) {
  return await http.get(`${apiEndpoint}/members?except=${except}`);
}

export async function removeMember(memberId) {
  return await http.delete(`${apiEndpoint}/members/${memberId}`);
}

export async function registerAndJoin(payload) {
  const { data } = await http.post(`${apiEndpoint}/join`, payload);
  localStorage.setItem(http.tokenKey, data);
  return data;
}

export async function joinLink(payload) {
  return await http.post(`${apiEndpoint}/join-link`, payload);
}

export async function loginAndJoin(payload) {
  const { data } = await http.post(`${apiEndpoint}/login-with-join`, payload);
  localStorage.setItem(http.tokenKey, data);
  return data;
}

export async function check(id) {
  return await http.get(`${apiEndpoint}/invitations/${id}/check`);
}

export async function getInvitations() {
  return await http.get(`${apiEndpoint}/invitations`);
}

export async function postInvitations(payload) {
  return await http.post(`${apiEndpoint}/invitations`, payload);
}

export async function deleteInvitations(id) {
  return await http.delete(`${apiEndpoint}/invitations/${id}`);
}

export async function resendInvitations(id) {
  return await http.post(`${apiEndpoint}/invitations/${id}/resend`);
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  setup,
  getInvitations,
  postInvitations,
  deleteInvitations,
  resendInvitations,
  removeMember,
  registerAndJoin,
  loginAndJoin,
  joinLink,
};
