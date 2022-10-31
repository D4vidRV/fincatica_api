import { IsInt, Min } from 'class-validator';

export class CreateNumDto {
  @IsInt()
  @Min(0)
  num: number;
}
