import { HttpClient } from '@angular/common/http';
import { Injectable, Optional } from '@angular/core';
import { RuntimeConfig } from 'runtime-config-loader';
import { Observable, of, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class RuntimeConfigLoaderService {
	private configUrl: string = './assets/config.json';
	private configObject: any = null;
	public configSubject: Subject<any> = new Subject<any>();

	constructor(private _http: HttpClient, @Optional() config: RuntimeConfig) {
		if (config) {
			this.configUrl = config.configUrl;
		}
	}

	loadConfig(): Observable<any> {
		return this._http.get(this.configUrl).pipe(
			tap((configData: any) => {
				this.configObject = configData;
				this.configSubject.next(this.configObject);
			}),
			catchError((err: any) => {
				this.configObject = null;
				this.configSubject.next(this.configObject);
				return of(null);
			})
		);
	}

	getConfig() {
		return this.configObject;
	}

	getConfigObjectKey(key: string) {
		return this.configObject ? this.configObject[key] : null;
	}
}
