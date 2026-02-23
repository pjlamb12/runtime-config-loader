import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { RuntimeConfig } from '../runtime-config';
import { forkJoin, Observable, of, Subject } from 'rxjs';
import { catchError, take, tap } from 'rxjs/operators';

@Injectable()
export class RuntimeConfigLoaderService<T = any> {
	private configUrl: string | string[] = './assets/config.json';
	private configObject: T | null = null;
	public configSubject: Subject<T | null> = new Subject<T | null>();

	private _http = inject(HttpClient);
	private _config = inject(RuntimeConfig, { optional: true });

	constructor() {
		if (this._config) {
			this.configUrl = this._config.configUrl;
		}
	}

	loadConfig(): Observable<T | null> {
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
					{} as T
				);

				this.configSubject.next(this.configObject);
			}),
			catchError((err: any) => {
				console.error('Error loading config: ', err);
				this.configObject = null;
				this.configSubject.next(this.configObject);
				return of(null);
			})
		) as Observable<T | null>;
	}

	private makeHttpCall(url: string): Observable<any> {
		return this._http.get(url).pipe(take(1));
	}

	getConfig(): T | null {
		return this.configObject;
	}

	getConfigObjectKey<K extends keyof T>(key: K): T[K] | null {
		return this.configObject ? this.configObject[key] : null;
	}
}
