import { Observable } from 'rxjs';

export class RuntimeConfig<T = any> {
	configUrl: string | string[];
	validator?: (
		config: T
	) => boolean | Promise<boolean> | Observable<boolean> | void;

	constructor(
		obj: {
			configUrl?: string | string[];
			validator?: (
				config: T
			) => boolean | Promise<boolean> | Observable<boolean> | void;
		} = {}
	) {
		this.configUrl = obj.configUrl || './assets/config.json';
		this.validator = obj.validator;
	}
}
