import axios from 'axios';

export const unSuspendUser = (token, id) => {
  return axios.delete(`https://e-field.vercel.app/api/admin/unsuspend/${id}`, {
    headers: {
      'x-access-token': token,
    },
  });
};
