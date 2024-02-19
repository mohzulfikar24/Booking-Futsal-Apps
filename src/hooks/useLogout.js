import { message } from 'antd';
import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import authAction from '../redux/actions/auth';
import { logout } from '../utils/Axios';

export const useLogout = (token) => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleLogout = useCallback(async () => {
    try {
      setIsLoading(true);
      await logout(token);
      dispatch(authAction.resetReducer());
      setIsLoading(false);
      setIsModalOpen(false);
      message.success('Logout Success');
      navigate('/', {
        replace: true,
      });
    } catch (error) {
      message.info(error.response.data.msg);
      setIsLoading(false);
      setIsModalOpen(false);
    }
  }, [token, dispatch, navigate]);

  return { isLoading, isModalOpen, setIsModalOpen, handleLogout };
};
