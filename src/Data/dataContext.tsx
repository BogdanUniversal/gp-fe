import { createContext, Dispatch, SetStateAction } from "react";

interface DataRow {
  [columnName: string]: string;
}

export interface Dataset {
  id: string;
  name: string;
  data: DataRow[];
  columns: string[];
  totalRows: number;
  totalColumns: number;
}

interface DatasetContext {
  dataset: Dataset | null;
  setDataset: Dispatch<SetStateAction<Dataset | null>>;
}

export const DatasetContext = createContext<DatasetContext>({
  dataset: null,
  setDataset: () => {},
});
