import type { Handler } from "mitt";
import mitt from "mitt";

import type {
  Flag,
  FlagsClientParameters,
  FlagsLoading,
  FlagsLoadingEvents,
  FlagsLoadingState,
  FlagsProvider,
  FlagsRecord,
  FlagsStorage,
  TypeOptions,
} from "./types";

export class FlagsClient {
  private readonly flagsStorage: FlagsStorage;
  private readonly providers: ReadonlyArray<FlagsProvider>;
  private readonly eventEmitter = mitt<FlagsLoadingEvents>();

  public readonly loading: FlagsLoading = {
    state: "indeterminate",
    error: null,
  };

  constructor(parameters: FlagsClientParameters) {
    this.flagsStorage = new Map(
      parameters.initialValues
        ? Object.entries(parameters.initialValues)
        : undefined,
    );
    this.providers = parameters.providers ?? [];
    this.eventEmitter.on("*", (type) => this.setLoadingState.bind(type));
  }

  async load(): Promise<void> {
    this.eventEmitter.emit("loadingStarted");
    try {
      const flagChunks = await Promise.all(
        this.providers.map((provider) => provider.load()),
      );
      const flags = flagChunks.flat();
      flags.forEach((flag) => this.flagsStorage.set(flag.name, flag));
      this.eventEmitter.emit("loaded", flags);
    } catch (e) {
      this.eventEmitter.emit("loadingFailed", e);
    }
  }

  private setLoadingState(loadingState: FlagsLoadingState): void {
    this.loading.state = loadingState;
  }

  public getItem<const FlagName extends TypeOptions["flagName"]>(
    flagName: FlagName,
  ): Flag {
    return this.getFlagFromStorage(flagName);
  }

  public getItems<FlagName extends TypeOptions["flagName"]>(
    flagNames: Array<FlagName>,
  ): FlagsRecord<FlagName> {
    return flagNames.reduce<FlagsRecord>((selectedFlags, flagName) => {
      selectedFlags[flagName] = this.getFlagFromStorage(flagName);
      return selectedFlags;
    }, {});
  }

  private getFlagFromStorage<FlagName extends TypeOptions["flagName"]>(
    flagName: FlagName,
  ): Flag {
    if (!this.flagsStorage.has(flagName)) {
      console.warn(
        `A flag "${flagName}" was not found, a fallback value is used. Please, check the correctness of the name.`,
      );
    }
    return (
      this.flagsStorage.get(flagName) ?? {
        name: flagName,
        enabled: false,
      }
    );
  }

  public on<EventName extends keyof FlagsLoadingEvents>(
    type: EventName,
    handler: Handler<FlagsLoadingEvents[EventName]>,
  ): void {
    this.eventEmitter.on(type, handler);
  }

  public off<EventName extends keyof FlagsLoadingEvents>(
    type: EventName,
    handler?: Handler<FlagsLoadingEvents[EventName]>,
  ): void {
    this.eventEmitter.off(type, handler);
  }

  public get flags(): FlagsRecord {
    return Object.fromEntries(this.flagsStorage);
  }
}
