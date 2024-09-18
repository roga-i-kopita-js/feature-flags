import type { FeatureV2Model } from "../types";

export const getDataForV2Feature = async function (): Promise<FeatureV2Model> {
  return new Promise((resolve) => {
    resolve({
      text: "Feature V2",
    });
  });
};
