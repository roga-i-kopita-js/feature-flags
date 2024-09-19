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
  /**
   * Unique name
   */
  name: string;
  /**
   * Method that allows us to load flags from external storage
   */
  load(): Promise<Array<Flag>>;
  refreshInterval?: number;
}

export type FlagsClientParameters = {
  /**
   * initial values,
   * Can be useful in applications with ssr, in order to forward pre-loaded flags
   */
  initialValues?: FlagsRecord;
  /**
   * List of providers
   */
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
  names: string;
}
