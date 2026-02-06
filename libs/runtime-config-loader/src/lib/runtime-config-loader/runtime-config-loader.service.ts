import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { RuntimeConfig } from '../runtime-config';
import { forkJoin, Observable, of, Subject } from 'rxjs';
import { catchError, take, tap } from 'rxjs/operators';

@Injectable()
export class RuntimeConfigLoaderService {
	private configUrl: string | string[] = './assets/config.json';
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private configObject: any = null;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public configSubject: Subject<any> = new Subject<any>();

	private _http = inject(HttpClient);
	private _config = inject(RuntimeConfig, { optional: true });

	constructor() {
		if (this._config) {
			this.configUrl = this._config.configUrl;
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	loadConfig(): Observable<any> {
		const urls: string[] = Array.isArray(this.configUrl)
			? this.configUrl
			: [this.configUrl];

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const observables: Observable<any>[] = urls.map((url) =>
			this.makeHttpCall(url)
		);

		return forkJoin(observables).pipe(
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			tap((configDataArray: any[]) => {
				this.configObject = configDataArray.reduce(
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					(acc, configData) => {
						return { ...acc, ...configData };
					},
					{}
				);

				this.configSubject.next(this.configObject);
			}),
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			catchError((err: any) => {
				console.error('Error loading config: ', err);
				this.configObject = null;
				this.configSubject.next(this.configObject);
				return of(null);
			})
		);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
