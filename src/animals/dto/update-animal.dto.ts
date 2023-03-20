import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsDate, IsNumber, IsOptional } from 'class-validator';
import { CreateAnimalDto } from './create-animal.dto';

export class UpdateAnimalDto extends PartialType(CreateAnimalDto) {
  @IsDate()
  @IsOptional()
  departure_date: Date;

  @IsNumber()
  @IsOptional()
  departure_weight: number;

  @IsNumber()
  @IsOptional()
  departure_price: number;

  @IsBoolean()
  @IsOptional()
  status: boolean;

}
