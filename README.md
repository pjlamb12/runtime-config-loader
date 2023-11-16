# Angular Runtime Configuration Loader

Most applications require certain configuration values that can be changed at runtime of the app. The `environment.ts` files in an Angular application technically work for setting configuration values in an app, but those are buildtime configuration values. This means that they are set when the application is built, and can't be changed unless the app is built again.

## Overview

This library provides an easy way to load one or more JSON files with configuration values or make one or more HTTP GET calls to an API endpoint that returns those values. The config objects that are returned from the call(s) will be combined into a single configuration object. You can then use that configuration throughout the application. The default location of the JSON file is in the `assets` folder, at `./assets/config.json`. When the service loads the file, it stores that configuration object in a local variable which can be accessed via the `getConfig()` and `getConfigObjectKey(key: string)` methods. `getConfig` returns the entire configuration object; `getConfigObjectKey(key: string)` returns part of the configuration object, namely the part defined by the key passed in. In some cases, the `config.json` is not finished loading before other modules/services are, so the above methods will return null. If that is the case, subscribe to the `configSubject` and access the configuration object that way.

## How to Implement

In your `app.module.ts` file, add the following to the `@NgModule` decorator:

```ts
imports: [..., RuntimeConfigLoaderModule, ...],
```

That's it; it's that simple. In the `RuntimeConfigLoaderModule`, the `APP_INITIALIZER` token is used to run a function which loads the configuration from a file or an API endpoint that can be used throughout the application.

If you implement the library exactly as it is above, the configuration file needs to be in the `./assets/config.json` location as mentioned above. If you'd like to load the file from a different location, provide that using an injection token in the app's main providers array:

```ts
providers: [
  ...,
  {
    provide: RUNTIME_CONFIG_LOADER_CONFIG,
    useValue: { configUrl: './path/to/config/config.json' }
  ),
  ...]
```

If you want to load multiple files, the value of `configUrl` should be an array of strings:

```ts
providers: [
  ...,
  {
    provide: RUNTIME_CONFIG_LOADER_CONFIG,
    useValue: { configUrl: ['./path/to/config/config-1.json', './path/to/config/config-2.json'] }
  ),
  ...]
```

> Make sure that the path(s) you provide here is accessible by the Angular application, meaning that the file is somewhere the app can load it. In my opinion, the `assets` folder is the easiest place to work from.

## Local Config File

One reason you may want to load multiple configuration objects is so that you can set the configuration on your machine without affecting anyone else. For example, you could have a `local.config.json` file that is not included in source control. Some of the values in that file would overwrite the values in a config file that everyone can use. There is an improved way of providing the local config file for your app. There are two new attributes on the config object, `localConfigUrl` and `useLocalConfig`. The first, `localConfigUrl`, is the path to the local config file. Again, generally, this file generally won't be checked in to source control. The second is called `userLocalConfig`. The recommendation is to set the value of this to `isDevMode()` from `@angular/core`, but you could set the value of this to true or false based on any other condition you would like.

The values in the local config file will overwrite all previous values on other config objects that have been loaded. This way you can have a general app config file that everyone uses, but you can overwrite it on your machine without worrying about checking it in and messing up other people's applications.

> Note: If you provide a file URL and tell the service to load that config, it will load it. If the file doesn't exist, it will produce a 404. That's why it's recommended that the `useLocalConfig` value is set to `isDevMode()`, so that you don't have a 404 show up in production when it shouldn't.

```ts
imports: [
  ...,
  {
    provide: RUNTIME_CONFIG_LOADER_CONFIG,
    useValue: {
      configUrl: './path/to/config/config.json',
      localConfigUrl: './path/to/config/local.config.json',
      useLocalConfig: isDevMode()
    }
  ),
  ...]
```
