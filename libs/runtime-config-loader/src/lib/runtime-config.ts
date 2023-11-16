import { InjectionToken, isDevMode } from '@angular/core';

export class RuntimeConfig {
	configUrl: string | string[];
	localConfigUrl?: string;
	useLocalConfig? = isDevMode();

	constructor(obj: any = {}) {
		this.configUrl = obj.configUrl || './assets/config.json';
		this.localConfigUrl = obj.localConfigUrl || '';
		this.useLocalConfig = obj.useLocalConfig || isDevMode();
	}
}

export const RUNTIME_CONFIG_LOADER_CONFIG = new InjectionToken<RuntimeConfig>(
	'RUNTIME_CONFIG_LOADER_CONFIG',
	{
		providedIn: 'root',
		factory: () => ({
			configUrl: './assets/config.json',
			localConfigUrl: '',
			useLocalConfig: isDevMode(),
		}),
	}
);
