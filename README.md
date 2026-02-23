# Angular Runtime Configuration Loader

Most applications require certain configuration values that can be changed at runtime of the app. The `environment.ts` files in an Angular application technically work for setting configuration values in an app, but those are buildtime configuration values. This means that they are set when the application is built, and can't be changed unless the app is built again.

## Overview

This library provides an easy way to load one or more JSON files with configuration values or make one or more HTTP GET calls to an API endpoint that returns those values. The config objects that are returned from the call(s) will be combined into a single configuration object. You can then use that configuration throughout the application. The default location of the JSON file is in the `assets` folder, at `./assets/config.json`. When the service loads the file, it stores that configuration object in a local variable which can be accessed via the `getConfig()` and `getConfigObjectKey(key: string)` methods. `getConfig` returns the entire configuration object; `getConfigObjectKey(key: string)` returns part of the configuration object, namely the part defined by the key passed in. In some cases, the `config.json` is not finished loading before other modules/services are, so the above methods will return null. If that is the case, subscribe to the `configSubject` and access the configuration object that way.

## How to Implement

In your Angular application's `app.config.ts` (or wherever you provide your environment providers), use `provideRuntimeConfig`:

```ts
import { provideRuntimeConfig } from 'runtime-config-loader';

export const appConfig: ApplicationConfig = {
	providers: [
		// ...,
		provideRuntimeConfig({ configUrl: './assets/config.json' }),
		// ...
	],
};
```

The library will load your configuration file before the application starts, making it available via the `RuntimeConfigLoaderService`.

## Detailed Documentation

For more detailed information on configuration options, multiple config paths, and advanced usage, please see the [Library README](file:///Users/pjlamb12/oss/runtime-config-loader/libs/runtime-config-loader/README.md).
