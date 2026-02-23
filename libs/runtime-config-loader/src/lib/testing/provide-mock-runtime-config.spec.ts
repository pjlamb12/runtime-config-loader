import { TestBed } from '@angular/core/testing';
import { provideMockRuntimeConfig } from './provide-mock-runtime-config';
import { RuntimeConfigLoaderService } from '../runtime-config-loader/runtime-config-loader.service';
import { RUNTIME_CONFIG } from '../runtime-config-loader.provider';
import { MockRuntimeConfigLoaderService } from './mock-runtime-config-loader.service';

describe('provideMockRuntimeConfig', () => {
	const MOCK_CONFIG = {
		apiUrl: 'https://mock-api.com',
		settings: {
			theme: 'dark',
		},
	};

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [provideMockRuntimeConfig(MOCK_CONFIG)],
		});
	});

	it('should provide the MockRuntimeConfigLoaderService instead of RuntimeConfigLoaderService', () => {
		const service = TestBed.inject(RuntimeConfigLoaderService);
		expect(service).toBeInstanceOf(MockRuntimeConfigLoaderService);
	});

	it('should provide the RUNTIME_CONFIG token', () => {
		const config = TestBed.inject(RUNTIME_CONFIG);
		expect(config).toEqual(MOCK_CONFIG);
	});

	it('should allow getting config values via the service', () => {
		const service = TestBed.inject(RuntimeConfigLoaderService);
		expect(service.getConfig()).toEqual(MOCK_CONFIG);
		expect(service.getConfigObjectKey('apiUrl')).toEqual(
			'https://mock-api.com'
		);
		expect(service.getConfigObjectKey('settings.theme')).toEqual('dark');
	});

	it('should allow getting the MockRuntimeConfigLoaderService directly to update mock config', () => {
		const mockService = TestBed.inject(MockRuntimeConfigLoaderService);
		const newConfig = { apiUrl: 'https://new-api.com' };
		mockService.setMockConfig(newConfig);
		expect(mockService.getConfig()).toEqual(newConfig);
	});
});
