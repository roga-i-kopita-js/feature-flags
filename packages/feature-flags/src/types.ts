export type Flag = {
  name: Key;
  enabled: boolean;
};

type Key = string | number;

export type FlagsRecord<FlagName extends Key = Key> = Record<FlagName, Flag>;

export type FlagsStorage = Map<Key, Flag>;

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

export type $MergeBy<T, K> = Omit<T, keyof K> & K;

export interface CustomTypeOptions {}

export type TypeOptions = $MergeBy<{ flagName: string }, CustomTypeOptions>;

// export type DefinedFlagName = TypeOptions["flagName"];
