import { Test, TestingModule } from '@nestjs/testing';
import { MaintenanceWorkerTokenService } from './maintenance-worker-token.service';

describe('MaintenanceWorkerTokenService', () => {
  let service: MaintenanceWorkerTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MaintenanceWorkerTokenService],
    }).compile();

    service = module.get<MaintenanceWorkerTokenService>(MaintenanceWorkerTokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
