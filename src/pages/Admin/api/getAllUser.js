import axios from 'axios';

export const getAllUsers = (token, name) => {
  return axios.get(
    `https://e-field.vercel.app/api/users/search?search=${name}`,
    {
      headers: {
        'x-access-token': token,
      },
    }
  );
};
