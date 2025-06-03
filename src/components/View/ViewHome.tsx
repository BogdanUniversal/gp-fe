import "./view.css";
import { IoStatsChartSharp } from "react-icons/io5";
import { MdArrowForward } from "react-icons/md";
import { NavLink } from "react-router-dom";
import { ImTree } from "react-icons/im";
import { TbBoxModel2 } from "react-icons/tb";
import { MdBatchPrediction } from "react-icons/md";

const ViewHome = () => {
  return (
    <div className="view-steps__container">
      <h1 className="view-steps__title">Model Visualization & Analysis</h1>
      <div className="view-steps">
        <NavLink to={"/view/model"} className="view-steps__step">
          <div className="view-steps__step__icon">
            <TbBoxModel2 />
          </div>
          <div className="view-steps__step__title">Model Selection</div>
          <div className="view-steps__step__description">
            Browse and select from your trained models to analyze their
            performance metrics, their structure, and make predictions.
          </div>
        </NavLink>

        <div className="view-steps__forwardIcon">
          <MdArrowForward />
        </div>

        <NavLink to={"/view/performance"} className="view-steps__step">
          <div className="view-steps__step__icon">
            <IoStatsChartSharp />
          </div>
          <div className="view-steps__step__title">Performance Analysis</div>
          <div className="view-steps__step__description">
            Evaluate model performance with detailed metrics and compare results
            across different datasets.
          </div>
        </NavLink>

        <div className="view-steps__forwardIcon">
          <MdArrowForward />
        </div>

        <NavLink to={"/view/tree"} className="view-steps__step">
          <div className="view-steps__step__icon">
            <ImTree />
          </div>
          <div className="view-steps__step__title">Tree Visualization</div>
          <div className="view-steps__step__description">
            Visualize the structure of your model as an interactive tree diagram
            and explore how different nodes contribute to predictions.
          </div>
        </NavLink>

        <div className="view-steps__forwardIcon">
          <MdArrowForward />
        </div>

        <NavLink to={"/view/predict"} className="view-steps__step">
          <div className="view-steps__step__icon">
            <MdBatchPrediction />
          </div>
          <div className="view-steps__step__title">Prediction</div>
          <div className="view-steps__step__description">
            Test your model with new inputs to make real-time predictions.
          </div>
        </NavLink>
      </div>
    </div>
  );
};

export default ViewHome;
