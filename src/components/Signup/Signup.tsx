import { Button, TextField, Tooltip } from "@mui/material";
import "./signup.css";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [firstName, setFirstName] = useState<null | {
    text: string;
    test: boolean;
  }>(null);
  const [lastName, setLastName] = useState<null | {
    text: string;
    test: boolean;
  }>(null);
  const [email, setEmail] = useState<null | { text: string; test: boolean }>(
    null
  );
  const [password, setPassword] = useState<null | {
    text: string;
    test: boolean;
  }>(null);
  const [confirmPassword, setConfirmPassword] = useState<null | {
    text: string;
    test: boolean;
  }>(null);

  const handleName = (name: string, type: "firstName" | "lastName") => {
    if (type == "firstName")
      setFirstName({ text: name, test: name.length >= 2 });
    else setLastName({ text: name, test: name.length >= 2 });
  };

  const handleEmail = (email: string) => {
    const regex = new RegExp("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$");
    const test = regex.test(email);
    setEmail({ text: email, test: test });
  };

  const handlePassword = (
    password: string | undefined,
    confirmPassword: string | undefined
  ) => {
    const regex = new RegExp("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$");

    if (password) {
      const testPassword = regex.test(password);
      setPassword({ text: password, test: testPassword });
    } else setPassword({ text: "", test: false });

    if (confirmPassword) {
      const testConfirmPassword = regex.test(confirmPassword);
      setConfirmPassword({
        text: confirmPassword,
        test: testConfirmPassword && confirmPassword == password,
      });
    } else setConfirmPassword({ text: "", test: false });
  };

  const handleSignup = async () => {
    try {
      if (email?.test && firstName?.test && lastName?.test && password?.test) {
        const response = await axios.post(
          "http://localhost:5000/users/signup",
          {
            email: email.text,
            first_name: firstName.text,
            last_name: lastName.text,
            password: password.text,
          }
        );
        if (response.request.status === 201) {
          enqueueSnackbar("Signed up sucesfully!", { variant: "success" });
          navigate("/signin")
        }
      }
      else enqueueSnackbar("Missing information!", { variant: "error" });
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        if (error.request.status === 409)
          enqueueSnackbar("Account already exists!", { variant: "info" });
        else if (error.request.status === 422)
          enqueueSnackbar("Missing information!", { variant: "error" });
      }
    }
  };

  return (
    <div className="signup">
      <h1 className="signup__header">Register your account</h1>
      <div className="signup__form">
        <TextField
          error={!firstName?.test}
          className="signup__form__textfield"
          label="First Name"
          variant="filled"
          value={firstName?.text}
          onChange={(e) => handleName(e.target.value, "firstName")}
        />
        <TextField
          error={!lastName?.test}
          className="signup__form__textfield"
          label="Last Name"
          variant="filled"
          value={lastName?.text}
          onChange={(e) => handleName(e.target.value, "lastName")}
        />
        <TextField
          error={!email?.test}
          className="signup__form__textfield"
          label="Email Address"
          variant="filled"
          value={email?.text}
          onChange={(e) => handleEmail(e.target.value)}
        />
        <Tooltip
          title={
            <span className="signup__form__tooltip">
              At least 8 characters and 1 letter
            </span>
          }
          placement="right-start"
        >
          <TextField
            error={!password?.test}
            className="signup__form__textfield"
            label="Password"
            variant="filled"
            type="password"
            value={password?.text}
            onChange={(e) =>
              handlePassword(e.target.value, confirmPassword?.text)
            }
          />
        </Tooltip>
        <TextField
          error={!confirmPassword?.test}
          className="signup__form__textfield"
          label="Confirm Password"
          variant="filled"
          type="password"
          value={confirmPassword?.text}
          onChange={(e) => handlePassword(password?.text, e.target.value)}
        />
        <Button
          className="signup__form__button"
          size="large"
          variant="contained"
          onClick={handleSignup}
        >
          Create Account
        </Button>
        <div>
          Already have an account? <NavLink to="/signin">Sign In</NavLink>
        </div>
      </div>
    </div>
  );
};

export default Register;
