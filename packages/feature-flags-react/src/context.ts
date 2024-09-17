import type { FlagsClient } from "feature-flags";
import { createContext } from "react";

export type FlagsContextValue = {
  client: FlagsClient;
};

export const FlagsContext = createContext<FlagsContextValue | null>(null);
