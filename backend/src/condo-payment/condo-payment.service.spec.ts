import { Test, TestingModule } from '@nestjs/testing';
import { CondoPaymentService } from './condo-payment.service';

describe('CondoPaymentService', () => {
  let service: CondoPaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CondoPaymentService],
    }).compile();

    service = module.get<CondoPaymentService>(CondoPaymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
