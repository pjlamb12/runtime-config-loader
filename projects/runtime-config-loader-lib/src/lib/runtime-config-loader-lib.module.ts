import { NgModule, ModuleWithProviders, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RuntimeConfigLoaderService } from './runtime-config-loader-lib.service';
import { RuntimeConfig } from './runtime-config';

export function initConfig(configSvc: RuntimeConfigLoaderService) {
	return () => configSvc.loadConfig();
}

// @dynamic
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
	],
})
export class RuntimeConfigLoaderModule {
	static forRoot(config: RuntimeConfig): ModuleWithProviders {
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
