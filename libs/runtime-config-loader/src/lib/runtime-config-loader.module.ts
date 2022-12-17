import { HttpClientModule } from '@angular/common/http';
import {
	APP_INITIALIZER,
	InjectionToken,
	ModuleWithProviders,
	NgModule,
} from '@angular/core';
import { RuntimeConfig } from './runtime-config';
import { RuntimeConfigLoaderService } from './runtime-config-loader/runtime-config-loader.service';

export function initConfig(configSvc: RuntimeConfigLoaderService) {
	return () => configSvc.loadConfig();
}

export const RUNTIME_APP_CONFIG = new InjectionToken<string>('App Config');

@NgModule({
	imports: [HttpClientModule],
	providers: [
		RuntimeConfigLoaderService,
		{
			provide: APP_INITIALIZER,
			useFactory: initConfig,
			deps: [RuntimeConfigLoaderService],
			multi: true,
		},
		{
			provide: RUNTIME_APP_CONFIG,
			useFactory: (config: RuntimeConfigLoaderService) => {
				return config.runtimeConfigObject;
			},
			deps: [RuntimeConfigLoaderService],
		},
	],
})
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
