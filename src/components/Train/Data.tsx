import { Button, IconButton } from "@mui/material";
import "./train.css";
import { useContext, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FaFileCsv } from "react-icons/fa6";
import { IoMdCloseCircle } from "react-icons/io";
import { useSnackbar } from "notistack";
import { FaAngleRight } from "react-icons/fa";
import { api } from "../../User/api";
import Loader from "../Loader/Loader";
import { DatasetContext } from "../../Data/dataContext";
import { useNavigate } from "react-router-dom";
import { OptionsContext } from "../Options/optionsContext";

const Data = () => {
  const MAX_SIZE = 50000000; // 50MB
  const [previousFiles, setPreviousFiles] = useState<
    Array<{ id: string; name: string; date: string }>
  >([]);
  const { enqueueSnackbar } = useSnackbar();
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: { "text/csv": [".csv"] },
    multiple: false,
    onDropAccepted: (files) => {
      const file = files[0];
      if (file?.size > MAX_SIZE) {
        enqueueSnackbar("File too large! Maximum size is 50MB!", {
          variant: "error",
        });
      } else {
        enqueueSnackbar("File selected!", { variant: "info" });
        setIsFileSelected(true);
      }
    },
    onDropRejected: () => {
      enqueueSnackbar("File not supported", { variant: "error" });
    },
    disabled: isFileSelected,
  });
  const { dataset, setDataset } = useContext(DatasetContext);
  const { options, setOptions } = useContext(OptionsContext);
  const navigate = useNavigate();

  const files = acceptedFiles.map((file) => (
    <div key={file.path}>
      {file.path?.substring(2)} - {Math.round(file.size * 10 ** -6 * 100) / 100}{" "}
      MB
    </div>
  ));

  const handleGetDatasets = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/datasets/get_datasets", {
        withCredentials: true,
      });

      const datasets = response.data.datasets;
      if (datasets.length === 0) setPreviousFiles([]);
      else {
        setPreviousFiles(
          datasets.map(
            (dataset: { id: string; name: string; upload_date: string }) => ({
              id: dataset.id,
              name: dataset.name,
              date: new Date(dataset.upload_date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              }),
            })
          )
        );
      }
      setIsLoading(false);
    } catch (error) {
      enqueueSnackbar("Error fetching datasets", { variant: "error" });
    }
  };

  const handleUpload = async () => {
    if (acceptedFiles.length) {
      const file = acceptedFiles[0];
      const formData = new FormData();
      formData.append("name", file.name.substring(0, file.name.length - 4));
      formData.append("dataset", file);

      api
        .postForm("/datasets/upload", formData, {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
          data: formData,
        })
        .then(async () => {
          enqueueSnackbar("File uploaded successfully!", {
            variant: "success",
          });
          setIsFileSelected(false);
          await handleGetDatasets();
        })
        .catch(() => {
          enqueueSnackbar("Error uploading file", { variant: "error" });
        });
    }
  };

  const handleSelectDataset = async (datasetId: string) => {
    setIsLoading(true);
    await api
      .get("/datasets/get_dataset", {
        withCredentials: true,
        params: { dataset_id: datasetId },
      })
      .then((response) => {
        setDataset({
          id: response.data.dataset.id,
          name: response.data.dataset.name,
          data: response.data.dataset.data,
          columns: response.data.dataset.columns,
          totalRows: response.data.dataset.total_rows,
          totalColumns: response.data.dataset.total_columns,
        });
        setOptions({
          selectedFeatures: response.data.dataset.columns.slice(0, -1),
          selectedLabel:
            response.data.dataset.columns[response.data.dataset.columns.length - 1],
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
        enqueueSnackbar(`Dataset "${response.data.dataset.name}" selected`, {
          variant: "success",
        });
        setIsLoading(false);
        navigate("/train/parametrization");
      })
      .catch(() => {
        enqueueSnackbar("Error selecting dataset!", { variant: "error" });
        setIsLoading(false);
      });
  };

  useEffect(() => {
    handleGetDatasets();
  }, []);

  return (
    <div className="data">
      <div className="data__header">Select the dataset for training</div>
      <div className="data__previous">
        <div className="data__previous__header">Previous uploaded datasets</div>
        <div className="data__previous__files">
          {isLoading ? (
            <Loader />
          ) : previousFiles.length > 0 ? (
            previousFiles.map((file) => (
              <div
                key={file.id}
                className={
                  file.id === dataset?.id
                    ? "data__previous__files__file active"
                    : "data__previous__files__file"
                }
                onClick={() => handleSelectDataset(file.id)}
              >
                <FaFileCsv className="data__previous__files__file__icon" />{" "}
                <div className="data__previous__files__file__name">
                  {file.name}
                </div>
                <div className="data__previous__files__file__date">
                  {file.date}
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
      </div>
      <div className="data__header">Upload new dataset</div>
      <div
        className={
          !isFileSelected
            ? "data__dropzone__container active"
            : "data__dropzone__container"
        }
      >
        <input {...getInputProps()} />
        <div {...getRootProps({ className: "data__dropzone" })}>
          <div className="data__dropzone__icon">
            <FaFileCsv />
          </div>
          {!isFileSelected ? (
            <div className="data__dropzone__files">
              <div className="data__dropzone__description">
                Drag and drop your file here, or click to choose a file
              </div>
              <div className="data__dropzone__restriction">
                Only CSV files allowed
              </div>
            </div>
          ) : (
            <div className="data__dropzone__files">
              <div className="data__dropzone__description">{files}</div>
              <div className="data__dropzone__upload">
                <Button
                  variant="contained"
                  className="data__dropzone__upload__button"
                  onClick={handleUpload}
                >
                  Upload
                </Button>
                <div
                  className="data__dropzone__upload__remove"
                  onClick={() => setIsFileSelected(false)}
                >
                  <IconButton color="error" size="large">
                    <IoMdCloseCircle />
                  </IconButton>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Data;
