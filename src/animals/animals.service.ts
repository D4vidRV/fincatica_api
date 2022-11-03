import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, model, Model } from 'mongoose';
import { Color } from 'src/colors/entities/color.entity';
import { Num } from 'src/nums/entities/num.entity';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { Animal } from './entities/animal.entity';
// import moment from 'moment';
import * as moment from 'moment';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class AnimalsService {
  constructor(
    @InjectModel(Animal.name)
    private readonly animalModel: Model<Animal>,
    @InjectModel(Num.name)
    private readonly numModel: Model<Num>,
    @InjectModel(Color.name)
    private readonly colorModel: Model<Color>,
  ) {}

  async create(createAnimalDto: CreateAnimalDto) {
    console.log(`${createAnimalDto.color}`);
    console.log(`${createAnimalDto.internal_number}`);

    // Recibir el numero por mongoId o por numero

    // if number is a number
    let number: Num;

    number = await this.numModel.findOne({
      num: createAnimalDto.internal_number,
    });

    // If number is a valid MongoId
    if (!number && isValidObjectId(createAnimalDto.internal_number)) {
      number = await this.numModel.findById(createAnimalDto.internal_number);
    }

    if (!number)
      throw new NotFoundException(
        `The number whit id ${createAnimalDto.internal_number} not exits in db`,
      );

    // Recibir el color por nombre o por MongoId
    let color: Color;

    // if color is a color name
    color = await this.colorModel.findOne({
      name: createAnimalDto.color.toLowerCase(),
    });

    // if color is a mongoId
    if (!color && isValidObjectId(createAnimalDto.color)) {
      color = await this.colorModel.findById(createAnimalDto.color);
    }

    if (!color)
      throw new NotFoundException(
        `The color whit id ${createAnimalDto.color} not exits in db`,
      );

    // Create unique number whith internal number + date
    const date = moment(createAnimalDto.entry_date).format('DD-MM-YYYY');

    const unique_number = `N${number.num}F${date}`;

    try {
      createAnimalDto.internal_number = number.num;
      createAnimalDto.color = color.name;

      const animal = await this.animalModel.create({
        ...createAnimalDto,
        unique_number,
      });
      return animal;
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(
          `Animal with unique number ${unique_number} already exist in db`,
        );
      }
      console.log(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, offset } = paginationDto;
    const animals = await this.animalModel
      .find({ status: true })
      .populate('internal_number', 'num')
      .limit(limit)
      .skip(offset)
      .sort({
        entry_date: 1,
      });
    return { animals };
  }

  async findOne(term: string) {
    let animal;

    if (!isNaN(+term)) {
      animal = await this.animalModel.findOne({ internal_number: term });
    }

    // If term is a valid MongoId
    if (!animal && isValidObjectId(term)) {
      animal = await this.animalModel.findById(term);
    }

    if (!animal) {
      throw new NotFoundException(`The aniaml with term ${term} not found`);
    }

    return animal;
  }

  async update(id: string, updateAnimalDto: UpdateAnimalDto) {
    let animal;
    if (isValidObjectId(id)) {
      animal = this.animalModel.findByIdAndUpdate(id, updateAnimalDto, {
        new: true,
      });
    }

    if (!animal) {
      throw new NotFoundException(`The animal with id ${id} not found`);
    }

    return animal;
  }

  async remove(id: string) {
    const { matchedCount, modifiedCount } = await this.animalModel.updateOne(
      { _id: id },
      { status: false },
    );

    if (matchedCount === 0) {
      throw new BadRequestException(`The number with id: ${id} not found`);
    }

    return;
  }
}
