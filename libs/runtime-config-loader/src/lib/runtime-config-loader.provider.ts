import {
	EnvironmentProviders,
	Provider,
	inject,
	makeEnvironmentProviders,
	provideAppInitializer,
} from '@angular/core';
import {
	provideHttpClient,
	withInterceptorsFromDi,
} from '@angular/common/http';
import { RuntimeConfig } from './runtime-config';
import { RuntimeConfigLoaderService } from './runtime-config-loader/runtime-config-loader.service';

export function initConfig(configSvc: RuntimeConfigLoaderService) {
	return () => configSvc.loadConfig();
}

export function provideRuntimeConfig(
	config: RuntimeConfig
): EnvironmentProviders {
	const providers: (Provider | EnvironmentProviders)[] = [
		{
			provide: RuntimeConfig,
			useValue: config,
		},
		RuntimeConfigLoaderService,
		provideAppInitializer(() => {
			const initializerFn = initConfig(
				inject(RuntimeConfigLoaderService)
			);
			return initializerFn();
		}),
		provideHttpClient(withInterceptorsFromDi()),
	];

	return makeEnvironmentProviders(providers);
}
