import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { RuntimeConfig } from './runtime-config';
import { RuntimeConfigLoaderService } from './runtime-config-loader/runtime-config-loader.service';

export function initConfig(configSvc: RuntimeConfigLoaderService) {
	return () => configSvc.loadConfig();
}

@NgModule({ imports: [], providers: [
        RuntimeConfigLoaderService,
        {
            provide: APP_INITIALIZER,
            useFactory: initConfig,
            deps: [RuntimeConfigLoaderService],
            multi: true,
        },
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
