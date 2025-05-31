import { FaAngleRight } from "react-icons/fa6";
import Loader from "../Loader/Loader";

const Models = () => {
  return (
    <div className="models">
      <div className="data__header">Select the dataset for training</div>
      {/* <div className="data__previous">
        <div className="data__previous__header">Previous uploaded datasets</div>
        <div className="data__previous__files">
          {isLoading ? (
            <Loader />
          ) : previousFiles.length > 0 ? (
            previousFiles.map((model) => (
              <div
                key={model.id}
                className={
                  model.id === modelCotmext?.id
                    ? "data__previous__files__file active"
                    : "data__previous__files__file"
                }
                onClick={() => handleSelectModel(model.id)}
              >
                <FaFileCsv className="data__previous__files__file__icon" />{" "}
                <div className="data__previous__files__file__name">
                  {model.name}
                </div>
                <div className="data__previous__files__file__date">
                  {model.date}
                </div>
                <FaAngleRight />
              </div>
            ))
          ) : (
            <div className="data__previous__files__file empty">
              No previous uploaded datasets
            </div>
          )}
        </div>
      </div> */}
    </div>
  );
};

export default Models;
