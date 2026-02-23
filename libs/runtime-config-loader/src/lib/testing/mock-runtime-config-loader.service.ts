import { Injectable } from '@angular/core';
import { Observable, of, Subject, ReplaySubject } from 'rxjs';
import { RuntimeConfigLoaderService } from '../runtime-config-loader/runtime-config-loader.service';

@Injectable()
export class MockRuntimeConfigLoaderService<T = any>
	implements Partial<RuntimeConfigLoaderService<T>>
{
	private configObject: T | null = null;
	public configSubject: Subject<T | null> = new ReplaySubject<T | null>(1);

	loadConfig(): Observable<T | null> {
		this.configSubject.next(this.configObject);
		return of(this.configObject);
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

	setMockConfig(config: T): void {
		this.configObject = config;
		this.configSubject.next(this.configObject);
	}
}
