import { Module } from '@nestjs/common';
import { NumsService } from './nums.service';
import { NumsController } from './nums.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Num, NumSchema } from './entities/num.entity';

@Module({
  controllers: [NumsController],
  providers: [NumsService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Num.name,
        schema: NumSchema,
      },
    ]),
  ],
  exports: [MongooseModule],
})
export class NumsModule {}
