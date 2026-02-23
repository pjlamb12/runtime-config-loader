import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { RuntimeConfig } from '../runtime-config';
import { forkJoin, Observable, of, ReplaySubject, Subject } from 'rxjs';
import { catchError, take, tap } from 'rxjs/operators';

@Injectable()
export class RuntimeConfigLoaderService<T = any> {
	private configUrl: string | string[] = './assets/config.json';
	private configObject: T | null = null;
	public configSubject: Subject<T | null> = new ReplaySubject<T | null>(1);

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

	getConfigObjectKey<K extends keyof T>(key: K): T[K] | null;
	getConfigObjectKey<R = any>(key: string): R | null;
	getConfigObjectKey(key: any): any {
		if (!this.configObject) {
			return null;
		}

		if (typeof key === 'string' && key.indexOf('.') > -1) {
			return this.getValueByPath(this.configObject, key);
		}

		return (this.configObject as any)[key] ?? null;
	}

	private getValueByPath(obj: any, path: string): any {
		const value = path.split('.').reduce((prev, curr) => {
			return prev ? prev[curr] : null;
		}, obj);
		return value ?? null;
	}
}
