import { Test, TestingModule } from '@nestjs/testing';
import { NumsController } from './nums.controller';
import { NumsService } from './nums.service';

describe('NumsController', () => {
  let controller: NumsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NumsController],
      providers: [NumsService],
    }).compile();

    controller = module.get<NumsController>(NumsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
