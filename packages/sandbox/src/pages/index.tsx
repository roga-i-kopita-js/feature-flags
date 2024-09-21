import { useFlag } from "feature-flags-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { getDataForV1Feature } from "../features/feature-v1/model/feature-v1-model";
import type { FeatureV1Model } from "../features/feature-v1/types";
import { FeatureV1 } from "../features/feature-v1/views/FeatureV1";
import { getDataForV2Feature } from "../features/feature-v2/model/feture-v2-model";
import type { FeatureV2Model } from "../features/feature-v2/types";
import { FeatureV2 } from "../features/feature-v2/views/FeatureV2";
import { flagsClient } from "../flags-client";

type LoadData = {
  featureV1?: FeatureV1Model;
  featureV2?: FeatureV2Model;
};

const loadData = async function (): Promise<LoadData> {
  const result: LoadData = {};
  // во время загрузки данных можем использовать клиент напрямую
  if (flagsClient.getItem("flag1").enabled) {
    result.featureV1 = await getDataForV1Feature();
  } else {
    result.featureV2 = await getDataForV2Feature();
  }

  return result;
};

export default function Page(): ReactNode {
  const [state, setState] = useState<LoadData>({});
  useEffect(() => {
    loadData().then(setState);
  }, []);

  // в реакт компонентах можем использовать хук
  const { enabled } = useFlag("flag1");

  if (enabled && state.featureV1) {
    return <FeatureV1 data={state.featureV1} />;
  }

  if (state.featureV2) {
    return <FeatureV2 data={state.featureV2} />;
  }
}
