import { Module } from '@nestjs/common';
import { AnimalsService } from './animals.service';
import { AnimalsController } from './animals.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Animal, AnimalSchema } from './entities/animal.entity';
import { NumsModule } from 'src/nums/nums.module';
import { ColorsModule } from 'src/colors/colors.module';

@Module({
  controllers: [AnimalsController],
  providers: [AnimalsService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Animal.name,
        schema: AnimalSchema,
      },
    ]),
    NumsModule,
    ColorsModule,
  ],
})
export class AnimalsModule {}
