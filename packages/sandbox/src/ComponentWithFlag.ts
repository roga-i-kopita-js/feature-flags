import { FlagsContext } from "feature-flags-react";
import type { FC } from "react";
import { useContext } from "react";

export const ComponentWithFlag: FC = () => {
  const context = useContext(FlagsContext);
  console.log(context);
  return "flag enabled";
};
