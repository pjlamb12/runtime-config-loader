import {
	EnvironmentProviders,
	InjectionToken,
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

export const RUNTIME_CONFIG = new InjectionToken<any>('RUNTIME_CONFIG');

export function initConfig(configSvc: RuntimeConfigLoaderService) {
	return () => configSvc.loadConfig();
}

export function provideRuntimeConfig<T = any>(
	config: RuntimeConfig<T>
): EnvironmentProviders {
	const providers: (Provider | EnvironmentProviders)[] = [
		{
			provide: RuntimeConfig,
			useValue: config,
		},
		RuntimeConfigLoaderService,
		{
			provide: RUNTIME_CONFIG,
			useFactory: (configSvc: RuntimeConfigLoaderService<T>) =>
				configSvc.getConfig(),
			deps: [RuntimeConfigLoaderService],
		},
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
