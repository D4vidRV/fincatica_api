import { Test, TestingModule } from '@nestjs/testing';
import { NumsService } from './nums.service';

describe('NumsService', () => {
  let service: NumsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NumsService],
    }).compile();

    service = module.get<NumsService>(NumsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
