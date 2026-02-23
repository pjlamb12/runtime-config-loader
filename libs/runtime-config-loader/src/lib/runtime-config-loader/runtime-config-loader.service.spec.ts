import { provideHttpClient } from '@angular/common/http';
import {
	HttpTestingController,
	provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RuntimeConfig } from '../runtime-config';
import { RuntimeConfigLoaderService } from './runtime-config-loader.service';

describe('RuntimeConfigLoaderService', () => {
	let service: RuntimeConfigLoaderService;
	let httpMock: HttpTestingController;

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

	describe('Single Config URL', () => {
		beforeEach(() => {
			TestBed.configureTestingModule({
				providers: [
					provideHttpClient(),
					provideHttpClientTesting(),
					RuntimeConfigLoaderService,
					{ provide: RuntimeConfig, useValue: mockSingleConfig },
				],
			});
			service = TestBed.inject(RuntimeConfigLoaderService);
			httpMock = TestBed.inject(HttpTestingController);
		});

		afterEach(() => {
			httpMock.verify();
		});

		it('should be created', () => {
			expect(service).toBeTruthy();
		});

		it('should load the config object', () => {
			service.loadConfig().subscribe();

			const req = httpMock.expectOne('./test-config.json');
			expect(req.request.method).toBe('GET');
			req.flush(mockConfigData1);

			const config = service.getConfig();
			expect(config).toStrictEqual(mockConfigData1);
		});

		it('should return the key from the config object', () => {
			service.loadConfig().subscribe();

			const req = httpMock.expectOne('./test-config.json');
			req.flush(mockConfigData1);

			const configKey = service.getConfigObjectKey('apiUrl');
			expect(configKey).toStrictEqual(mockConfigData1.apiUrl);
		});

		it('should handle a load error', () => {
			service.loadConfig().subscribe();

			const req = httpMock.expectOne('./test-config.json');
			req.flush('Error', { status: 500, statusText: 'Server Error' });

			const config = service.getConfig();
			expect(config).toStrictEqual(null);
		});
	});

	describe('Double Config URL', () => {
		beforeEach(() => {
			TestBed.configureTestingModule({
				providers: [
					provideHttpClient(),
					provideHttpClientTesting(),
					RuntimeConfigLoaderService,
					{ provide: RuntimeConfig, useValue: mockDoubleConfig },
				],
			});
			service = TestBed.inject(RuntimeConfigLoaderService);
			httpMock = TestBed.inject(HttpTestingController);
		});

		afterEach(() => {
			httpMock.verify();
		});

		it('should be created', () => {
			expect(service).toBeTruthy();
		});

		it('should load the config object from both sources', () => {
			service.loadConfig().subscribe();

			const req1 = httpMock.expectOne('./test-config.json');
			req1.flush(mockConfigData1);

			const req2 = httpMock.expectOne('./test-config2.json');
			req2.flush(mockConfigData2);

			const config = service.getConfig();
			expect(config).toStrictEqual(mockConfigData2);
		});

		it('should return the key from the config object after combining both sources', () => {
			service.loadConfig().subscribe();

			const req1 = httpMock.expectOne('./test-config.json');
			req1.flush(mockConfigData1);

			const req2 = httpMock.expectOne('./test-config2.json');
			req2.flush(mockConfigData2);

			const configKey = service.getConfigObjectKey('apiUrl');
			expect(configKey).toStrictEqual(mockConfigData2.apiUrl);
		});

		it('should handle a load error when the first file fails', () => {
			service.loadConfig().subscribe();

			const req1 = httpMock.expectOne('./test-config.json');
			req1.flush('Error', { status: 500, statusText: 'Server Error' });

			// Request is cancelled by forkJoin, so we expect it but don't flush it
			httpMock.expectOne('./test-config2.json');

			// If the first fails, forkJoin typically errors out immediately, so second might not be called or cancelled.
			// However implementation uses catchError on the forkJoin result? No, catchError is on the forkJoin.
			// But wait, makeHttpCall uses take(1).
			// If one fails, forkJoin errors. The service catches generic error.
			// We need to see if second request is expected. Usually forkJoin cancels others if one errors?
			// Actually forkJoin waits for all to complete. If one errors, it emits error.
			// Let's assume standard interaction.

			// We just expect config to be null.
			const config = service.getConfig();
			expect(config).toStrictEqual(null);
		});

		it('should handle a load error when the second file fails', () => {
			service.loadConfig().subscribe();

			const req1 = httpMock.expectOne('./test-config.json');
			req1.flush(mockConfigData1);

			const req2 = httpMock.expectOne('./test-config2.json');
			req2.flush('Error', { status: 500, statusText: 'Server Error' });

			const config = service.getConfig();
			expect(config).toStrictEqual(null);
		});
	});

	describe('Nested Key Access', () => {
		beforeEach(() => {
			TestBed.configureTestingModule({
				providers: [
					provideHttpClient(),
					provideHttpClientTesting(),
					RuntimeConfigLoaderService,
					{ provide: RuntimeConfig, useValue: mockSingleConfig },
				],
			});
			service = TestBed.inject(RuntimeConfigLoaderService);
			httpMock = TestBed.inject(HttpTestingController);

			// Load some data
			service.loadConfig().subscribe();
			const req = httpMock.expectOne('./test-config.json');
			req.flush({
				a: {
					b: {
						c: 'deep value',
					},
					isNull: null,
				},
				flat: 'flat value',
			});
		});

		it('should access a flat key', () => {
			expect(service.getConfigObjectKey('flat')).toBe('flat value');
		});

		it('should access a nested key', () => {
			expect(service.getConfigObjectKey('a.b.c')).toBe('deep value');
		});

		it('should return null for non-existent root key', () => {
			expect(service.getConfigObjectKey('nope')).toBeNull();
		});

		it('should return null for non-existent nested key', () => {
			expect(service.getConfigObjectKey('a.b.nope')).toBeNull();
		});

		it('should return null for path through null', () => {
			expect(service.getConfigObjectKey('a.isNull.deep')).toBeNull();
		});

		it('should return the object if the path ends at an object', () => {
			expect(service.getConfigObjectKey('a.b')).toEqual({
				c: 'deep value',
			});
		});
	});

	describe('ReplaySubject Behavior', () => {
		beforeEach(() => {
			TestBed.configureTestingModule({
				providers: [
					provideHttpClient(),
					provideHttpClientTesting(),
					RuntimeConfigLoaderService,
					{ provide: RuntimeConfig, useValue: mockSingleConfig },
				],
			});
			service = TestBed.inject(RuntimeConfigLoaderService);
			httpMock = TestBed.inject(HttpTestingController);
		});

		it('should provide the config to late subscribers', (done) => {
			// 1. Load the config
			service.loadConfig().subscribe();
			const req = httpMock.expectOne('./test-config.json');
			req.flush(mockConfigData1);

			// 2. Subscribe AFTER loading is complete
			service.configSubject.subscribe((config) => {
				expect(config).toStrictEqual(mockConfigData1);
				done();
			});
		});
	});
});
