import axios from 'axios';

export const getFieldsByOwnerId = (token, owner, name) => {
  return axios.get(`https://e-field.vercel.app/api/field?ownerId=${owner}&name=${name}`, {
    headers: {
      'x-access-token': token,
    },
  });
};
