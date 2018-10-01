import { TestBed, inject } from '@angular/core/testing';

import { RuntimeConfigLoaderService } from './runtime-config-loader-lib.service';

describe('RuntimeConfigLoaderLibService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [RuntimeConfigLoaderService],
		});
	});

	it('should be created', inject([RuntimeConfigLoaderService], (service: RuntimeConfigLoaderService) => {
		expect(service).toBeTruthy();
	}));
});
