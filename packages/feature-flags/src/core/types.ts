export type Flag = {
  name: string;
  enabled: boolean;
};

export type FlagsRecord<FlagName extends string = string> = Record<
  FlagName,
  Flag
>;

export type FlagsStorage = Map<string, Flag>;

export interface FlagsProvider {
  name: string;
  load(): Promise<Array<Flag>>;
  refreshInterval?: number;
}

export type FlagsClientParameters = {
  initialValues?: FlagsRecord;
  providers?: ReadonlyArray<FlagsProvider>;
  refreshInterval?: number;
};

export type FlagsLoadingEvents = {
  loadingStarted: undefined;
  loaded: Array<Flag>;
  loadingFailed: unknown;
};

export type FlagsLoadingState = keyof FlagsLoadingEvents;

export type FlagsLoading = {
  state: FlagsLoadingState | "indeterminate";
  error: unknown;
};

export interface DefinedFlagName {
  name: "test";
}
