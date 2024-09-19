import type { DefinedFlagName, FlagsProvider } from "feature-flags";
import { FlagsClient } from "feature-flags";

const staticProvider: FlagsProvider = {
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

export const flagsClient = new FlagsClient({
  providers: [staticProvider],
});

const [flag] = flagsClient.getItems(["featureV1"]);
