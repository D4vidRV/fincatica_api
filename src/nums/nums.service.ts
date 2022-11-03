import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { isValidObjectId, Model } from 'mongoose';
import { Num } from './entities/num.entity';
import { InjectModel } from '@nestjs/mongoose';

import { CreateNumDto } from './dto/create-num.dto';
import { UpdateNumDto } from './dto/update-num.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class NumsService {
  constructor(
    @InjectModel(Num.name)
    private readonly numModel: Model<Num>,
  ) {}

  async create(createNumDto: CreateNumDto) {
    try {
      const number = await this.numModel.create(createNumDto);

      return number;
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(
          `Number already exist in db ${JSON.stringify(error.keyValue)}`,
        );
      }
      console.log(error);

      throw new InternalServerErrorException(`Can't create a number`);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, offset } = paginationDto;

    return await this.numModel
      .find()
      .limit(limit)
      .skip(offset)
      .sort({
        num: 1,
      })
      .select('-__v');
  }

  async findOne(term: string) {
    let number: Num;

    if (!isNaN(+term)) {
      number = await this.numModel.findOne({ num: term });
    }

    // If term is a valid MongoId
    if (!number && isValidObjectId(term)) {
      number = await this.numModel.findById(term);
    }

    if (!number)
      throw new NotFoundException(`The number whit term ${term} not found`);

    return number;
  }

  async update(id: string, updateNumDto: UpdateNumDto) {
    let number: Num;

    if (isValidObjectId(id)) {
      number = await this.numModel.findByIdAndUpdate(id, updateNumDto, {
        new: true,
      });
    }

    if (!number) {
      throw new NotFoundException(`The number whit id: ${id} not found`);
    }

    return number;
  }

  async remove(id: string) {
    const { matchedCount, modifiedCount } = await this.numModel.updateOne(
      { _id: id },
      { status: false },
    );

    if (matchedCount === 0) {
      throw new BadRequestException(`The number with id: ${id} not found`);
    }

    return;
  }
}
