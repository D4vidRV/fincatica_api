import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Optional,
} from '@nestjs/common';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { AnimalsService } from './animals.service';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';

@Controller('animals')
export class AnimalsController {
  constructor(private readonly animalsService: AnimalsService) {}

  @Post()
  create(@Body() createAnimalDto: CreateAnimalDto) {
    return this.animalsService.create(createAnimalDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.animalsService.findAll(paginationDto);
  }

  @Get('/current')
  findCurrentsAnimals(@Query() paginationDto: PaginationDto) {
    return this.animalsService.findCurrentsAnimals(paginationDto);
  }

  @Get('/findyear/:year')
  findByYearMonthAndNumber(
    @Param('year') year: number,
    @Optional() @Query('month') month?: number,
    @Optional() @Query('num') num?: number,
  ) {
    return this.animalsService.findByYearMonthAndNumber(year, month, num);
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.animalsService.findOne(term);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAnimalDto: UpdateAnimalDto) {
    return this.animalsService.update(id, updateAnimalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.animalsService.remove(id);
  }
}
