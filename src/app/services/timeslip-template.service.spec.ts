import { TestBed, inject } from '@angular/core/testing';

import { TimeslipTemplateService } from './timeslip-template.service';

describe('TimeslipTemplateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TimeslipTemplateService]
    });
  });

  it('should be created', inject([TimeslipTemplateService], (service: TimeslipTemplateService) => {
    expect(service).toBeTruthy();
  }));
});
