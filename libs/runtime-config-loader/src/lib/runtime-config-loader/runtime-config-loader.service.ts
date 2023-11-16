import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, Subject, forkJoin, of } from 'rxjs';
import { catchError, take, tap } from 'rxjs/operators';
import { RUNTIME_CONFIG_LOADER_CONFIG } from '../runtime-config';

@Injectable()
export class RuntimeConfigLoaderService {
	private config = inject(RUNTIME_CONFIG_LOADER_CONFIG);
	private configUrl: string | string[] =
		(this.config && this.config.configUrl) || './assets/config.json';
	private localConfigUrl: string =
		(this.config && this.config.localConfigUrl) || '';
	private configObject: any = null;
	public configSubject: Subject<any> = new Subject<any>();

	constructor(private _http: HttpClient) {
		console.log(this.config);
	}

	loadConfig(): Observable<any> {
		const urls: string[] = Array.isArray(this.configUrl)
			? this.configUrl
			: [this.configUrl];

		const observables: Observable<any>[] = urls.map((url) =>
			this.makeHttpCall(url)
		);

		if (this.localConfigUrl && this.config.useLocalConfig) {
			const localConfig = this.makeHttpCall(this.localConfigUrl).pipe(
				catchError(() => {
					return of({});
				})
			);

			observables.push(localConfig);
		}

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
