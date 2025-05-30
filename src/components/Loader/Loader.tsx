import "./loader.css";
import { Tailspin } from "ldrs/react";
import "ldrs/react/Tailspin.css";

const Loader = ({ color = "grey" }) => {
  return (
    <div className="loader">
      <Tailspin size="60" stroke="6" speed="0.9" color={color} />
    </div>
  );
};

export default Loader;
