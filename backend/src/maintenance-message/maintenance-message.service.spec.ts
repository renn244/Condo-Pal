import { Test, TestingModule } from '@nestjs/testing';
import { MaintenanceMessageService } from './maintenance-message.service';

describe('MaintenanceMessageService', () => {
  let service: MaintenanceMessageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MaintenanceMessageService],
    }).compile();

    service = module.get<MaintenanceMessageService>(MaintenanceMessageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
