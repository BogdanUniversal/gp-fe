import "./train.css";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { BsDatabase } from "react-icons/bs";
import { IoOptionsOutline } from "react-icons/io5";
import { MdModelTraining } from "react-icons/md";

const Train = () => {
  return (
    <div className="train">
      <div className="train__steps">
        <NavLink
          className={({ isActive }) => {
            return isActive
              ? "train__steps__option active"
              : "train__steps__option";
          }}
          to={"/train/data"}
        >
          <BsDatabase /> Data
        </NavLink>
        <NavLink
          className={({ isActive }) => {
            return isActive
              ? "train__steps__option active"
              : "train__steps__option";
          }}
          to={"/train/param"}
        >
          <IoOptionsOutline /> Parametrization
        </NavLink>
        <NavLink
          className={({ isActive }) => {
            return isActive
              ? "train__steps__option active"
              : "train__steps__option";
          }}
          to={"/train/train"}
        >
          <MdModelTraining /> Train
        </NavLink>
      </div>
      <Outlet />
    </div>
  );
};

export default Train;
