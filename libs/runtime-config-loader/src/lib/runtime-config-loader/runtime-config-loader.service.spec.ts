import { TestBed } from '@angular/core/testing';

import { RuntimeConfigLoaderService } from './runtime-config-loader.service';

describe('RuntimeConfigLoaderService', () => {
  let service: RuntimeConfigLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RuntimeConfigLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
