import "./home.css";
import { MdModelTraining } from "react-icons/md";
import { GrView } from "react-icons/gr";
import { AiTwotoneExperiment } from "react-icons/ai";
import { IoOptionsOutline } from "react-icons/io5";

const Home = () => {
  return (
    <div className="home">
      <div className="home__title">Experiment Genetic Programming</div>
      <img className="home__background" src="/resources/evolution.svg" />
      <div className="home__description">
        <div className="home__description__el a">
          <IoOptionsOutline className="home__description__el__icon" />
          <div className="home__description__el__text">
            Parameterize the algorithm to suit your needs!
          </div>
        </div>
        <div className="home__description__el b">
          <MdModelTraining className="home__description__el__icon" />
          <div className="home__description__el__text">
            Train your chosen algorithm until no progress or no. steps are reached!
          </div>
        </div>
        <div className="home__description__el c">
          <GrView className="home__description__el__icon" />
          <div className="home__description__el__text">
            Visualize the algorithm performance and its structure!
          </div>
        </div>
        <div className="home__description__el d">
          <AiTwotoneExperiment className="home__description__el__icon" />
          <div className="home__description__el__text">Keep experimenting!</div>
        </div>
      </div>
    </div>
  );
};

export default Home;
