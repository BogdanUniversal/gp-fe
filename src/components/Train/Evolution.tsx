import { Button, TextField } from "@mui/material";
import { useContext, useRef, useState } from "react";
import { DatasetContext } from "../../Data/dataContext";
import { OptionsContext } from "../Options/optionsContext";
import { api } from "../../User/api";
import { io, Socket } from "socket.io-client";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Loader from "../Loader/Loader";
import { enqueueSnackbar } from "notistack";

const Evolution = () => {
  const { dataset } = useContext(DatasetContext);
  const { options } = useContext(OptionsContext);
  const [modelName, setModelName] = useState<string>("GP Model");
  const [trainData, setTrainData] = useState<any[]>([]);
  const [preprocessing, setPreprocessing] = useState<boolean>(false);
  const [itsTraining, setItsTraining] = useState<boolean>(false);
  const TRAINING_COMPLETE_KEY = "training-complete-notification";

  const socketRef = useRef<Socket | null>(null);

  const cleanupSocket = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  };

  const handleTrainModel = async () => {
    cleanupSocket();
    setTrainData([]);
    setItsTraining(true);
    setPreprocessing(true);
    const csrf_cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrf_access_token="));

    const csrf_token = csrf_cookie?.split("=")[1] || "";

    socketRef.current = io("http://localhost:5000/train/train", {
      transports: ["websocket"],
      withCredentials: true,
      extraHeaders: {
        "X-CSRF-TOKEN": csrf_token,
      },
    });

    socketRef.current.on("connect", () => {
      setTrainData([]);
    });

    socketRef.current.on("training_update", (data) => {
      setPreprocessing(false);
      setTrainData((prevData) => {
        const generationExists = prevData.some(
          (item) => item.generation === data.generation
        );

        if (generationExists) {
          return prevData.map((item) =>
            item.generation === data.generation ? data : item
          );
        } else {
          return [...prevData, data];
        }
      });
      if (data.message == "complete") {
        setItsTraining(false);
        console.log("Training completed:", data);
        enqueueSnackbar("Training completed!", {
          variant: "success",
          autoHideDuration: 20000,
        });
      }
    });

    await api
      .post(
        "/models/train_model",
        {
          model_name: modelName.length > 0 ? modelName : "GP Model",
          dataset_id: dataset?.id,
        },
        { withCredentials: true }
      )
      .then((response) => {
        console.log("Training started:", response.data);
      })
      .catch((error) => {
        console.error("Error during training:", error);
        if (error.response && error.response.status === 410) {
          enqueueSnackbar(error.response.data.error, {
            variant: "error",
            autoHideDuration: 7000,
          });
        } else
          enqueueSnackbar(
            "Error during training, parameters not correct for current dataset!",
            {
              variant: "error",
              autoHideDuration: 5000,
            }
          );
        setPreprocessing(false);
        setItsTraining(false);
        cleanupSocket();
      });
  };

  return (
    <div className="evolution">
      <TextField
        label="Current model"
        helperText="What should the current model be named?"
        value={modelName}
        onChange={(e) => setModelName(e.target.value)}
        disabled={!dataset || !options || itsTraining}
        fullWidth
      />
      <Button
        disabled={!dataset || !options || itsTraining}
        onClick={handleTrainModel}
        variant="contained"
      >
        Begin Training!
      </Button>

      <ResponsiveContainer width="100%" height={270}>
        <LineChart
          width={730}
          height={250}
          data={trainData.length > 0 ? trainData : [{}]}
        >
          <CartesianGrid strokeDasharray="1 5" />
          <XAxis
            dataKey="generation"
            name="Generation"
            type="category"
            label={{
              value: "Generation",
              position: "insideBottom",
              offset: -5,
            }}
          />
          <YAxis
            yAxisId="left"
            label={{
              value: "Best Fitness",
              angle: -90,
              position: "insideLeft",
              textAnchor: "middle",
              style: { textAnchor: "middle" },
            }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            label={{
              value: "Average Fitness",
              angle: -90,
              position: "insideRight",
              offset: 10,
              textAnchor: "middle",
              style: { textAnchor: "middle" },
            }}
          />
          <Tooltip />
          <Legend verticalAlign="top" />

          {trainData.length > 0 ? (
            <>
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="best_fitness"
                name="Best Fitness"
                stroke="#8884d8"
                dot={false}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="avg_fitness"
                name="Average Fitness"
                stroke="#82ca9d"
                dot={false}
              />
            </>
          ) : preprocessing ? (
            <g>
              <text
                x="50%"
                y="40%"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                Preprocessing
              </text>
              <foreignObject x="40%" y="45%" width="20%" height="60">
                <Loader color="#4a4a4a" />
              </foreignObject>
            </g>
          ) : (
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
              Begin training to see the evolution of the model!
            </text>
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Evolution;
