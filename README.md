# Angular Runtime Configuration Loader

Most applications require certain configuration values that can be changed at runtime of the app. The `environment.ts` files in an Angular application technically work for setting configuration values in an app, but those are buildtime configuration values. This means that they are set when the application is built, and can't be changed unless the app is built again.

## Overview

This library provides an easy way to load a JSON file with configuration values that you can use throughout the application. The default location of the JSON file is in the `assets` folder, at `./assets/config.json`. When the service loads the file, it stores that configuration object in a local variable which can be accessed via the `getConfig()` and `getConfigObjectKey(key: string)` methods. `getConfig` returns the entire configuration object; `getConfigObjectKey(key: string)` returns part of the configuration object, namely the part defined by the key passed in.

## How to Implement

In your `app.module.ts` file, add the following to the `@NgModule` decorator:

```js
imports: [..., RuntimeConfigLoaderModule, ...],
providers: [
  ...,
  {
    provide: APP_INITIALIZER,
    useFactory: initConfig,
    deps: [RuntimeConfigLoaderService],
    multi: true
  },
  ...
]
```

The `initConfig` value for the `useFactory` key should also be imported from this library. If you implement the library exactly as it is above, the configuration file needs to be in the `./assets/config.json` location as mentioned above. If you'd like to load the file from a different location, provide that location in the `.forRoot()` method when importing the `RuntimeConfigLoaderModule`:

```js
imports: [
  ...,
  RuntimeConfigLoaderModule.forRoot(
    { fileUrl: './path/to/config/config.json' }
  ),
  ...]
```

Make sure that the path you provide here is accessible by the Angular application, meaning that the file is somewhere the app can load it. In my opinion, the `assets` folder is the easiest place to work from.
