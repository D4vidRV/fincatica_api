import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { Color } from './entities/color.entity';

@Injectable()
export class ColorsService {
  constructor(
    @InjectModel(Color.name)
    private readonly colorModel: Model<Color>,
  ) {}

  async create(createColorDto: CreateColorDto) {
    try {
      createColorDto.name = createColorDto.name.toLowerCase();
      const color = await this.colorModel.create(createColorDto);

      return color;
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(
          `The color ${createColorDto.name} already exist in database`,
        );
      }
      console.log(error);

      throw new InternalServerErrorException(`Can't create a color`);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, offset } = paginationDto;

    const colors = await this.colorModel
      .find({ status: true })
      .limit(limit)
      .skip(offset)
      .select('-__v');
    return { colors };
  }

  findOne(id: number) {
    return `This action returns a #${id} color`;
  }

  update(id: number, updateColorDto: UpdateColorDto) {
    return `This action updates a #${id} color`;
  }

  remove(id: number) {
    return `This action removes a #${id} color`;
  }
}
