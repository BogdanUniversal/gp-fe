import { createContext, Dispatch, SetStateAction } from "react";
import { User } from "../hooks/useUser";

interface UserContext {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
}

export const UserContext = createContext<UserContext>({
  user: null,
  setUser: () => {},
});