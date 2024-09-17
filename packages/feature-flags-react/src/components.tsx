import type { FC, PropsWithChildren } from "react";

import type { FlagsContextValue } from "./context";
import { FlagsContext } from "./context";

export const ReactFlagsProvider: FC<PropsWithChildren<FlagsContextValue>> = (
  props,
) => {
  const { children, client } = props;

  return (
    <FlagsContext.Provider value={{ client }}>{children}</FlagsContext.Provider>
  );
};
