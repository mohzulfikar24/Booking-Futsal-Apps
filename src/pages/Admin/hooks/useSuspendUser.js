import { useCallback, useState } from 'react';
import { suspendUserApi } from '../api/suspendUser';
import { message } from 'antd';

export const useSuspendUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [suspendModalVisibility, setSuspaendModalVisibility] = useState(false);

  const suspendUser = useCallback(async (id, token, cb, messageSuspend) => {
    try {
      setIsLoading(true);

      await suspendUserApi(token, id, messageSuspend);
      message.success('success suspend account')
      setIsLoading(false);
      setSuspaendModalVisibility(false);
      if (typeof cb === 'function') cb();
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setSuspaendModalVisibility(false);
    }
  }, []);
  const toggleSuspendModal = useCallback(() => {
    setSuspaendModalVisibility((val) => !val);
  }, []);

  return { isLoading, suspendUser, suspendModalVisibility, toggleSuspendModal };
};
