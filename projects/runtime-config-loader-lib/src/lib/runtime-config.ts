export class RuntimeConfig {
	fileUrl: string;

	constructor(obj: any = {}) {
		this.fileUrl = obj.fileUrl || './assets/config.json';
	}
}
