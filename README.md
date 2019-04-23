# Angular Runtime Configuration Loader

[![Join the chat at https://gitter.im/runtime-config-loader/Lobby](https://badges.gitter.im/runtime-config-loader/Lobby.svg)](https://gitter.im/runtime-config-loader/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Most applications require certain configuration values that can be changed at runtime of the app. The `environment.ts` files in an Angular application technically work for setting configuration values in an app, but those are buildtime configuration values. This means that they are set when the application is built, and can't be changed unless the app is built again.

## Overview

This library provides an easy way to load a JSON file with configuration values or make an HTTP GET call to an API endpoint that returns those values. You can then use that configuration throughout the application. The default location of the JSON file is in the `assets` folder, at `./assets/config.json`. When the service loads the file, it stores that configuration object in a local variable which can be accessed via the `getConfig()` and `getConfigObjectKey(key: string)` methods. `getConfig` returns the entire configuration object; `getConfigObjectKey(key: string)` returns part of the configuration object, namely the part defined by the key passed in. In some cases, the `config.json` is not finished loading before other modules/services are, so the above methods will return null. If that is the case, subscribe to the `configSubject` and access the configuration object that way.

## How to Implement

In your `app.module.ts` file, add the following to the `@NgModule` decorator:

```ts
imports: [..., RuntimeConfigLoaderModule, ...],
```

That's it; it's that simple. In the `RuntimeConfigLoaderModule`, the `APP_INITIALIZER` token is used to run a function which loads the configuration from a file or an API endpoint that can be used throughout the application.

If you implement the library exactly as it is above, the configuration file needs to be in the `./assets/config.json` location as mentioned above. If you'd like to load the file from a different location, provide that location in the `.forRoot()` method when importing the `RuntimeConfigLoaderModule`:

```js
imports: [
  ...,
  RuntimeConfigLoaderModule.forRoot(
    { configUrl: './path/to/config/config.json' }
  ),
  ...]
```

Make sure that the path you provide here is accessible by the Angular application, meaning that the file is somewhere the app can load it. In my opinion, the `assets` folder is the easiest place to work from.
