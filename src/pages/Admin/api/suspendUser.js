import axios from 'axios';

export const suspendUserApi = (token, id, body) => {
  return axios.post(`https://e-field.vercel.app/api/admin/suspend/${id}`, {msg : body}, {
    headers: {
      'x-access-token': token,
    },
  });
};
