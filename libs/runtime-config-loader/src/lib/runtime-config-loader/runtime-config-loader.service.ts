import { HttpClient } from '@angular/common/http';
import { Injectable, Optional } from '@angular/core';
import { RuntimeConfig } from '../runtime-config';
import { forkJoin, Observable, of, Subject, zip } from 'rxjs';
import { catchError, take, tap } from 'rxjs/operators';

@Injectable()
export class RuntimeConfigLoaderService {
	private configUrl: string | string[] = './assets/config.json';
	private configObject: any = null;
	public configSubject: Subject<any> = new Subject<any>();

	constructor(private _http: HttpClient, @Optional() config: RuntimeConfig) {
		if (config) {
			this.configUrl = config.configUrl;
		}
	}

	loadConfig(): Observable<any> {
		const urls: string[] = Array.isArray(this.configUrl)
			? this.configUrl
			: [this.configUrl];

		const observables: Observable<any>[] = urls.map((url) =>
			this.makeHttpCall(url)
		);

		return forkJoin(observables).pipe(
			tap((configDataArray: any[]) => {
				this.configObject = configDataArray.reduce(
					(acc, configData) => {
						return { ...acc, ...configData };
					},
					{}
				);

				this.configSubject.next(this.configObject);
			}),
			catchError((err: any) => {
				console.error('Error loading config: ', err);
				this.configObject = null;
				this.configSubject.next(this.configObject);
				return of(null);
			})
		);
	}

	private makeHttpCall(url: string): Observable<any> {
		return this._http.get(url).pipe(take(1));
	}

	getConfig() {
		return this.configObject;
	}

	getConfigObjectKey(key: string) {
		return this.configObject ? this.configObject[key] : null;
	}
}
