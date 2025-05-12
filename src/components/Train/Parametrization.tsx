import { useContext, useEffect, useState } from "react";
import "./train.css";
import {
  DataGrid,
  GridColDef,
  GridFooter,
  GridOverlay,
} from "@mui/x-data-grid";
import { DatasetContext } from "../../Data/dataContext";
import { Autocomplete, TextField } from "@mui/material";

const Parametrization = () => {
  const { dataset, setDataset } = useContext(DatasetContext);
  const [columns, setColumns] = useState<GridColDef[]>([]);
  const [rows, setRows] = useState<any[]>([]);
  const [selectedColumn, setSelectedColumn] = useState<string>(
    dataset?.columns[dataset?.columns.length - 1] || ""
  );

  const correlationOptions = ["Pearson", "Spearman", "Kendall"];
  const [selectedCorrelation, setSelectedCorrelation] =
    useState<string>("Pearson");

  const scalingOptions = ["Standardization", "MinMax", "Robust"];
  const [selectedScaling, setSelectedScaling] =
    useState<string>("Standardization");

  const dimensionalityReductionOptions = ["PCA", "UMAP"];
  const [selectedDimensionalityReduction, setSelectedDimensionalityReduction] =
    useState<string>("PCA");

  const [population, setPopulation] = useState<number>(50);

  const [generations, setGenerations] = useState<number>(100);

  useEffect(() => {
    if (dataset) {
      // Generate columns using dataset.columns for correct order
      const generatedColumns: GridColDef[] = dataset.columns.map(
        (columnName) => ({
          field: columnName,
          headerName: columnName.charAt(0).toUpperCase() + columnName.slice(1),
          description: `Select "${columnName}" as label`,
          width: 150,
          editable: false,
          sortable: false,
          // Add cellClassName to style selected column
          cellClassName: (params) =>
            params.field === selectedColumn
              ? "parametrization__cell active"
              : "parametrization__cell",
          // Add headerClassName to style selected column header
          headerClassName: (params) =>
            params.field === selectedColumn
              ? "parametrization__header active"
              : "parametrization__header",
        })
      );

      // Generate rows with IDs, ensuring data follows the column order
      const generatedRows = dataset.data.map((row: any, index: number) => {
        const orderedRow: any = {
          id: index,
        };
        // Ensure data follows the column order from dataset.columns
        dataset.columns.forEach((columnName) => {
          orderedRow[columnName] = String(row[columnName]); // Convert all values to strings
        });
        return orderedRow;
      });

      setColumns(generatedColumns);
      setRows(generatedRows);
    } else {
      const generatedColumns: GridColDef[] = [
        {
          editable: false,
          field: "loading",
          headerName: "Please load a dataset to see the data.",
          description: "Please load a dataset to see the data.",
          width: 500,
          sortable: false,
        },
      ];
      const generatedRows = [
        {
          id: 1,
          loading: "Cannot parametrize without a dataset.",
        },
      ];

      setColumns(generatedColumns);
      setRows(generatedRows);
    }
  }, [dataset, selectedColumn]);

  return (
    <div className="parametrization">
      <div className="parametrization__table">
        <DataGrid
          hideFooter={dataset ? false : true}
          rows={rows}
          columns={columns}
          pageSizeOptions={[5]}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          rowHeight={35}
          showToolbar={dataset ? true : false}
          onColumnHeaderClick={(params) => {
            setSelectedColumn(params.field);
          }}
          disableRowSelectionOnClick
          slots={{
            footer: () => {
              return (
                <div className="parametrization__footer">
                  <div className="parametrization__footer__child">
                    Selected label:{" "}
                    <div className="parametrization__footer__label">
                      {selectedColumn}
                    </div>
                  </div>
                  <GridFooter />
                </div>
              );
            },
          }}
        />
      </div>
      <div className="parametrization__options">
        <Autocomplete
          disabled={!dataset}
          disablePortal
          options={scalingOptions}
          value={selectedScaling}
          onChange={(e, value) => {
            setSelectedScaling(value || "");
          }}
          renderInput={(params) => (
            <TextField
            helperText="Choose a method to scale the features" 
            {...params} label="Scaling method" />
          )}
        />
        <Autocomplete
          disabled={!dataset}
          disablePortal
          options={correlationOptions}
          value={selectedCorrelation}
          onChange={(e, value) => {
            setSelectedCorrelation(value || "");
          }}
          renderInput={(params) => (
            <TextField
              helperText="Choose a method to calculate the correlation between the features and the label"
              {...params}
              label="Correlation method"
            />
          )}
        />
        <Autocomplete
          disabled={!dataset}
          disablePortal
          options={dimensionalityReductionOptions}
          value={selectedDimensionalityReduction}
          onChange={(e, value) => {
            setSelectedDimensionalityReduction(value || "");
          }}
          renderInput={(params) => (
            <TextField
              helperText="Choose a method to reduce the dimensionality of the features"
              {...params}
              label="Dimensionality reduction method"
            />
          )}
        />
        <TextField
          label="Population size"
          helperText="Population size for the training (1-100)"
          type="number"
          value={population}
          disabled={!dataset}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            if (!isNaN(value) && value > 0 && value <= 100) {
              setPopulation(value);
            }
          }}
        />
        <TextField
          label="Generations"
          helperText="Number of generations for the training (1-500)"
          type="number"
          value={generations}
          disabled={!dataset}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            if (!isNaN(value) && value > 0 && value <= 500) {
              setGenerations(value);
            }
          }}
        />
      </div>
    </div>
  );
};

export default Parametrization;
