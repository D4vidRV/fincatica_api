import { Module } from '@nestjs/common';
import { NumsService } from './nums.service';
import { NumsController } from './nums.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Num, NumSchema } from './entities/num.entity';
import { AuthModule } from 'src/auth/auth.module';

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
    AuthModule,
  ],
  exports: [MongooseModule],
})
export class NumsModule {}
