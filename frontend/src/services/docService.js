import http from './httpService';

const apiEndpoint = process.env.REACT_APP_API_URL + '/docs';

export const uploadFiles = (payload, config) => {
  return http.post(`${apiEndpoint}/uploadfiles`, payload, config);
};

export const find = (id) => {
  return http.get(`${apiEndpoint}/${id}`);
};

export const preview = (id) => {
  return http.get(`${apiEndpoint}/preview/${id}`);
};

export const save = (payload) => {
  return http.post(`${apiEndpoint}`, payload);
};

export const update = (id, payload) => {
  return http.put(`${apiEndpoint}/${id}`, payload);
};

export const remove = (id) => {
  return http.delete(`${apiEndpoint}/${id}`);
};

export const myDocs = () => {
  return http.get(`${apiEndpoint}`);
};

export const sharedDocs = () => {
  return http.get(`${apiEndpoint}/shared`);
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  uploadFiles,
  myDocs,
  save,
  sharedDocs,
  preview,
};
