import { Test, TestingModule } from '@nestjs/testing';
import { PayoutMethodService } from './payout-method.service';

describe('PayoutMethodService', () => {
  let service: PayoutMethodService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PayoutMethodService],
    }).compile();

    service = module.get<PayoutMethodService>(PayoutMethodService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
