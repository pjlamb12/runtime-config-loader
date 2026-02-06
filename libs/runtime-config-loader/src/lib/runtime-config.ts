export class RuntimeConfig {
	configUrl: string | string[];

	constructor(obj: { configUrl?: string | string[] } = {}) {
		this.configUrl = obj.configUrl || './assets/config.json';
	}
}
