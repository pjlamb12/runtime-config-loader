import { HttpClient } from '@angular/common/http';
import { waitForAsync } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { RuntimeConfig } from '../runtime-config';
import { RuntimeConfigLoaderService } from './runtime-config-loader.service';
describe('RuntimeConfigLoaderService', () => {
	let service: RuntimeConfigLoaderService;
	const mockSingleConfig: RuntimeConfig = {
		configUrl: './test-config.json',
	};
	const mockDoubleConfig: RuntimeConfig = {
		configUrl: ['./test-config.json', './test-config2.json'],
	};
	const mockConfigData1 = {
		apiUrl: 'https://test-api.com',
		nestedObject: {
			nested: 'value',
		},
	};
	const mockConfigData2 = {
		apiUrl: 'https://test-2-api.com',
		appName: 'App Name 2',
		nestedObject: {
			nested: 'value 2',
		},
	};
	let mockHttpService: any;
	describe('Single Config URL', () => {
		beforeEach(() => {
			mockHttpService = { get: null } as any as HttpClient;
			service = new RuntimeConfigLoaderService(
				mockHttpService,
				mockSingleConfig
			);
		});
		it('should be created', () => {
			expect(service).toBeTruthy();
		});
		it('should load the config object', waitForAsync(() => {
			mockHttpService.get = jest
				.fn()
				.mockReturnValue(of(mockConfigData1));
			service.loadConfig().subscribe();
			const config = service.getConfig();
			expect(config).toStrictEqual(mockConfigData1);
		}));
		it('should return the key from the config object', waitForAsync(() => {
			mockHttpService.get = jest
				.fn()
				.mockReturnValue(of(mockConfigData1));
			service.loadConfig().subscribe();
			const configKey = service.getConfigObjectKey('apiUrl');
			expect(configKey).toStrictEqual(mockConfigData1.apiUrl);
		}));
		it('should handle a load error', waitForAsync(() => {
			mockHttpService.get = jest
				.fn()
				.mockReturnValue(throwError('Test Error'));
			service.loadConfig().subscribe();
			const config = service.getConfig();
			expect(config).toStrictEqual(null);
		}));
	});
	describe('Double Config URL', () => {
		beforeEach(() => {
			mockHttpService = { get: null } as any as HttpClient;
			service = new RuntimeConfigLoaderService(
				mockHttpService,
				mockDoubleConfig
			);
		});
		it('should be created', () => {
			expect(service).toBeTruthy();
		});
		it('should load the config object from both sources', waitForAsync(() => {
			mockHttpService.get = jest
				.fn()
				.mockReturnValueOnce(of(mockConfigData1))
				.mockReturnValueOnce(of(mockConfigData2));
			service.loadConfig().subscribe();
			const config = service.getConfig();
			expect(config).toStrictEqual(mockConfigData2);
		}));
		it('should return the key from the config object after combining both sources', waitForAsync(() => {
			mockHttpService.get = jest
				.fn()
				.mockReturnValueOnce(of(mockConfigData1))
				.mockReturnValueOnce(of(mockConfigData2));
			service.loadConfig().subscribe();
			const configKey = service.getConfigObjectKey('apiUrl');
			expect(configKey).toStrictEqual(mockConfigData2.apiUrl);
		}));
		it('should handle a load error when the first file fails', waitForAsync(() => {
			mockHttpService.get = jest
				.fn()
				.mockReturnValueOnce(throwError('Test Error'))
				.mockReturnValueOnce(of(mockConfigData2));
			service.loadConfig().subscribe();
			const config = service.getConfig();
			expect(config).toStrictEqual(null);
		}));
		it('should handle a load error when the second file fails', waitForAsync(() => {
			mockHttpService.get = jest
				.fn()
				.mockReturnValueOnce(of(mockConfigData1))
				.mockReturnValueOnce(throwError('Test Error'));
			service.loadConfig().subscribe();
			const config = service.getConfig();
			expect(config).toStrictEqual(null);
		}));
	});
});
