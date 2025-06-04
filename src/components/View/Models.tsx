import { FaAngleRight } from "react-icons/fa6";
import Loader from "../Loader/Loader";
import { useContext, useEffect, useState } from "react";
import { api } from "../../User/api";
import { enqueueSnackbar } from "notistack";
import { ModelContext } from "../Model/ModelContext";
import { TbBoxModel2 } from "react-icons/tb";
import "./view.css"
import { useNavigate } from "react-router-dom";

const Models = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [models, setModels] = useState<
    {
      id: string;
      dataset_name: string;
      model_name: string;
      train_date: string;
    }[]
  >([]);
  const { model, setModel } = useContext(ModelContext);
  const navigate = useNavigate();

  const handleGetModels = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/models/get_models", {
        withCredentials: true,
      });
      const models = response.data.models;
      if (models.length === 0) setModels([]);
      else {
        setModels(
          models.map(
            (model: {
              id: string;
              dataset_name: string;
              model_name: string;
              train_date: string;
            }) => ({
              id: model.id,
              dataset_name: model.dataset_name,
              model_name: model.model_name,
              train_date: new Date(model.train_date).toLocaleDateString(
                "en-GB",
                {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                }
              ),
            })
          )
        );
      }
    } catch (error) {
      enqueueSnackbar("Error fetching models", { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGetModels();
  }, []);

  return (
    <div className="models">
      <div className="models__header">Select the model for analysis</div>
      <div className="models__previous">
        <div className="models__previous__header">Previous trained models</div>
        <div className="models__previous__models">
          {isLoading ? (
            <Loader />
          ) : models.length > 0 ? (
            models.map((md) => (
              <div
                key={md.id}
                className={
                  md.id === model?.id
                    ? "models__previous__models__model active"
                    : "models__previous__models__model"
                }
                onClick={() => {
                  setModel(md)
                  navigate("/view/performance");
                  enqueueSnackbar(
                    `Model "${md.model_name}" selected`,
                    { variant: "success"})
                }}
              >
                <TbBoxModel2 className="models__previous__models__model__icon" />{" "}
                <div className="models__previous__models__model__name">
                  {md.dataset_name} - {md.model_name}
                </div>
                <div className="models__previous__models__model__date">
                  {md.train_date}
                </div>
                <FaAngleRight />
              </div>
            ))
          ) : (
            <div className="models__previous__models__model empty">
              No previous trained models
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Models;
