import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./signin.css";
import { useSnackbar } from "notistack";
import { useUser } from "../../hooks/useUser";

const Signin = () => {
  const { addUser } = useUser();

  const [email, setEmail] = useState<null | string>(null);
  const [password, setPassword] = useState<null | string>(null);

  const handleSignin = async () => {
    addUser(email, password)
  };

  return (
    <div className="signin">
      <h1 className="signin__header">Sign in</h1>
      <div className="signin__form">
        <TextField
          className="signin__form__textfield"
          label="Email Address"
          variant="filled"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          className="signin__form__textfield"
          label="Password"
          variant="filled"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          className="signin__form__button"
          size="large"
          variant="contained"
          onClick={handleSignin}
        >
          Sign In
        </Button>
        <div>
          Don't have an account? <NavLink to="/signup">Sign Up</NavLink>
        </div>
      </div>
    </div>
  );
};

export default Signin;
