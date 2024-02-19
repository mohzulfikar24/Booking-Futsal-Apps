import { useCallback, useState } from 'react';
import { deleteFieldById } from '../../../utils/Axios';

export const useDeleteField = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisibility, setModalVisibility] = useState(false);

  const deleteFIeld = useCallback(async (id, token, cb) => {
    try {
      setIsLoading(true);
      await deleteFieldById(id, token);
      if (typeof cb === 'function') {
        cb();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      setModalVisibility(false);
    }
  }, []);

  const toggleModal = useCallback(() => {
    setModalVisibility((prev) => !prev);
  }, []);

  return { deleteFIeld, toggleModal, isLoading, modalVisibility };
};
