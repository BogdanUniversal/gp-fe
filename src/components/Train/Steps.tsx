import "./train.css";
import { BsDatabase } from "react-icons/bs";
import { IoOptionsOutline } from "react-icons/io5";
import { MdModelTraining } from "react-icons/md";
import { MdArrowForward } from "react-icons/md";
import { NavLink } from "react-router-dom";

const Steps = () => {
  return (
    <div className="steps__container">
      <h1 className="steps__title">Dataset Selection & Model Training</h1>
      <div className="steps">
        <NavLink to={"/train/data"} className="steps__step">
          <div className="steps__step__icon">
            <BsDatabase />
          </div>
          <div className="steps__step__title">Step 1</div>
          <div className="steps__step__description">
            Upload new datasets, access previous uploaded dataset and visualize
            the dataset you wish to experiment with.
          </div>
        </NavLink>
        <div className="steps__forwardIcon">
          <MdArrowForward />
        </div>
        <NavLink to={"/train/parametrization"} className="steps__step">
          <div className="steps__step__icon">
            <IoOptionsOutline />
          </div>
          <div className="steps__step__title">Step 2</div>
          <div className="steps__step__description">
            Choose different tehniques for processing the data and different
            parameters for how the model is trained.
          </div>
        </NavLink>
        <div className="steps__forwardIcon">
          <MdArrowForward />
        </div>
        <NavLink to={"/train/train"} className="steps__step">
          <div className="steps__step__icon">
            <MdModelTraining />
          </div>
          <div className="steps__step__title">Step 3</div>
          <div className="steps__step__description">
            See in real time how the model is trained and its performance over
            time.
          </div>
        </NavLink>
      </div>
    </div>
  );
};

export default Steps;
