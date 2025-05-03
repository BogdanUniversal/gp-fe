import { useContext } from "react";
import { UserContext } from "../User/userContext";
import { useSnackbar } from "notistack";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { api } from "../User/api";

export interface User {
  name: string;
}

export const useUser = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const addUser = async (email: string | null, password: string | null) => {
    try {
        if (email && password) {
          const response = await api.post(
            "/users/signin",
            { email: email, password: password },
            {
              withCredentials: true,
            }
          );
          if (response.request.status === 201) {
            setUser({name: response.data.first_name});
            localStorage.setItem("user", JSON.stringify(response.data.first_name));
            enqueueSnackbar("Signed in sucesfully!", { variant: "success" });
            navigate("/");
          }
        } else enqueueSnackbar("Missing credentials!", { variant: "error" });
      } catch (error) {
        console.error(error);
        if (axios.isAxiosError(error)) {
          if (error.request.status === 401)
            enqueueSnackbar("Wrong credentials!", { variant: "error" });
          else if (error.request.status === 422)
            enqueueSnackbar("Missing credentials!", { variant: "error" });
        }
      }
  };

  const removeUser = async () => {
    try {
      await api.get("/users/signout", { withCredentials: true });
      localStorage.removeItem("user");
      setUser(null);
      enqueueSnackbar("Signed out!", { variant: "info" });
      navigate("/", { replace: true });
    } catch (error) {
      console.error(error);
    }
  };

  return { user, addUser, removeUser, setUser };
};
