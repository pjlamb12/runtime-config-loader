import { Observable } from 'rxjs';
import { HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';

export class RuntimeConfig<T = any> {
	configUrl: string | string[];
	validator?: (
		config: T
	) => boolean | Promise<boolean> | Observable<boolean> | void;
	options?: {
		headers?: HttpHeaders | { [header: string]: string | string[] };
		context?: HttpContext;
		observe?: 'body';
		params?:
			| HttpParams
			| {
					[param: string]:
						| string
						| number
						| boolean
						| ReadonlyArray<string | number | boolean>;
			  };
		reportProgress?: boolean;
		responseType?: 'json';
		withCredentials?: boolean;
	};

	constructor(
		obj: {
			configUrl?: string | string[];
			validator?: (
				config: T
			) => boolean | Promise<boolean> | Observable<boolean> | void;
			options?: {
				headers?: HttpHeaders | { [header: string]: string | string[] };
				context?: HttpContext;
				observe?: 'body';
				params?:
					| HttpParams
					| {
							[param: string]:
								| string
								| number
								| boolean
								| ReadonlyArray<string | number | boolean>;
					  };
				reportProgress?: boolean;
				responseType?: 'json';
				withCredentials?: boolean;
			};
		} = {}
	) {
		this.configUrl = obj.configUrl || './assets/config.json';
		this.validator = obj.validator;
		this.options = obj.options;
	}
}
