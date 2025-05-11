import { useContext, useEffect, useState } from "react";
import "./train.css";
import {
  DataGrid,
  GridColDef,
  GridFooter,
  GridOverlay,
} from "@mui/x-data-grid";
import { DatasetContext } from "../../Data/dataContext";

const Parametrization = () => {
  const { dataset, setDataset } = useContext(DatasetContext);
  const [columns, setColumns] = useState<GridColDef[]>([]);
  const [rows, setRows] = useState<any[]>([]);
  const [selectedColumn, setSelectedColumn] = useState<string>(
    dataset?.columns[dataset?.columns.length - 1] || ""
  );

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
      const generatedRows = [{
        id: 1,
        loading: "Cannot parametrize without a dataset.",
      }];

      setColumns(generatedColumns);
      setRows(generatedRows);
    }
  }, [dataset, selectedColumn]);

  return (
    <div className="parametrization">
      <h1>Parametrization</h1>
      <p>Here you can set the parameters for the training.</p>
      {/* Add your parametrization form or options here */}
      <div className="parametrization__table">
        <DataGrid
          hideFooter={dataset ? false : true}
          rows={rows}
          columns={columns}
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
    </div>
  );
};

export default Parametrization;
