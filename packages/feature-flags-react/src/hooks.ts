import type {
  DefinedFlagName,
  Flag,
  FlagsLoading,
  FlagsRecord,
} from "feature-flags";
import { useContext, useEffect, useState } from "react";

import type { FlagsContextValue } from "./context";
import { FlagsContext } from "./context";

export function useFlagsContext(): FlagsContextValue {
  const context = useContext(FlagsContext);
  if (context === null) {
    throw new Error(
      "Using FlagsContext outside of FlagsProvider is not possible",
    );
  }
  return context;
}

export function useFlag(flagName: DefinedFlagName["names"]): Flag {
  const { client } = useFlagsContext();
  const [flag, setFlag] = useState<Flag>(() => client.getItem(flagName));

  useEffect(() => {
    const eventHandler = (): void => {
      setFlag(client.getItem(flagName));
    };

    client.on("loaded", eventHandler);
    return () => client.off("loaded", eventHandler);
  }, [client, flagName]);

  return flag;
}

export function useFlags<FlagName extends DefinedFlagName["names"]>(
  flagNames: Array<FlagName>,
): FlagsRecord<FlagName> {
  const { client } = useFlagsContext();
  const [flags, setFlags] = useState<FlagsRecord>(() =>
    client.getItems(flagNames),
  );

  useEffect(() => {
    const eventHandler = (): void => {
      setFlags(client.getItems(flagNames));
    };

    client.on("loaded", eventHandler);
    return () => client.off("loaded", eventHandler);
  }, [client, flagNames]);

  return flags;
}

export function useFlagsLoading(): FlagsLoading {
  const { client } = useFlagsContext();
  const [loading, setLoading] = useState(client.loading);

  useEffect(() => {
    const eventHandler = (): void => {
      setLoading(client.loading);
    };

    client.on("loadingStarted", eventHandler);
    client.on("loaded", eventHandler);
    client.on("loadingFailed", eventHandler);

    return () => {
      client.off("loadingStarted", eventHandler);
      client.off("loaded", eventHandler);
      client.off("loadingFailed", eventHandler);
    };
  }, [client]);

  return loading;
}
