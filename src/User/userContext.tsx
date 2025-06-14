import { createContext, Dispatch, SetStateAction } from "react";

export interface User {
  name: string;
}

interface UserContext {
  user: User | null | undefined;
  setUser: Dispatch<SetStateAction<User | null | undefined>>;
}

export const UserContext = createContext<UserContext>({
  user: null,
  setUser: () => {},
});