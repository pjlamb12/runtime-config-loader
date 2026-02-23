# Angular Runtime Configuration Loader

Most applications require certain configuration values that can be changed at runtime of the app. The `environment.ts` files in an Angular application technically work for setting configuration values in an app, but those are buildtime configuration values. This means that they are set when the application is built, and can't be changed unless the app is built again.

## Overview

This library provides an easy way to load one or more JSON files with configuration values or make one or more HTTP GET calls to an API endpoint that returns those values. The config objects that are returned from the call(s) will be combined into a single configuration object. You can then use that configuration throughout the application. The default location of the JSON file is in the `assets` folder, at `./assets/config.json`. When the service loads the file, it stores that configuration object in a local variable which can be accessed via the `getConfig()` and `getConfigObjectKey(key: string)` methods. `getConfig` returns the entire configuration object; `getConfigObjectKey(key: string)` returns part of the configuration object, namely the part defined by the key passed in. In some cases, the `config.json` is not finished loading before other modules/services are, so the above methods will return null. If that is the case, subscribe to the `configSubject` and access the configuration object that way.

### How to Implement

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

That's it; it's that simple. The `provideRuntimeConfig` function sets up the `APP_INITIALIZER` token to load the configuration from a file or an API endpoint before the application starts.

### Type Safety with Generics

You can provide a type for your configuration object to get full type safety and auto-completion when using the `RuntimeConfigLoaderService`.

```ts
interface MyConfig {
	apiUrl: string;
	featureFlags: {
		newDashboard: boolean;
	};
}

// In your component or service:
constructor(private configSvc: RuntimeConfigLoaderService<MyConfig>) {
	const config = this.configSvc.getConfig(); // config is typed as MyConfig | null
	const apiUrl = this.configSvc.getConfigObjectKey('apiUrl'); // apiUrl is typed as string | null
}
```

### Configuration

The `provideRuntimeConfig` function accepts a configuration object with a `configUrl` property. This can be a single string or an array of strings.

#### Single Config File

The default location is `./assets/config.json`. If you'd like to load the file from a different location:

```ts
provideRuntimeConfig({ configUrl: './path/to/config/config.json' });
```

#### Multiple Config Files

You can load multiple files (or API endpoints) and they will be merged into a single configuration object.

```ts
provideRuntimeConfig({
	configUrl: [
		'./path/to/config/config-1.json',
		'./path/to/config/config-2.json',
	],
});
```

If an attribute is repeated in multiple configuration files, the latest value is kept. For example, if `apiUrl` exists in both files above, the value from `config-2.json` will override the value from `config-1.json`.

> [!TIP]
> This is useful for maintaining local overrides (e.g., `local.config.json` ignored by git) or separating environment-specific values from global ones.

Make sure that the path(s) you provide are accessible by the Angular application. The `assets` folder is generally the easiest place to serve these files.
