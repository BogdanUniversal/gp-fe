import { NavLink, Outlet } from "react-router-dom";
import "./navbar.css";
import { BsFillMenuButtonWideFill } from "react-icons/bs";
import { GoHomeFill } from "react-icons/go";
import { MdModelTraining, MdOutlineInfo } from "react-icons/md";
import { GrView } from "react-icons/gr";
import { IoIosArrowForward } from "react-icons/io";
import Profile from "../Profile/Profile";

const Navbar = () => {
  return (
    <div className="navbar__wrapper">
      <Profile />
      <div className="navbar">
        <div className="navbar__header">
          <div>
            <BsFillMenuButtonWideFill />
            <div className="navbar__text">Menu</div>
          </div>
        </div>
        <NavLink
          to="/"
          className={({ isActive }) => {
            return isActive ? "navbar__link active" : "navbar__link";
          }}
        >
          <GoHomeFill />
          <div className="navbar__text">Home</div>
          <IoIosArrowForward className="navbar__link__icon" />
        </NavLink>
        <NavLink
          to="/train"
          className={({ isActive }) => {
            return isActive ? "navbar__link active" : "navbar__link";
          }}
        >
          <MdModelTraining />
          <div className="navbar__text">Train Algorithm</div>
          <IoIosArrowForward className="navbar__link__icon" />
        </NavLink>
        <NavLink
          to="/view"
          className={({ isActive }) => {
            return isActive ? "navbar__link active" : "navbar__link";
          }}
        >
          <GrView />
          <div className="navbar__text">Visualize Algorithm</div>
          <IoIosArrowForward className="navbar__link__icon" />
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) => {
            return isActive ? "navbar__link active" : "navbar__link";
          }}
        >
          <MdOutlineInfo />
          <div className="navbar__text">About</div>
          <IoIosArrowForward className="navbar__link__icon" />
        </NavLink>
      </div>
      <Outlet />
    </div>
  );
};

export default Navbar;
