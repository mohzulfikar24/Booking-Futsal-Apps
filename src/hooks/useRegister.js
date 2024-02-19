import { useQueryClient, useMutation } from "react-query";
import { RegisterData, registerRequest } from "../utils/Axios";
// import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

export function useRegistration() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const registerMutation = useMutation(registerRequest, {
    onSuccess: () => {
      queryClient.invalidateQueries("register");
      message.success("Registrasi Berhasil, Silahkan Login");
      navigate("/login");
    },
    onError: (err) => {
    //   toast.error(err.response.data.message);
      message.error(err.response.data.message);
    },
  });

  const register = async (data) => {
    try {
      await registerMutation.mutateAsync(data);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    register,
    isLoading: registerMutation.isLoading,
    isSuccess: registerMutation.isSuccess,
    isError: registerMutation.isError,
  };
}