import type { FlagsProvider } from "feature-flags";
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
flagsClient.off("loadingFailed", handler);
