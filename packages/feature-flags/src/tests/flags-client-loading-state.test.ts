import { describe, expect, it } from "vitest";

import { FlagsClient } from "../flags-client";
import type { Flag } from "../types";

describe("Testing correct loading state changing", () => {
  it("should works correctly (successfully load)", async () => {
    const instance = new FlagsClient({
      providers: [
        {
          name: "1",
          async load() {
            return new Promise<Array<Flag>>((resolve) => {
              setTimeout(() => {
                resolve([
                  {
                    name: "1",
                    enabled: true,
                  },
                ]);
              }, 100);
            });
          },
        },
      ],
    });

    instance.load().finally(() => {
      expect(instance.loading.state).toBe("loaded");
    });
    expect(instance.loading.state).toBe("loadingStarted");
  });

  it("should works correctly (error load)", async () => {
    const instance = new FlagsClient({
      providers: [
        {
          name: "1",
          async load() {
            throw new Error("some error");
          },
        },
      ],
    });

    instance.load().finally(() => {
      expect(instance.loading.state).toBe("loadingFailed");
    });

    expect(instance.loading.state).toBe("loadingStarted");
  });
});
