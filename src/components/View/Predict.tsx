import "./view.css";
import { useContext, useEffect, useState } from "react";
import { ModelContext } from "../Model/ModelContext";
import { Button, TextField } from "@mui/material";
import { api } from "../../User/api";
import { enqueueSnackbar } from "notistack";
import Loader from "../Loader/Loader";

interface ModelVariable {
  name: string;
  type: string;
}

const Predict = () => {
  const { model } = useContext(ModelContext);
  const [variables, setVariables] = useState<ModelVariable[]>([]);
  const [values, setValues] = useState<Record<string, string | number>>({});
  const [loading, setLoading] = useState<boolean>(false);

  const handlePredict = () => {
    if (model && Object.keys(values).length > 0) {
      api
        .post(
          "/models/make_prediction",
          { model_id: model.id, data: values },
          { withCredentials: true }
        )
        .then((response) => {
          const classes: string[] = response.data.prediction.label_classes;
          enqueueSnackbar(
            <div>
              <div>{`Prediction is: ${response.data.prediction.prediction}`}</div>
              {classes ? (
                <div>
                  {classes
                    .map((label, index) => `${index} = ${label}`)
                    .join(", ")}
                </div>
              ) : (
                <></>
              )}
            </div>,
            {
              variant: "success",
              autoHideDuration: 10000,
            }
          );
        })
        .catch((error) => {
          console.error("Error making prediction:", error);
        });
    } else {
      enqueueSnackbar(
        "Please select a model and enter values for all variables.",
        {
          variant: "warning",
        }
      );
    }
  };

  useEffect(() => {
    if (model) {
      setLoading(true);
      api
        .get("/models/get_features_types", {
          withCredentials: true,
          params: { model_id: model?.id },
        })
        .then((response) => {
          setVariables(response.data.featureTypes);

          const initialValues: Record<string, string | number> = {};
          response.data.featureTypes.forEach((v: ModelVariable) => {
            initialValues[v.name] = v.type === "number" ? 0 : "";
          });
          setValues(initialValues);
          setLoading(false);
        });
    }
  }, [model]);

  return (
    <div className="view__predict">
      <h1 className="view__predict__title">Make a Prediction</h1>
      {variables.length > 0 ? (
        variables.map((variable, index) => (
          <div className="view__predict__input__container" key={index}>
            <TextField
              className="view__predict__input"
              key={index}
              label={variable.name}
              type={variable.type}
              value={values[variable.name]}
              onChange={(e) => {
                setValues((prev) => ({
                  ...prev,
                  [variable.name]:
                    variable.type === "number"
                      ? e.target.value === ""
                        ? ""
                        : Number(e.target.value)
                      : e.target.value,
                }));
              }}
              helperText={`Enter ${variable.type} value`}
            />
          </div>
        ))
      ) : loading ? (
        <div className="view__predict__loader-container">
          <Loader />
        </div>
      ) : (
        <div>Select model before predicting!</div>
      )}
      <Button
        className="view__predict__button"
        variant="contained"
        color="primary"
        disabled={variables.length === 0 || model === null}
        onClick={handlePredict}
      >
        Make Prediction
      </Button>
    </div>
  );
};

export default Predict;
