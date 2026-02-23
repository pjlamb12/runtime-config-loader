import { TestBed } from '@angular/core/testing';
import { InjectionToken } from '@angular/core';
import { provideConfigToken } from './runtime-config-loader.provider';
import { RuntimeConfigLoaderService } from './runtime-config-loader/runtime-config-loader.service';

const API_URL = new InjectionToken<string>('API_URL');
const NESTED_KEY = new InjectionToken<string>('NESTED_KEY');
const NON_EXISTENT = new InjectionToken<string>('NON_EXISTENT');

describe('provideConfigToken', () => {
	let mockService: Partial<RuntimeConfigLoaderService<any>>;

	beforeEach(() => {
		mockService = {
			getConfigObjectKey: jest.fn((key: string) => {
				if (key === 'apiUrl') return 'https://api.test.com';
				if (key === 'nested.key') return 'test-value';
				return null;
			}),
		};

		TestBed.configureTestingModule({
			providers: [
				{ provide: RuntimeConfigLoaderService, useValue: mockService },
				provideConfigToken(API_URL, 'apiUrl'),
				provideConfigToken(NESTED_KEY, 'nested.key'),
				provideConfigToken(NON_EXISTENT, 'ghost'),
			],
		});
	});

	it('should inject specific config keys using tokens', () => {
		const apiUrl = TestBed.inject(API_URL);
		const nestedKey = TestBed.inject(NESTED_KEY);

		expect(apiUrl).toBe('https://api.test.com');
		expect(nestedKey).toBe('test-value');
		expect(mockService.getConfigObjectKey).toHaveBeenCalledWith('apiUrl');
		expect(mockService.getConfigObjectKey).toHaveBeenCalledWith(
			'nested.key'
		);
	});

	it('should return null for non-existent keys', () => {
		const val = TestBed.inject(NON_EXISTENT);
		expect(val).toBeNull();
		expect(mockService.getConfigObjectKey).toHaveBeenCalledWith('ghost');
	});
});
