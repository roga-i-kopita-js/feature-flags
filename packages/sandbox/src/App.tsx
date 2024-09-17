import "./App.css";

import type { FlagsProvider } from "feature-flags";
import { FlagsClient } from "feature-flags";
import type { FC, PropsWithChildren, ReactNode } from "react";
import { createContext } from "react";

import { ComponentWithFlag } from "./ComponentWithFlag.ts";

const exmpleProvider: FlagsProvider = {
  name: "example-provider",
  async load() {
    return [
      {
        name: "test",
        enabled: true,
      },
    ];
  },
};
export type FlagsContextValue = {
  client: FlagsClient;
};

export const FlagsContext = createContext<FlagsContextValue | null>(null);

export const ReactFlagsProvider: FC<PropsWithChildren<FlagsContextValue>> = (
  props,
) => {
  const { children, client } = props;

  return (
    <FlagsContext.Provider value={{ client }}>{children}</FlagsContext.Provider>
  );
};

function App(): ReactNode {
  const flagsClient = new FlagsClient({
    providers: [exmpleProvider],
  });

  return (
    <ReactFlagsProvider client={flagsClient}>
      <ComponentWithFlag />
    </ReactFlagsProvider>
  );
}

export default App;
