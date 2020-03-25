import { TestBed } from '@angular/core/testing';

import { SnippetLoaderService } from './snippet-loader.service';

describe('SnippetLoaderService', () => {
  let service: SnippetLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SnippetLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
