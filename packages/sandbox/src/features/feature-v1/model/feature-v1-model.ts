import type { FeatureV1Model } from "../types";

export const getDataForV1Feature = async function (): Promise<FeatureV1Model> {
  return new Promise((resolve) => {
    resolve({
      text: "Feature V1",
    });
  });
};
