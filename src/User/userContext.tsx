import { createContext, Dispatch, SetStateAction } from "react";
import { User } from "../hooks/useUser";

interface UserContext {
  user: User | null | undefined;
  setUser: Dispatch<SetStateAction<User | null | undefined>>;
}

export const UserContext = createContext<UserContext>({
  user: null,
  setUser: () => {},
});