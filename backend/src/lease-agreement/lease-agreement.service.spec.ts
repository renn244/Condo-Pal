import { Test, TestingModule } from '@nestjs/testing';
import { LeaseAgreementService } from './lease-agreement.service';

describe('LeaseAgreementService', () => {
  let service: LeaseAgreementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LeaseAgreementService],
    }).compile();

    service = module.get<LeaseAgreementService>(LeaseAgreementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
