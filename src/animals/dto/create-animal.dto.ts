import { IsDate, IsInt, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateAnimalDto {
  @IsInt()
  internal_number: number;
  @IsString()
  gender: string;
  @IsString()
  color: string;
  @IsDate()
  entry_date: Date;
  @IsNumber()
  @IsPositive()
  entry_weight: number;
  @IsNumber()
  @IsPositive()
  entry_price: number;
}
