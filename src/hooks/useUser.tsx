import { useContext } from "react";
import { UserContext } from "../User/userContext";
import { useSnackbar } from "notistack";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
          const response = await axios.post(
            "http://localhost:5000/users/signin",
            { email: email, password: password },
            {
              withCredentials: true,
            }
          );
          if (response.request.status === 201) {
            setUser({name: response.data.first_name});
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
      await axios.post("http://localhost:5000/users/signout");
      enqueueSnackbar("Signed out!", { variant: "info" });
      navigate("/");
    } catch (error) {
      console.error(error);
    }
    setUser(null);
  };

  return { user, addUser, removeUser, setUser };
};
