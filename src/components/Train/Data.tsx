import { Button, IconButton } from "@mui/material";
import "./train.css";
import { SetStateAction, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FaFileCsv } from "react-icons/fa6";
import { IoMdCloseCircle } from "react-icons/io";
import { useSnackbar } from "notistack";
import { FaAngleRight } from "react-icons/fa";

const Data = () => {
  const MAX_SIZE = 50000000; // 50MB
  const [previousFiles, setPreviousFiles] = useState<
    Array<{ name: string; date: string }>
  >([
    { name: "asdwe", date: "25/10/2024" },
    { name: "123213dsqwe", date: "10/09/2024" },
    { name: "w213129213 going to bed", date: "31/10/2024" },
    { name: "asdwe", date: "25/10/2024" },
    { name: "123213dsqwe", date: "10/09/2024" },
    { name: "w213129213 going to bed", date: "31/10/2024" },
  ]);
  const { enqueueSnackbar } = useSnackbar();
  const [isFileSelected, setIsFileSelected] = useState(false);
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

  const files = acceptedFiles.map((file) => (
    <div key={file.path}>
      {file.path?.substring(2)} - {Math.round(file.size * 10 ** -6 * 100) / 100}{" "}
      MB
    </div>
  ));

  return (
    <div className="data">
      <div className="data__header">Select the dataset for training</div>
      <div className="data__previous">
        <div className="data__previous__header">Previous uploaded datasets</div>
        <div className="data__previous__files">
          {previousFiles.length > 0 ? (
            previousFiles.map((file, index) => (
              <div key={index} className="data__previous__files__file">
                <FaFileCsv /> <div>{file.name}</div>
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
