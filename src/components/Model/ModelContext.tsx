import { createContext, Dispatch, SetStateAction } from "react";

export interface Model {
  id: string;
  dataset_name: string;
  model_name: string;
  train_date: string;
}

interface ModelContext {
  model: Model | null;
  setModel: Dispatch<SetStateAction<Model | null>>;
}

export const ModelContext = createContext<ModelContext>({
  model: null,
  setModel: () => {},
});
