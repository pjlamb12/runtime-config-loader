import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RuntimeConfigLoaderModule } from 'runtime-config-loader';

import { AppComponent } from './app.component';

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		RuntimeConfigLoaderModule.forRoot({
			configUrl: './assets/config/config.json',
		}),
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
