import { enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import { provideRuntimeConfig } from 'runtime-config-loader';

if (environment.production) {
	enableProdMode();
}

platformBrowserDynamic()
	.bootstrapModule(AppModule, {
		applicationProviders: [
			provideZoneChangeDetection(),
			provideRuntimeConfig({ configUrl: './assets/config/config.json' }),
		],
	})
	.catch((err) => console.error(err));
