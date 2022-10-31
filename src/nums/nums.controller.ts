import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { NumsService } from './nums.service';
import { CreateNumDto } from './dto/create-num.dto';
import { UpdateNumDto } from './dto/update-num.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id/parse-mongo-id.pipe';

@Controller('nums')
export class NumsController {
  constructor(private readonly numsService: NumsService) {}

  @Post()
  create(@Body() createNumDto: CreateNumDto) {
    return this.numsService.create(createNumDto);
  }

  @Get()
  findAll() {
    return this.numsService.findAll();
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.numsService.findOne(term);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNumDto: UpdateNumDto) {
    return this.numsService.update(id, updateNumDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.numsService.remove(id);
  }
}
