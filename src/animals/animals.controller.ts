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
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { AnimalsService } from './animals.service';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { consumptionData } from './entities/consumption.entity';
import { weightData } from './entities/weight.entity';

@Controller('animals')
export class AnimalsController {
  constructor(private readonly animalsService: AnimalsService) {}

  @Post('/animal')
  @UseGuards(AuthGuard())
  create(@Body() createAnimalDto: CreateAnimalDto) {
    return this.animalsService.create(createAnimalDto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard())
  update(@Param('id') id: string, @Body() updateAnimalDto: UpdateAnimalDto) {
    return this.animalsService.update(id, updateAnimalDto);
  }

  @Get()
  @UseGuards(AuthGuard())
  findAll(@Query() paginationDto: PaginationDto) {
    return this.animalsService.findAll(paginationDto);
  }

  @Get('/current')
  @UseGuards(AuthGuard())
  findCurrentsAnimals(@Query() paginationDto: PaginationDto) {
    return this.animalsService.findCurrentsAnimals(paginationDto);
  }

  @Get('/filter')
  @UseGuards(AuthGuard())
  findByYearMonthAndNumber(
    @Optional() @Query('year') year?: number,
    @Optional() @Query('month') month?: number,
    @Optional() @Query('num') num?: number,
  ) {
    return this.animalsService.findByYearMonthAndNumber(year, month, num);
  }

  @Get('/totalAnimals')
  findTotalAnimals() {
    return this.animalsService.findTotalAnimals();
  }
  @Get('/totalMale')
  findTotalMale() {
    return this.animalsService.findTotalMale();
  }

  @Get('/totalFemale')
  findTotalAFemale() {
    return this.animalsService.findTotalAFemale();
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.animalsService.findOne(term);
  }

  @Post(':id/weight-history')
  @UseGuards(AuthGuard())
  async addWeightHistory(
    @Param('id') id: string,
    @Body() weightData: weightData,
  ) {
    return this.animalsService.addWeightHistory(id, weightData);
  }

  @Post(':id/consumption-history')
  @UseGuards(AuthGuard())
  async addConsumptiontHistory(
    @Param('id') id: string,
    @Body() weightData: consumptionData,
  ) {
    return this.animalsService.addConsumptiontHistory(id, weightData);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  remove(@Param('id') id: string) {
    return this.animalsService.remove(id);
  }
}
