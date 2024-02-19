import { useCallback, useState } from 'react';
import { unSuspendUser } from '../api/unSuspendUser';
import { message } from 'antd';

export const useUnsuspendUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [unsuspendModalVisibility, setUnsuspendModalVisibility] =
    useState(false);

  const handleUnsuspendUser = useCallback(async (id, token, cb) => {
    try {
      setIsLoading(true);

      await unSuspendUser(token, id);
      message.success('success unsuspend account')
      setIsLoading(false);
      setUnsuspendModalVisibility(false);
      if (typeof cb === 'function') cb();
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setUnsuspendModalVisibility(false);
    }
  }, []);

  const toggleUnsusoendModal = useCallback(() => {
    setUnsuspendModalVisibility((val) => !val);
  }, []);

  return {
    isLoading,
    handleUnsuspendUser,
    unsuspendModalVisibility,
    toggleUnsusoendModal,
  };
};
