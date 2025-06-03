import "./train.css";
import { NavLink, Outlet } from "react-router-dom";
import { BsDatabase } from "react-icons/bs";
import { IoOptionsOutline } from "react-icons/io5";
import { MdModelTraining } from "react-icons/md";
import { Dataset, DatasetContext } from "../../Data/dataContext";
import { useEffect, useState } from "react";
import { Options, OptionsContext } from "../Options/optionsContext";

const Train = () => {
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [options, setOptions] = useState<Options>({
    selectedFeatures: [],
    selectedLabel: "",
    corrOpt: "Spearman",
    dimRedOpt: "PCA",
    popSize: 50,
    genCount: 100,
    treeDepth: 10,
    crossChance: 0.5,
    mutationChance: 0.2,
    mutationFunction: [{ id: "mutUniform", name: "Uniform Mutation" }],
    selectionMethod: { id: "tournament", name: "Tournament Selection" },
    objective: "Classification",
    functions: [
      { id: "if", name: "If Then Else", type: "Primitive" },
      {
        id: "rand_gauss_0",
        name: "Random Normal (0 Mean)",
        type: "Terminal",
      },
    ],
  });

  return (
    <DatasetContext.Provider
      value={{ dataset: dataset, setDataset: setDataset }}
    >
      <OptionsContext.Provider
        value={{ options: options, setOptions: setOptions }}
      >
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
              <BsDatabase /> <div className="train__steps__option_text">Data</div>
            </NavLink>
            <NavLink
              className={({ isActive }) => {
                return isActive
                  ? "train__steps__option active"
                  : "train__steps__option";
              }}
              to={"/train/parametrization"}
            >
              <IoOptionsOutline /> <div className="train__steps__option_text">Parametrization</div>
            </NavLink>
            <NavLink
              className={({ isActive }) => {
                return isActive
                  ? "train__steps__option active"
                  : "train__steps__option";
              }}
              to={"/train/train"}
            >
              <MdModelTraining /> <div className="train__steps__option_text">Train</div>
            </NavLink>
          </div>
          <Outlet />
        </div>
      </OptionsContext.Provider>
    </DatasetContext.Provider>
  );
};

export default Train;
