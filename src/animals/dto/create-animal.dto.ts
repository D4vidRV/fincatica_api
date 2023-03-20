import {
  IsBoolean,
  IsDate,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

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
  @IsBoolean()
  @IsOptional()
  status: boolean;
  @IsString()
  @IsOptional()
  image_path: string;

  @IsOptional()
  weight_history: { date: Date; weight: number }[];

  @IsOptional()
  consumption_history: { date: Date; price: number; description: string }[];
}
