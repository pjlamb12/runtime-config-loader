# Angular Runtime Configuration Loader

Most applications require certain configuration values that can be changed at runtime of the app. The `environment.ts` files in an Angular application technically work for setting configuration values in an app, but those are buildtime configuration values. This means that they are set when the application is built, and can't be changed unless the app is built again.

## Features

-   **Flexible Configuration**: Use a single JSON file or multiple files, and combine them into one configuration object.
-   **Type Safety**: Full support for TypeScript generics to ensure your configuration is strictly typed throughout your app.
-   **Modern DI Integration**: Use the `RUNTIME_CONFIG` injection token for clean, typed access to your config.

## How to use it

### Install

`npm install runtime-config-loader`

### Implement

In your `app.config.ts`, provide the configuration:

```ts
import { provideRuntimeConfig } from 'runtime-config-loader';

export const appConfig: ApplicationConfig = {
	providers: [
		provideRuntimeConfig<MyConfig>({ configUrl: './assets/config.json' }),
	],
};
```

### Access Configuration

Inject the typed configuration directly into your components:

```ts
import { RUNTIME_CONFIG } from 'runtime-config-loader';

constructor(@Inject(RUNTIME_CONFIG) private config: MyConfig) {
	console.log(this.config.apiUrl); // Fully typed!
}
```

For more advanced usage and configuration options, check the [library documentation](libs/runtime-config-loader/README.md).

## Detailed Documentation

For more detailed information on configuration options, multiple config paths, and advanced usage, please see the [Library README](file:///Users/pjlamb12/oss/runtime-config-loader/libs/runtime-config-loader/README.md).
