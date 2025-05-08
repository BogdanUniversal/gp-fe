import "./App.css";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
  useNavigate,
} from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import View from "./components/View/View";
import Signup from "./components/Signup/Signup";
import Signin from "./components/Signin/Signin";
import Train from "./components/Train/Train";
import { enqueueSnackbar, SnackbarProvider } from "notistack";
import { useEffect, useState } from "react";
import { User } from "./hooks/useUser";
import { api } from "./User/api";
import Steps from "./components/Train/Steps";
import Data from "./components/Train/Data";

import { UserContext } from "./User/userContext";
import Loader from "./components/Loader/Loader";

function App() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get("/users/test", {
          withCredentials: true,
        });
        console.log("Test response:", response.data);
        setUser({ name: response.data.user }); // Set user if authenticated
      } catch (error) {
        console.log("Test failed:", error);
        setUser(null);
      }
    };

    checkAuth();
  }, []);

  interface ProtectedRouteProps {
    children: JSX.Element;
  }

  const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const navigate = useNavigate();
    const checkAuth = async () => {
      try {
        const response = await api.get("/users/test", {
          withCredentials: true,
        });
        console.log("Test response:", response.data);
      } catch (error) {
        console.log("Test failed:", error);
        setUser(null);
        navigate("/signin", { replace: true });
      }
    };

    checkAuth();

    if (user === undefined) {
      return <Loader />; // Render loader while waiting for the authentication check
    }

    if (!user) {
      enqueueSnackbar("You must be signed in!", { variant: "info" });
      return <Navigate to="/signin" replace />;
    }

    return children;
  };

  const router = createBrowserRouter([
    {
      element: <Navbar />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/train",
          element: (
            <ProtectedRoute>
              <Train />
            </ProtectedRoute>
          ),
          children: [
            {
              path: "",
              element: (
                <ProtectedRoute>
                  <Steps />
                </ProtectedRoute>
              ),
            },
            {
              path: "data",
              element: (
                <ProtectedRoute>
                  <Data />
                </ProtectedRoute>
              ),
            },
          ],
        },
        {
          path: "/view",
          element: (
            <ProtectedRoute>
              <View />
            </ProtectedRoute>
          ),
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
