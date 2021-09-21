import { HttpClient } from '@angular/common/http';
import { waitForAsync } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { RuntimeConfig } from '../runtime-config';
import { RuntimeConfigLoaderService } from './runtime-config-loader.service';

describe('RuntimeConfigLoaderService', () => {
	let service: RuntimeConfigLoaderService;
	let mockConfig: RuntimeConfig = {
		configUrl: './test-config.json',
	};
	let mockConfigData = {
		apiUrl: 'https://test-api.com',
	};
	let mockHttpService: any;

	beforeEach(() => {
		mockHttpService = { get: null } as any as HttpClient;
		service = new RuntimeConfigLoaderService(mockHttpService, mockConfig);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it(
		'should load the config object',
		waitForAsync(() => {
			mockHttpService.get = jest.fn().mockReturnValue(of(mockConfigData));
			service.loadConfig().subscribe();

			const config = service.getConfig();
			expect(config).toStrictEqual(mockConfigData);
		})
	);

	it(
		'should return the key from the config object',
		waitForAsync(() => {
			mockHttpService.get = jest.fn().mockReturnValue(of(mockConfigData));
			service.loadConfig().subscribe();

			const configKey = service.getConfigObjectKey('apiUrl');
			expect(configKey).toStrictEqual(mockConfigData.apiUrl);
		})
	);

	it(
		'should handle a load error',
		waitForAsync(() => {
			mockHttpService.get = jest
				.fn()
				.mockReturnValue(throwError('Test Error'));
			service.loadConfig().subscribe();

			const config = service.getConfig();
			expect(config).toStrictEqual(null);
		})
	);
});
