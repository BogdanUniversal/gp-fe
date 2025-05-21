// First, create your second context
// OptionsContext.ts
import { createContext, Dispatch, SetStateAction } from "react";

export interface Options {
  selectedLabel: string;
  corrOpt: string;
  dimRedOpt: string;
  popSize: number;
  genCount: number;
  treeDepth: number;
  crossChance: number;
  mutationChance: number;
  mutationFunction: { id: string; name: string }[];
  selectionMethod: { id: string; name: string };
  lossFunction: { id: string; name: string };
  functions: { id: string; name: string; type: string }[];
}

interface OptionsContext {
  options: Options;
  setOptions: Dispatch<SetStateAction<Options>>;
}

export const OptionsContext = createContext<OptionsContext>({
  options: {
    selectedLabel: "",
    corrOpt: "Spearman",
    dimRedOpt: "PCA",
    popSize: 50,
    genCount: 100,
    treeDepth: 10,
    crossChance: 0.5,
    mutationChance: 0.2,
    mutationFunction: [{ id: "mutUniform", name: "Uniform Mutation" }],
    selectionMethod: { id: "tournament", name: "Tournament Selection" },
    lossFunction: { id: "mse", name: "Mean Squared Error" },
    functions: [
      { id: "if", name: "If Then Else", type: "Primitive" },
      {
        id: "rand_gauss_0",
        name: "Random Normal (0 Mean)",
        type: "Terminal",
      },
    ],
  },
  setOptions: () => {},
});
