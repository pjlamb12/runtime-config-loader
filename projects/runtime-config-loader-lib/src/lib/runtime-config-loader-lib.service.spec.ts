import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';

import { RuntimeConfigLoaderService } from './runtime-config-loader-lib.service';
import { RuntimeConfig } from './runtime-config';
import { of, throwError } from 'rxjs';

describe('RuntimeConfigLoaderLibService', () => {
	let runtimeConfigService: RuntimeConfigLoaderService;
	let mockConfig: RuntimeConfig = {
		configUrl: './test-config.json',
	};
	let mockConfigData = {
		apiUrl: 'https://test-api.com',
	};
	let mockHttpService;

	beforeEach(() => {
		mockHttpService = jasmine.createSpyObj(['get']);

		runtimeConfigService = new RuntimeConfigLoaderService(mockHttpService, mockConfig);
		console.log('runtimeConfigService: ', runtimeConfigService);
	});

	it('should be created', () => {
		expect(runtimeConfigService).toBeTruthy();
	});

	it('should load the config object', fakeAsync(() => {
		mockHttpService.get.and.returnValue(of(mockConfigData));
		runtimeConfigService.loadConfig();

		tick();
		const config = runtimeConfigService.getConfig();

		expect(Object.keys(config).length).toBe(Object.keys(mockConfigData).length);
	}));

	it('should handle an error', fakeAsync(() => {
		mockHttpService.get.and.returnValue(throwError('Testing'));
		runtimeConfigService.loadConfig();

		tick();
		const config = runtimeConfigService.getConfig();

		expect(config).toBe(null);
	}));

	it('should return a config object key value', fakeAsync(() => {
		mockHttpService.get.and.returnValue(of(mockConfigData));
		runtimeConfigService.loadConfig();

		tick();
		const apiUrl = runtimeConfigService.getConfigObjectKey('apiUrl');

		expect(apiUrl).toBe(mockConfigData.apiUrl);
	}));
});
