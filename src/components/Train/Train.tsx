import "./train.css";
import { NavLink, Outlet } from "react-router-dom";
import { BsDatabase } from "react-icons/bs";
import { IoOptionsOutline } from "react-icons/io5";
import { MdModelTraining } from "react-icons/md";
import { Dataset, DatasetContext } from "../../Data/dataContext";
import { useEffect, useState } from "react";

const Train = () => {
  const [dataset, setDataset] = useState<Dataset | null>(null);

  useEffect(() => {
    console.log("Dataset changed:", dataset);
  }, [dataset]);

  return (
    <DatasetContext.Provider value={{ dataset: dataset, setDataset: setDataset }}>
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
            to={"/train/parametrization"}
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
    </DatasetContext.Provider>
  );
};

export default Train;
