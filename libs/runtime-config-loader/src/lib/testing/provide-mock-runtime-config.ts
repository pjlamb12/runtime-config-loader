import {
	EnvironmentProviders,
	Provider,
	makeEnvironmentProviders,
} from '@angular/core';
import { RUNTIME_CONFIG } from '../runtime-config-loader.provider';
import { RuntimeConfigLoaderService } from '../runtime-config-loader/runtime-config-loader.service';
import { MockRuntimeConfigLoaderService } from './mock-runtime-config-loader.service';

export function provideMockRuntimeConfig<T = any>(
	mockConfig: T
): EnvironmentProviders {
	const mockService = new MockRuntimeConfigLoaderService<T>();
	mockService.setMockConfig(mockConfig);

	const providers: Provider[] = [
		{
			provide: RuntimeConfigLoaderService,
			useValue: mockService,
		},
		{
			provide: MockRuntimeConfigLoaderService,
			useValue: mockService,
		},
		{
			provide: RUNTIME_CONFIG,
			useValue: mockConfig,
		},
	];

	return makeEnvironmentProviders(providers);
}
