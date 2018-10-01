import { Injectable, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RuntimeConfig } from './runtime-config';
import { Subject } from 'rxjs';

@Injectable()
export class RuntimeConfigLoaderService {
	private fileUrl: string = './assets/config.json';
	private configObject;
	public configSubject: Subject<any> = new Subject<any>();

	constructor(private _http: HttpClient, @Optional() config: RuntimeConfig) {
		if (config) {
			this.fileUrl = config.fileUrl;
		}
	}

	loadConfig(): Promise<any> {
		return this._http
			.get(this.fileUrl)
			.toPromise()
			.then((configData: any) => {
				this.configObject = configData;
				this.configSubject.next(this.configObject);
			})
			.catch((err: any) => {
				this.configObject = null;
				this.configSubject.next(this.configObject);
			});
	}

	getConfig() {
		return this.configObject;
	}

	getConfigObjectKey(key: string) {
		return this.configObject ? this.configObject[key] : null;
	}
}
