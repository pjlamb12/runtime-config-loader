import { TestBed } from '@angular/core/testing';

import { RuntimeConfigLoaderLibService } from './runtime-config-loader-lib.service';

describe('RuntimeConfigLoaderLibService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RuntimeConfigLoaderLibService = TestBed.get(RuntimeConfigLoaderLibService);
    expect(service).toBeTruthy();
  });
});
