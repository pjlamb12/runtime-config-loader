import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
	RUNTIME_CONFIG_LOADER_CONFIG,
	RuntimeConfigLoaderModule,
} from 'runtime-config-loader';

import { AppComponent } from './app.component';

@NgModule({
	declarations: [AppComponent],
	imports: [BrowserModule, RuntimeConfigLoaderModule],
	providers: [
		{
			provide: RUNTIME_CONFIG_LOADER_CONFIG,
			useValue: {
				configUrl: './assets/config/config.json',
				localConfigUrl: './assets/config/local.config.json',
				useLocalConfig: isDevMode(),
			},
		},
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
