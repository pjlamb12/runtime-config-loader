import { enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import {
	provideRuntimeConfig,
	provideConfigToken,
} from 'runtime-config-loader';
import { TEST_VALUE } from './app/app.component';

if (environment.production) {
	enableProdMode();
}

platformBrowserDynamic()
	.bootstrapModule(AppModule, {
		applicationProviders: [
			provideZoneChangeDetection(),
			provideRuntimeConfig({
				configUrl: './assets/config/config.json',
				validator: (config) => !!config && !!config.testValue,
			}),
			provideConfigToken(TEST_VALUE, 'testValue'),
		],
	})
	.catch((err) => console.error(err));
