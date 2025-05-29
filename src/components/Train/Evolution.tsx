import { Button } from "@mui/material";
import { SetStateAction, useContext, useState } from "react";
import { DatasetContext } from "../../Data/dataContext";
import { OptionsContext } from "../Options/optionsContext";
import { api } from "../../User/api";
import { io } from "socket.io-client";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Text,
} from "recharts";

const Evolution = () => {
  const { dataset } = useContext(DatasetContext);
  const { options } = useContext(OptionsContext);
  const [trainData, setTrainData] = useState<any[]>([]);

  const handleTrainModel = async () => {
    const csrf_cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrf_access_token="));

    const csrf_token = csrf_cookie?.split("=")[1] || "";

    const socket = io("http://localhost:5000/train/train", {
      transports: ["websocket"],
      withCredentials: true,
      extraHeaders: {
        "X-CSRF-TOKEN": csrf_token,
      },
    });

    socket.on("connect", () => {
      console.log("Socket connected successfully");
      setTrainData([]); // Clear previous training data
    });

    socket.on("training_update", (data) => {
      // console.log("Received update:", data);
      setTrainData((prevData) => [...prevData, data]);
    });

    await api
      .get("/models/train_model", { withCredentials: true })
      .then((response) => {
        console.log("Training started:", response.data);
      })
      .catch((error) => {
        console.error("Error during training:", error);
      });
  };

  const data = [
    {
      name: "Page A",
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "Page B",
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "Page C",
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "Page D",
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "Page E",
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "Page F",
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: "Page G",
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-2xl font-bold mb-4">Evolution</h1>
      <p className="text-gray-600">This feature is under development.</p>
      <Button
        disabled={!dataset || !options}
        onClick={handleTrainModel}
        variant="contained"
      >
        Begin Training!
      </Button>

      {trainData.length > 0 ? (
        <LineChart
          width={730}
          height={250}
          data={trainData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="1 5" />
          <XAxis
            dataKey="generation"
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
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="best_fitness"
            stroke="#8884d8"
            dot={false}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="avg_fitness"
            stroke="#82ca9d"
            dot={false}
          />
        </LineChart>
      ) : (
        <p className="text-gray-600">No training data available.</p>
      )}
    </div>
  );
};

export default Evolution;
