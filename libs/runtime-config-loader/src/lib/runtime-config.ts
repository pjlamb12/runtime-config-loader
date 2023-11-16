import { InjectionToken } from '@angular/core';

export class RuntimeConfig {
	configUrl: string | string[];

	constructor(obj: any = {}) {
		this.configUrl = obj.configUrl || './assets/config.json';
	}
}

export const RUNTIME_CONFIG_LOADER_CONFIG = new InjectionToken<RuntimeConfig>(
	'RUNTIME_CONFIG_LOADER_CONFIG',
	{
		providedIn: 'root',
		factory: () => ({ configUrl: './assets/config.json' }),
	}
);
