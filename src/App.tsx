import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import View from "./components/View/View";
import Signup from "./components/Signup/Signup";
import Signin from "./components/Signin/Signin";
import { SnackbarProvider } from "notistack";
import { UserContext } from "./User/userContext";
import { useState } from "react";
import { User } from "./hooks/useUser";


function App() {
  const [user, setUser] = useState<User | null>(null)

  const router = createBrowserRouter([
    {
      element: <Navbar />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/view",
          element: <View />,
        },
        {
          path: "/signup",
          element: <Signup />,
        },
        {
          path: "/signin",
          element: <Signin />,
        },
      ],
    },
  ]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
    <SnackbarProvider maxSnack={3} autoHideDuration={2000}>
      <div className="App">
        <RouterProvider router={router} />
      </div>
    </SnackbarProvider>
    </UserContext.Provider>
  );
}

export default App;
