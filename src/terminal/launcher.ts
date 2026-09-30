import { createContext, useContext } from "react";

/** Klasik görünümden terminali açar; komut verilirse açılırken çalıştırır. */
export type OpenTerminal = (command?: string) => void;

export const TerminalLauncherContext = createContext<OpenTerminal>(() => {});

export const useOpenTerminal = () => useContext(TerminalLauncherContext);
