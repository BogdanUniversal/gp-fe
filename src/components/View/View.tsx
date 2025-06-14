import "./view.css";
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { ImTree } from "react-icons/im";
import { TbBoxModel2 } from "react-icons/tb";
import { IoStatsChartSharp } from "react-icons/io5";
import { Model, ModelContext } from "../Model/ModelContext";
import { MdBatchPrediction } from "react-icons/md";

const View = () => {
  const [model, setModel] = useState<Model | null>(null);

  return (
    <ModelContext.Provider value={{ model, setModel }}>
      <div className="view">
        <div className="view__nav">
          <div className="view__nav__steps">
            <NavLink
              className={({ isActive }) => {
                return isActive
                  ? "view__nav__steps__option active"
                  : "view__nav__steps__option";
              }}
              to={"/view/model"}
            >
              <TbBoxModel2 /> <div className="view__nav__steps__text">Model</div>
            </NavLink>
            <NavLink
              className={({ isActive }) => {
                return isActive
                  ? "view__nav__steps__option active"
                  : "view__nav__steps__option";
              }}
              to={"/view/performance"}
            >
              <IoStatsChartSharp /> <div className="view__nav__steps__text">Performance</div>
            </NavLink>
            <NavLink
              className={({ isActive }) => {
                return isActive
                  ? "view__nav__steps__option active"
                  : "view__nav__steps__option";
              }}
              to={"/view/tree"}
            >
              <ImTree /> <div className="view__nav__steps__text">Tree</div>
            </NavLink>
            <NavLink
              className={({ isActive }) => {
                return isActive
                  ? "view__nav__steps__option active"
                  : "view__nav__steps__option";
              }}
              to={"/view/predict"}
            >
              <MdBatchPrediction /> <div className="view__nav__steps__text">Predict</div>
            </NavLink>
          </div>
          <Outlet />
        </div>
      </div>
    </ModelContext.Provider>
  );
};

export default View;
