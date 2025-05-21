import { useContext, useEffect, useState } from "react";
import "./train.css";
import { DataGrid, GridColDef, GridFooter } from "@mui/x-data-grid";
import { DatasetContext } from "../../Data/dataContext";
import { Autocomplete, Button, Checkbox, Chip, TextField } from "@mui/material";
import { api } from "../../User/api";
import { enqueueSnackbar } from "notistack";
import { OptionsContext } from "../Options/optionsContext";

const Parametrization = () => {
  const { dataset, setDataset } = useContext(DatasetContext);
  const { options, setOptions } = useContext(OptionsContext);
  const [columns, setColumns] = useState<GridColDef[]>([]);
  const [rows, setRows] = useState<any[]>([]);
  const [selectedColumn, setSelectedColumn] = useState<string>(
    options.selectedLabel
  );

  const correlationOptions = ["Spearman", "Pearson", "Kendall"];
  const [selectedCorrelation, setSelectedCorrelation] = useState<string>(
    options.corrOpt
  );

  const dimensionalityReductionOptions = ["PCA", "UMAP"];
  const [selectedDimensionalityReduction, setSelectedDimensionalityReduction] =
    useState<string>(options.dimRedOpt);

  const [population, setPopulation] = useState<number>(options.popSize);

  const [generations, setGenerations] = useState<number>(options.genCount);

  const [treeDepth, setTreeDepth] = useState<number>(options.treeDepth);

  const [crossChance, setCrossChance] = useState<number>(options.crossChance);

  const mutationFunctions = [
    { id: "mutUniform", name: "Uniform Mutation" },
    { id: "mutEphemeral", name: "Ephemerals Mutation" },
    { id: "mutSemantic", name: "Semantic Mutation" },
    { id: "mutShrink", name: "Shrink Mutation" },
    { id: "mutNodeReplacement", name: "Node Replacement" },
    { id: "mutInsert", name: "Insert Mutation" },
  ];
  const [selectedMutationFunction, setSelectedMutationFunction] = useState<
    {
      id: string;
      name: string;
    }[]
  >(options.mutationFunction);

  const selectionMethods = [
    { id: "tournament", name: "Tournament Selection" },
    { id: "roulette", name: "Roulette Selection" },
    { id: "best", name: "Best Selection" },
    { id: "nsga2", name: "NSGA-II Selection" },
    { id: "nsga3", name: "NSGA-III Selection" },
    { id: "spea2", name: "SPEA-II Selection" },
    { id: "lexicase", name: "Lexicase Selection" },
  ];
  const [selectedSelectionMethod, setSelectedSelectionMethod] = useState<{
    id: string;
    name: string;
  }>(options.selectionMethod);

  const [mutationChance, setMutationChance] = useState<number>(
    options.mutationChance
  );

  const [lossFunctions, setLossFunctions] = useState<
    { id: string; name: string }[]
  >([{ id: "mse", name: "Mean Squared Error" }]);
  const [selectedLossFunction, setSelectedLossFunction] = useState<{
    id: string;
    name: string;
  }>(options.lossFunction);

  const [fixedFunctions, setFixedFunctions] = useState<
    { id: string; name: string; type: string }[]
  >([]);
  const [functions, setFunctions] = useState<
    { id: string; name: string; type: string }[]
  >([{ id: "if", name: "If Then Else", type: "Float" }]);
  const [selectedFunctions, setSelectedFunctions] = useState<
    { id: string; name: string; type: string }[]
  >(options.functions);

  const getLossFunctions = async () => {
    api
      .get("/models/get_loss_functions", {
        params: { label: selectedColumn },
        withCredentials: true,
      })
      .then((response) => {
        setLossFunctions(response.data);
        setSelectedLossFunction(
          response.data
            .map((f: { id: string; name: string }) => f.id)
            .includes(options.lossFunction.id)
            ? options.lossFunction
            : response.data[0]
        );
      })
      .catch((error) => {
        console.log("Error getting loss functions", error);
      });
  };

  const getFunctions = async () => {
    api
      .get("/models/get_terminals_primitives", { withCredentials: true })
      .then((response) => {
        console.log("Functions and Primitives", response.data);
        setFunctions(response.data);
        setFixedFunctions([
          { id: "if", name: "If Then Else", type: "Primitive" },
          {
            id: "rand_gauss_0",
            name: "Random Normal (0 Mean)",
            type: "Terminal",
          },
        ]);
      })
      .catch((error) => {
        console.log("Error getting Primitives and Terminals", error);
      });
  };

  const hasOptionsChanged = (): boolean => {
    const areFunctionsEqual = <T extends { id: string; name: string }>(
        a: T[],
        b: T[]
      ): boolean => {
        if (a.length !== b.length) return false;
        const aIds = a.map((f) => f.id).sort();
        const bIds = b.map((f) => f.id).sort();
        return aIds.every((id, i) => id === bIds[i]);
      };

    if (!options) return true;

    return (
      selectedColumn !== options.selectedLabel ||
      selectedCorrelation !== options.corrOpt ||
      selectedDimensionalityReduction !== options.dimRedOpt ||
      population !== options.popSize ||
      generations !== options.genCount ||
      treeDepth !== options.treeDepth ||
      crossChance !== options.crossChance ||
      !areFunctionsEqual(selectedMutationFunction, options.mutationFunction) ||
      selectedSelectionMethod.id !== options.selectionMethod.id ||
      mutationChance !== options.mutationChance ||
      selectedLossFunction.id !== options.lossFunction.id ||
      !areFunctionsEqual(selectedFunctions, options.functions)
    );
  };

  const handleSaveOptions = () => {
    setOptions({
      selectedLabel: selectedColumn,
      corrOpt: selectedCorrelation,
      dimRedOpt: selectedDimensionalityReduction,
      popSize: population,
      genCount: generations,
      treeDepth: treeDepth,
      crossChance: crossChance,
      mutationChance: mutationChance,
      mutationFunction: selectedMutationFunction,
      selectionMethod: selectedSelectionMethod,
      lossFunction: selectedLossFunction,
      functions: selectedFunctions,
    });
    api
      .post(
        "/models/set_parameters",
        {
          selectedLabel: selectedColumn,
          corrOpt: selectedCorrelation,
          dimRedOpt: selectedDimensionalityReduction,
          popSize: population,
          genCount: generations,
          treeDepth: treeDepth,
          crossChance: crossChance,
          mutationChance: mutationChance,
          mutationFunction: selectedMutationFunction,
          selectionMethod: selectedSelectionMethod,
          lossFunction: selectedLossFunction,
          functions: selectedFunctions,
        },
        { withCredentials: true }
      )
      .then((response) => {
        enqueueSnackbar("Parameters saved successfully!", {
          variant: "success",
        });
      })
      .catch((error) => {
        console.log("Error saving parameters", error);
        enqueueSnackbar("Error saving parameters", { variant: "error" });
      });
  };

  useEffect(() => {
    if (dataset) {
      const generatedColumns: GridColDef[] = dataset.columns.map(
        (columnName) => ({
          field: columnName,
          headerName: columnName.charAt(0).toUpperCase() + columnName.slice(1),
          description: `Select "${columnName}" as label`,
          width: 150,
          editable: false,
          sortable: false,
          cellClassName: (params) =>
            params.field === selectedColumn
              ? "parametrization__cell active"
              : "parametrization__cell",
          headerClassName: (params) =>
            params.field === selectedColumn
              ? "parametrization__header active"
              : "parametrization__header",
        })
      );

      const generatedRows = dataset.data.map((row: any, index: number) => {
        const orderedRow: any = {
          id: index,
        };
        dataset.columns.forEach((columnName) => {
          orderedRow[columnName] = String(row[columnName]);
        });
        return orderedRow;
      });

      setColumns(generatedColumns);
      setRows(generatedRows);

      getLossFunctions();
      getFunctions();
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
          pageSizeOptions={[25, 50]}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 25,
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
          size="small"
          disabled={!dataset}
          disableClearable
          disablePortal
          options={correlationOptions}
          value={selectedCorrelation}
          onChange={(e, value) => {
            setSelectedCorrelation(value || "Spearman");
          }}
          renderInput={(params) => (
            <TextField
              helperText="Choose a method to calculate the correlation between the features"
              {...params}
              label="Correlation method"
            />
          )}
        />

        <Autocomplete
          size="small"
          disabled={!dataset}
          disablePortal
          disableClearable
          options={dimensionalityReductionOptions}
          value={selectedDimensionalityReduction}
          onChange={(e, value) => {
            setSelectedDimensionalityReduction(value || "PCA");
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
          size="small"
          label="Population size"
          helperText="Population size for the training (1 - 1000)"
          type="number"
          value={population}
          disabled={!dataset}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            if (!isNaN(value) && value > 0 && value <= 1000) {
              setPopulation(value);
            }
          }}
        />

        <TextField
          size="small"
          label="Generations"
          helperText="Number of generations for the training (1 - 500)"
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

        <TextField
          size="small"
          label="Max Tree Depth"
          helperText="Maximum depth of mutated trees (1 - 25)"
          type="number"
          value={treeDepth}
          disabled={!dataset}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            if (!isNaN(value) && value > 0 && value <= 25) {
              setTreeDepth(value);
            }
          }}
        />

        <TextField
          size="small"
          label="Crossing Chance"
          helperText="Chance of crossing individuals (0.01 - 1)"
          type="number"
          value={crossChance}
          disabled={!dataset}
          InputProps={{ inputProps: { min: 0, max: 1, step: 0.01 } }}
          onChange={(e) => {
            const value = parseFloat(e.target.value);
            if (!isNaN(value) && value > 0 && value <= 1) {
              setCrossChance(value);
            }
          }}
        />

        <TextField
          size="small"
          label="Mutation Chance"
          helperText="Chance of mutating genes (0.01 - 1)"
          type="number"
          value={mutationChance}
          disabled={!dataset}
          InputProps={{ inputProps: { min: 0, max: 1, step: 0.01 } }}
          onChange={(e) => {
            const value = parseFloat(e.target.value);
            if (!isNaN(value) && value > 0 && value <= 1) {
              setMutationChance(value);
            }
          }}
        />

        <Autocomplete
          className="parametrization__options__mutation"
          size="small"
          multiple
          disabled={!dataset}
          disableClearable
          disableCloseOnSelect
          limitTags={1}
          value={selectedMutationFunction}
          onChange={(event, newValue) => {
            if (newValue.length > 0) setSelectedMutationFunction(newValue);
          }}
          options={mutationFunctions}
          getOptionLabel={(option) => option.name}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderOption={(props, option, { selected }) => {
            return (
              <li {...props}>
                <Checkbox
                  style={{ padding: 0, marginLeft: -10, marginRight: 5 }}
                  checked={selected}
                />
                <span>{option.name}</span>
              </li>
            );
          }}
          renderValue={(tagValue, getTagProps) =>
            tagValue.map((option, index) => {
              return index < 1 ? (
                <Chip
                  {...getTagProps({ index })}
                  key={option.id}
                  label={option.name}
                />
              ) : (
                <></>
              );
            })
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Mutation function"
              placeholder="Selected"
              helperText="Choose which mutation functions to use in the training"
            />
          )}
        />

        <Autocomplete
          size="small"
          disabled={!dataset}
          disableClearable
          disablePortal
          options={selectionMethods}
          value={selectedSelectionMethod}
          getOptionLabel={(option) => option.name}
          onChange={(e, value) => {
            if (value) {
              setSelectedSelectionMethod(value);
            }
          }}
          renderInput={(params) => (
            <TextField
              helperText="Choose which selection method to use"
              {...params}
              label="Selection method"
            />
          )}
        />

        <Autocomplete
          size="small"
          disabled={!dataset}
          disableClearable
          disablePortal
          options={lossFunctions}
          value={selectedLossFunction}
          getOptionLabel={(option) => option.name}
          onChange={(e, value) => {
            if (value) {
              setSelectedLossFunction(value);
            }
          }}
          renderInput={(params) => (
            <TextField
              helperText="Choose which loss function to use"
              {...params}
              label="Loss function"
            />
          )}
        />

        <Autocomplete
          className="parametrization__options__functions"
          size="small"
          multiple
          disabled={!dataset}
          disableCloseOnSelect
          limitTags={2}
          value={selectedFunctions}
          groupBy={(option) => option.type}
          onChange={(event, newValue) => {
            setSelectedFunctions([
              ...fixedFunctions,
              ...newValue.filter(
                (option) => !fixedFunctions.map((f) => f.id).includes(option.id)
              ),
            ]);
          }}
          options={functions}
          getOptionLabel={(option) => option.name}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderOption={(props, option, { selected }) => {
            const isFixed = fixedFunctions.some((f) => f.id === option.id);
            return (
              <li {...props}>
                <Checkbox
                  style={{ padding: 0, marginLeft: -20, marginRight: 5 }}
                  checked={selected || isFixed}
                  disabled={isFixed}
                />
                <span>{option.name}</span>
              </li>
            );
          }}
          renderValue={(tagValue, getTagProps) =>
            tagValue.map((option, index) => {
              const isFixed = fixedFunctions.some((f) => f.id === option.id);
              return index < 2 ? (
                <Chip
                  {...getTagProps({ index })}
                  key={option.id}
                  label={option.name}
                  disabled={isFixed}
                />
              ) : (
                <></>
              );
            })
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Primitives and Terminals"
              placeholder="Selected"
              helperText="Choose which Primitives and Terminals to use in the training"
            />
          )}
        />

        <Button
          onClick={handleSaveOptions}
          disabled={!dataset || !hasOptionsChanged()}
          variant="contained"
          className="parametrization__options__button"
        >
          Save options
        </Button>
      </div>
    </div>
  );
};

export default Parametrization;
