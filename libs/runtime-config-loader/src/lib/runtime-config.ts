export class RuntimeConfig {
	configUrl: string | string[];

	constructor(obj: any = {}) {
		this.configUrl = obj.configUrl || './assets/config.json';
	}
}
