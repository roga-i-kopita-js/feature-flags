import type { FC } from "react";

import type { FeatureV1Model } from "../types";

export const FeatureV1: FC<{ data: FeatureV1Model }> = ({ data }) => {
  return <h1>{data.text}</h1>;
};
