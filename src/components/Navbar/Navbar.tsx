import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import "./navbar.css"
import { BsFillMenuButtonWideFill } from "react-icons/bs";
import { GoHomeFill } from "react-icons/go";
import { MdModelTraining, MdOutlineInfo } from "react-icons/md";
import { GrView } from "react-icons/gr";
import { IoIosArrowForward } from "react-icons/io";
import { useEffect, useState } from "react";
import Profile from "../Profile/Profile";

const Navbar = () => {
    return <div className="navbar__wrapper">
        <Profile/>
        <div className="navbar">
            <div className="navbar__header"><BsFillMenuButtonWideFill />Menu</div>
            <NavLink
                to="/"
                className={({ isActive }) => {
                    return isActive ? "navbar__link active" : "navbar__link";
                }}
            ><GoHomeFill />Home<IoIosArrowForward className="navbar__link__icon"/></NavLink>
            <NavLink
                to="/train"
                className={({ isActive }) => {
                    return isActive ? "navbar__link active" : "navbar__link";
                }}
            ><MdModelTraining />Train algorithm<IoIosArrowForward className="navbar__link__icon"/></NavLink>
            <NavLink
                to="/view"
                className={({ isActive }) => {
                    return isActive ? "navbar__link active" : "navbar__link";
                }}
            ><GrView />Visualize algorithm<IoIosArrowForward className="navbar__link__icon"/></NavLink>
            <NavLink
                to="/about"
                className={({ isActive }) => {
                    return isActive ? "navbar__link active" : "navbar__link";
                }}
            ><MdOutlineInfo />About<IoIosArrowForward className="navbar__link__icon"/></NavLink>
        </div>
        <Outlet />
    </div>
}

export default Navbar;