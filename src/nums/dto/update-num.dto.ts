import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateNumDto } from './create-num.dto';

export class UpdateNumDto extends PartialType(CreateNumDto) {
  @IsOptional()
  @IsBoolean()
  inUse?: boolean;
}
