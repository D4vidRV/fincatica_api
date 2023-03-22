import { Module } from '@nestjs/common';
import { ColorsService } from './colors.service';
import { ColorsController } from './colors.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Color, ColorSchema } from './entities/color.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ColorsController],
  providers: [ColorsService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Color.name,
        schema: ColorSchema,
      },
    ]),
    AuthModule,
  ],
  exports: [MongooseModule],
})
export class ColorsModule {}
