# feature-flags

The package is a utility that allows you to conveniently integrate the "feature flags" into your application

## FlagsClient usage example

```ts
import type { FlagsProvider } from "feature-flags";
import { FlagsClient } from "feature-flags";

// example of provider
const staticProvider: FlagsProvider = {
    name: "example-provider",
    // here u can load flags from external storage
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

```
### First of all, you need to load your providers:

```ts
await flagsClient.load()
```

### Now you can get access to single "feature flag" like:
```ts
const flag = flagsClient.getItem("name"); 

if (flag.enabled) {
    // do something
}
```

### Multiple
```ts
// multiple flags
const [flag] = flagsClient.getItems(["name"]);

if (flag.enabled) {
    // do something
}
```

## React integration

```tsx
import {enabled} from "eslint-plugin-n/lib/types-code-path-analysis/debug-helpers";
import type {FlagsProvider} from "feature-flags";
import {FlagsClient} from "feature-flags";
import {FC, ReactNode} from "react";

// example of provider
const staticProvider: FlagsProvider = {
    name: "example-provider",
    // here u can load flags from external storage
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

export const App: FC = () => {
    return <ReactFlagsProvider client={flagsClient}>
        <Component/>
    </ReactFlagsProvider>
}

export const Component: FC = () => {
    // single
    const {enabled} = useFlag("flag-name");

    if (enabled) {
        //do something
    }
    
    // multiple
    const [flag] = useFlags(["dff"]);
    
    if (flag.enabled) {
        //do something
    }
    
    return null;
}
```