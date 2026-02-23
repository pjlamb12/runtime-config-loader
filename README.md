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

There are two main ways to use generics for type safety in your application.

#### Option 1: Using the `RUNTIME_CONFIG` Token (Recommended)

You can provide the type directly in `provideRuntimeConfig`. This also sets up the `RUNTIME_CONFIG` injection token, which you can use to inject the typed configuration object directly into your components or services.

```ts
// app.config.ts
provideRuntimeConfig<MyConfig>({ configUrl: './assets/config.json' })

// component.ts
import { RUNTIME_CONFIG } from 'runtime-config-loader';

constructor(@Inject(RUNTIME_CONFIG) private config: MyConfig) {
	console.log(this.config.apiUrl); // Fully typed!
}
```

#### Option 2: Using the Service with a Type Alias

If you prefer to use the `RuntimeConfigLoaderService` methods (like `getConfigObjectKey`), you can define a type alias to avoid repeating the generic type everywhere.

```ts
// config.service.ts
export type MyConfigService = RuntimeConfigLoaderService<MyConfig>;

// component.ts
constructor(private configSvc: MyConfigService) {
	const apiUrl = this.configSvc.getConfigObjectKey('apiUrl'); // Typed as string | null
}
```

#### Option 3: Specific Configuration Tokens

If you prefer your components to depend only on specific configuration values rather than the entire configuration object, you can use the `provideConfigToken` helper. This allows you to inject individual configuration properties cleanly and maintain strict boundaries.

```ts
import { InjectionToken } from '@angular/core';
import { provideRuntimeConfig, provideConfigToken } from 'runtime-config-loader';

// 1. Define tokens for your specific configuration values
export const API_URL = new InjectionToken<string>('API_URL');

// 2. Provide them using the helper
export const appConfig: ApplicationConfig = {
	providers: [
		provideRuntimeConfig<MyConfig>({ configUrl: './assets/config.json' }),

		// Provide the specific token mapping it to a key in your config
		provideConfigToken(API_URL, 'apiUrl'),

		// It also supports dot-notation for nested keys
		// provideConfigToken(NESTED_TOKEN, 'api.baseUrl')
	],
};

// 3. Inject them directly
// component.ts
constructor(@Inject(API_URL) private apiUrl: string) {
	console.log(this.apiUrl); // Typed as string | null
}
```

### Nested Key Access (Dot-Notation)

The `getConfigObjectKey` method supports dot-notation for accessing deeply nested configuration values.

```ts
// For a config like: { api: { baseUrl: 'https://api.com' } }
const baseUrl = this.configSvc.getConfigObjectKey('api.baseUrl'); // Returns 'https://api.com'
```

> [!NOTE]
> When using dot-notation for nested keys, the return type will be `any` unless you provide an explicit generic type to the call:
> `this.configSvc.getConfigObjectKey<string>('api.baseUrl')`

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

#### Fallback Configuration

If you'd like the application to gracefully fall back to a default configuration in the event that the config file(s) fail to load (e.g., due to network errors or 404s), you can provide a `defaultConfig` object.

```ts
provideRuntimeConfig({
	configUrl: './assets/config.json',
	defaultConfig: {
		apiUrl: 'https://fallback.api.com',
		theme: 'light',
	},
});
```

When a failure occurs and `defaultConfig` is provided, the application will emit a console warning (`Falling back to default configuration`), load the provided object, and proceed with initialization.

### HTTP Options and Headers

You can pass standard Angular `HttpClient` options (such as custom `HttpHeaders` or `HttpContext`) to the underlying HTTP request doing the fetching.

Pass an `options` object into the `provideRuntimeConfig` function:

```ts
import { HttpHeaders } from '@angular/common/http';

provideRuntimeConfig({
	configUrl: './assets/config.json',
	options: {
		headers: new HttpHeaders({
			Authorization: 'Bearer YOUR_TOKEN_HERE',
			'X-Custom-Header': 'custom-value',
		}),
		withCredentials: true,
	},
});
```

This is useful for APIs that require authentication or tracking headers to return configuration data.

### Runtime Schema Validation

You can provide an optional `validator` function to verify the configuration before the application starts. If validation fails (returns `false`, throws an error, or emits an error), the configuration will be set to `null`.

The validator supports synchronous results, `Promise<boolean>`, and `Observable<boolean>`.

```ts
provideRuntimeConfig<MyConfig>({
	configUrl: './assets/config.json',
	validator: (config) => {
		return !!config.apiUrl && !!config.apiKey;
	},
});
```

#### Integration with Zod

This feature integrates well with schema validation libraries like [Zod](https://zod.dev):

```ts
import { z } from 'zod';

const ConfigSchema = z.object({
	apiUrl: z.string().url(),
	apiKey: z.string().min(10),
});

provideRuntimeConfig({
	configUrl: './assets/config.json',
	validator: (config) => ConfigSchema.safeParse(config).success,
});
```

Make sure that the path(s) you provide are accessible by the Angular application. The `assets` folder is generally the easiest place to serve these files.
