import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { RuntimeConfigLoaderModule } from 'runtime-config-loader-lib';

import { AppComponent } from './app.component';

@NgModule({
	declarations: [AppComponent],
	imports: [BrowserModule, RuntimeConfigLoaderModule.forRoot({ configUrl: './assets/config.json' })],
	bootstrap: [AppComponent],
})
export class AppModule {}
