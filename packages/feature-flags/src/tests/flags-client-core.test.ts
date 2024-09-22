import mitt from "mitt";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { FlagsClient } from "../flags-client";
import type {
  DefinedFlagName,
  Flag,
  FlagsLoadingEvents,
  FlagsLoadingState,
  FlagsProvider,
  FlagsRecord,
  FlagsStorage,
} from "../types";

afterEach(() => {
  vi.clearAllMocks();
});

beforeEach(() => {
  vi.clearAllMocks();
});

const onMock = vi.fn();
const offMock = vi.fn();
const emitMock = vi.fn();

vi.mock("mitt", () => {
  return {
    default: () => {
      return {
        on: onMock,
        off: offMock,
        emit: emitMock,
      };
    },
  };
});

class MockClient extends FlagsClient {
  public readonly eventEmitter = mitt<FlagsLoadingEvents>();

  get _flagsStorage(): FlagsStorage {
    return this.flagsStorage;
  }

  get _providers(): ReadonlyArray<FlagsProvider> {
    return this.providers;
  }

  public setLoadingState(loadingState: FlagsLoadingState): void {
    return super.setLoadingState(loadingState);
  }
}

describe("FlagsClient.constructor testing", () => {
  it("should touch flagsStorage with empty initialValues", () => {
    const instance = new MockClient({});
    expect(instance._flagsStorage).toEqual(new Map());
  });

  it("should touch flagsStorage with initialValues", () => {
    const INITIAL_VALUES: FlagsRecord = {
      flag: {
        enabled: true,
        name: "flag",
      },
    };
    const instance = new MockClient({ initialValues: INITIAL_VALUES });
    expect(instance._flagsStorage).toEqual(
      new Map(Object.entries(INITIAL_VALUES)),
    );
  });

  it("should touch providers with empty providers", () => {
    const instance = new MockClient({});
    expect(instance._providers).toEqual([]);
  });

  it("should touch providers with correct providers", () => {
    const PROVIDERS: Array<FlagsProvider> = [
      {
        name: "flag",
        async load() {
          return [
            {
              name: "flag",
              enabled: true,
            },
          ];
        },
      },
    ];
    const instance = new MockClient({
      providers: PROVIDERS,
    });
    expect(instance._providers).toEqual(PROVIDERS);
  });

  it("should call 'on' once", () => {
    const _instance = new MockClient({});
    expect(onMock).toHaveBeenCalledOnce();
  });

  it("should call 'on' with correct arguments", () => {
    const _instance = new MockClient({});
    expect(onMock).toHaveBeenCalledWith("*", expect.any(Function));
  });

  it("should init instance with correct 'loading' state", () => {
    const instance = new MockClient({});
    expect(instance.loading).toEqual({
      state: "indeterminate",
      error: null,
    });
  });
});

describe("Testing FlagsClient.load function (successful loading)", () => {
  it('Should call "emit" 2 times', async () => {
    const instance = new MockClient({});
    await instance.load();
    expect(emitMock).toHaveBeenCalledTimes(2);
  });

  it('Should call "emit" with correct arguments', async () => {
    const instance = new MockClient({
      providers: [
        {
          name: "1",
          async load() {
            return [
              {
                name: "1",
                enabled: true,
              },
            ];
          },
        },
        {
          name: "2",
          async load() {
            return [
              {
                name: "2",
                enabled: true,
              },
            ];
          },
        },
      ],
    });
    await instance.load();
    expect(emitMock).toHaveBeenCalledWith("loadingStarted");
    expect(emitMock).toHaveBeenCalledWith("loaded", [
      {
        enabled: true,
        name: "1",
      },
      {
        enabled: true,
        name: "2",
      },
    ]);
  });

  it('Should correct change "flagStorage" state', async () => {
    const instance = new MockClient({
      providers: [
        {
          name: "1",
          async load() {
            return [
              {
                name: "1",
                enabled: true,
              },
            ];
          },
        },
        {
          name: "2",
          async load() {
            return [
              {
                name: "2",
                enabled: true,
              },
            ];
          },
        },
      ],
    });
    await instance.load();
    expect(instance._flagsStorage).toEqual(
      new Map(
        [
          {
            enabled: true,
            name: "1",
          },
          {
            enabled: true,
            name: "2",
          },
        ].map((obj) => [obj.name, obj]),
      ),
    );
  });
});

describe("Testing FlagsClient.load function (error loading)", () => {
  it('Should call "emit" 2 times', async () => {
    const instance = new MockClient({
      providers: [
        {
          name: "1",
          async load() {
            throw new Error("some error");
          },
        },
      ],
    });
    await instance.load();
    expect(emitMock).toHaveBeenCalledTimes(2);
  });

  it('Should call "emit" with correct arguments', async () => {
    const instance = new MockClient({
      providers: [
        {
          name: "1",
          async load() {
            throw new Error("some error");
          },
        },
      ],
    });
    await instance.load();
    expect(emitMock).toHaveBeenCalledWith("loadingStarted");
    expect(emitMock).toHaveBeenCalledWith(
      "loadingFailed",
      new Error("some error"),
    );
  });

  it('should not change, "flagsStorage" state', async () => {
    const instance = new MockClient({
      providers: [
        {
          name: "1",
          async load() {
            throw new Error("some error");
          },
        },
      ],
    });
    await instance.load();
    expect(instance._flagsStorage).toEqual(new Map());
  });
});

describe("Testings FlagsClient.setLoadingState", () => {
  it("should correct change loading.state", () => {
    const instance = new MockClient({});
    instance.setLoadingState("loadingStarted");
    expect(instance.loading.state).toBe("loadingStarted");
  });
});

const FLAG: Flag = {
  name: "name",
  enabled: true,
};
const getFlagFromStorageMock = vi.fn(() => FLAG);

class MockClientWithFlagsFromStorage extends MockClient {
  public getFlagFromStorage = getFlagFromStorageMock;
}

describe("Testings FlagsClient.getItem", () => {
  it('should call "getFlagFromStorage" once', () => {
    const instance = new MockClientWithFlagsFromStorage({});
    instance.getItem("name");
    expect(getFlagFromStorageMock).toHaveBeenCalledOnce();
  });

  it('should call "getFlagFromStorage" with right arguments', () => {
    const instance = new MockClientWithFlagsFromStorage({});
    instance.getItem("name");
    expect(getFlagFromStorageMock).toHaveBeenCalledWith("name");
  });

  it('should call "getFlagFromStorage" return right value', () => {
    const instance = new MockClientWithFlagsFromStorage({});
    const flag = instance.getItem("name");
    expect(flag).toEqual(FLAG);
  });
});

describe("Testings FlagsClient.getItems", () => {
  const FLAGS = ["flag1", "flag2"] satisfies Array<DefinedFlagName>;

  it("should call getFlagFromStorage correct times", () => {
    const instance = new MockClientWithFlagsFromStorage({});
    instance.getItems(FLAGS);
    expect(getFlagFromStorageMock).toHaveBeenCalledTimes(FLAGS.length);
  });

  it("should call getFlagFromStorage with right arguments", () => {
    const instance = new MockClientWithFlagsFromStorage({});
    instance.getItems(FLAGS);
    FLAGS.forEach((flag) => {
      expect(getFlagFromStorageMock).toHaveBeenCalledWith(flag);
    });
  });

  it("should return right value", () => {
    const instance = new MockClientWithFlagsFromStorage({});
    const result = instance.getItems(FLAGS);
    expect(result).toEqual({
      flag1: FLAG,
      flag2: FLAG,
    });
  });
});

class MockClientWithPublicFlagsFromStorage extends MockClient {
  public getFlagFromStorage<FlagName extends DefinedFlagName>(
    flagName: FlagName,
  ): Flag {
    return super.getFlagFromStorage(flagName);
  }
}

describe("Testing FlagsClient.getFlagFromStorage", () => {
  it("should return fallback value if flag not exist", () => {
    const instance = new MockClientWithPublicFlagsFromStorage({});
    const result = instance.getFlagFromStorage("flag1");
    expect(result).toEqual({
      name: "flag1",
      enabled: false,
    });
  });

  it("should return right value", () => {
    const instance = new MockClientWithPublicFlagsFromStorage({
      initialValues: {
        [FLAG.name]: FLAG,
      },
    });
    const result = instance.getFlagFromStorage(`${FLAG.name}`);
    expect(result).toEqual(FLAG);
  });
});

describe("Testing FlagsClient.on ", () => {
  const instance = new MockClient({});

  it("should 'on' once", () => {
    const handler = vi.fn();
    instance.on("loaded", handler);
    expect(onMock).toHaveBeenCalledOnce();
  });

  it("should 'on' with corrent args", () => {
    const handler = vi.fn();
    instance.on("loaded", handler);
    expect(onMock).toHaveBeenCalledWith("loaded", handler);
  });
});

describe("Testing FlagsClient.of ", () => {
  const instance = new MockClient({});

  it("should 'off' once", () => {
    const handler = vi.fn();
    instance.off("loaded", handler);
    expect(offMock).toHaveBeenCalledOnce();
  });

  it("should 'off' with corrent args", () => {
    const handler = vi.fn();
    instance.off("loaded", handler);
    expect(offMock).toHaveBeenCalledWith("loaded", handler);
  });
});

describe("Testing FlagsClient.flags getter", () => {
  it("should return all flags", () => {
    const instance = new MockClient({
      initialValues: {
        [FLAG.name]: FLAG,
      },
    });

    expect(instance.flags).toEqual({
      [FLAG.name]: FLAG,
    });
  });
});
