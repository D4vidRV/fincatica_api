import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { NumsService } from './nums.service';
import { CreateNumDto } from './dto/create-num.dto';
import { UpdateNumDto } from './dto/update-num.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id/parse-mongo-id.pipe';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('nums')
export class NumsController {
  constructor(private readonly numsService: NumsService) {}

  @Post()
  create(@Body() createNumDto: CreateNumDto) {
    return this.numsService.create(createNumDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.numsService.findAll(paginationDto);
  }

  @Get('free')
  findfreeNumbers(@Query() paginationDto: PaginationDto) {
    return this.numsService.findfreeNumbers(paginationDto);
  }

  @Get('taken')
  findtakenNumbers(@Query() paginationDto: PaginationDto) {
    return this.numsService.findtakenNumbers(paginationDto);
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
