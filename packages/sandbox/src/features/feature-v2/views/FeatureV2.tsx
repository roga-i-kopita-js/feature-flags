import type { FC } from "react";

import type { FeatureV2Model } from "../types";

export const FeatureV2: FC<{ data: FeatureV2Model }> = ({ data }) => {
  return <h1>{data.text}</h1>;
};
