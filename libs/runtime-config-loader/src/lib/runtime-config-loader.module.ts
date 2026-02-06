import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ModuleWithProviders, NgModule, inject, provideAppInitializer } from '@angular/core';
import { RuntimeConfig } from './runtime-config';
import { RuntimeConfigLoaderService } from './runtime-config-loader/runtime-config-loader.service';

export function initConfig(configSvc: RuntimeConfigLoaderService) {
	return () => configSvc.loadConfig();
}

@NgModule({ imports: [], providers: [
        RuntimeConfigLoaderService,
        provideAppInitializer(() => {
        const initializerFn = (initConfig)(inject(RuntimeConfigLoaderService));
        return initializerFn();
      }),
        provideHttpClient(withInterceptorsFromDi()),
    ] })
export class RuntimeConfigLoaderModule {
	static forRoot(
		config: RuntimeConfig
	): ModuleWithProviders<RuntimeConfigLoaderModule> {
		return {
			ngModule: RuntimeConfigLoaderModule,
			providers: [
				{
					provide: RuntimeConfig,
					useValue: config,
				},
				RuntimeConfigLoaderService,
			],
		};
	}
}
