import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { initConfig, RuntimeConfigLoaderModule, RuntimeConfigLoaderService } from 'runtime-config-loader-lib';

import { AppComponent } from './app.component';

@NgModule({
	declarations: [AppComponent],
	imports: [BrowserModule, RuntimeConfigLoaderModule],
	providers: [
		{
			provide: APP_INITIALIZER,
			useFactory: initConfig,
			deps: [RuntimeConfigLoaderService],
			multi: true,
		},
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
