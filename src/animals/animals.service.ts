import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, model, Model } from 'mongoose';
import { Color } from 'src/colors/entities/color.entity';
import { Num } from 'src/nums/entities/num.entity';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { Animal } from './entities/animal.entity';

import * as moment from 'moment';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { weightData } from './entities/weight.entity';
import { consumptionData } from './entities/consumption.entity';

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

    // Recibir el numero por mongoId o por numero

    // if number is a number
    let number: Num;

    number = await this.numModel.findOne({
      num: createAnimalDto.internal_number,
      // TODO: Implement number available validation
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
    const date = moment
      .utc(createAnimalDto.entry_date)
      .format('YYYY-MM-DD-HH-mm-ss');

    const unique_number = `N${number.num}F${date}`;

    try {
      createAnimalDto.internal_number = number.num;
      createAnimalDto.color = color.name;

      const animal = await this.animalModel.create({
        ...createAnimalDto,
        unique_number,
        weight_history: [
          {
            date: createAnimalDto.entry_date,
            weight: createAnimalDto.entry_weight,
          },
        ],
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
        internal_number: 1,
      });
    return { animals };
  }

  async findTotalAnimals() {
    const count = await this.animalModel
      .countDocuments({ departure_date: { $eq: null } })
      .exec();
    return count;
  }

  async findTotalMale() {
    const count = await this.animalModel
      .countDocuments({
        gender: 'M',
        departure_date: null,
      })
      .exec();

    return count;
  }

  async findTotalAFemale() {
    const count = await this.animalModel
      .countDocuments({ gender: 'H', departure_date: null })
      .exec();
    return count;
  }

  async findCurrentsAnimals(paginationDto: PaginationDto) {
    const { limit, offset } = paginationDto;
    const animals = await this.animalModel
      .find({ status: true, departure_date: null })
      .populate('internal_number', 'num')
      .limit(limit)
      .skip(offset)
      .sort({
        internal_number: 1,
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
      throw new NotFoundException(`The animal with term ${term} not found`);
    }

    return animal;
  }

  async findByYearMonthAndNumber(y: number, m?: number, num: number = 0) {

    let animal;

    if (!isNaN(+m) && !isNaN(+num)) {
      // Find by year, month and number
      console.log('Buscando por todo');

      animal = await this.animalModel.aggregate([
        {
          $match: {
            $and: [
              {
                internal_number: num,
              },
            ],
            $expr: {
              $and: [
                {
                  $eq: [
                    { $year: '$entry_date' },
                    { $year: new Date(`${y}-01-01`) },
                  ],
                },
                {
                  $eq: [
                    { $month: '$entry_date' },
                    { $month: new Date(`${y}-${m}-12`) },
                  ],
                },
              ],
            },
          },
        },
      ]);

      if (!animal) {
        throw new NotFoundException(`The aniaml with year ${y} not found`);
      }

      return { animals: animal };
    }

    if (!isNaN(+m) && isNaN(+num)) {
      // Find by year and month
      console.log('Buscando por año y mes');

      animal = await this.animalModel.find({
        $expr: {
          $and: [
            {
              $eq: [
                { $year: '$entry_date' },
                { $year: new Date(`${y}-01-01`) },
              ],
            },
            {
              $eq: [
                { $month: '$entry_date' },
                { $month: new Date(`${y}-${m}-12`) },
              ],
            },
          ],
        },
      });
      if (!animal) {
        throw new NotFoundException(`The aniaml with year ${y} not found`);
      }

      return { animals: animal };
    }
    if (!isNaN(+num) && isNaN(+m)) {
      // Find by year and number
      console.log('Buscando por año y numero');
      animal = await this.animalModel.aggregate([
        {
          $match: {
            $and: [
              {
                internal_number: num,
              },
            ],
            $expr: {
              $and: [
                {
                  $eq: [
                    { $year: '$entry_date' },
                    { $year: new Date(`${y}-01-01`) },
                  ],
                },
              ],
            },
          },
        },
      ]);

      if (!animal) {
        throw new NotFoundException(`The aniaml with year ${y} not found`);
      }

      return { animals: animal };
    }
    // Find by year
    console.log('Buscando por año');

    animal = await this.animalModel.find({
      $expr: {
        $eq: [{ $year: '$entry_date' }, { $year: new Date(`${y}-01-01`) }],
      },
    });

    if (!animal) {
      throw new NotFoundException(`The aniaml with year ${y} not found`);
    }

    return { animals: animal };
  }

  async update(id: string, updateAnimalDto: UpdateAnimalDto) {
    let animal;
    if (isValidObjectId(id)) {
      animal = await this.animalModel.findById(id);
      if (!animal) {
        throw new NotFoundException(`The animal with id ${id} not found`);
      }

      // Si se proporciona el campo departure_weight en el objeto updateAnimalDto
      if (updateAnimalDto.departure_weight) {
        // Creamos un nuevo objeto de historial de peso con el campo departure_date y departure_weight
        const weightHistoryRecord = {
          date: updateAnimalDto.departure_date || new Date(),
          weight: updateAnimalDto.departure_weight,
        };

        // Agregamos el objeto weightHistoryRecord al array weight_history del animal
        animal.weight_history.unshift(weightHistoryRecord);
      }

      // Actualizamos el animal en la base de datos con el objeto updateAnimalDto
      animal.set(updateAnimalDto);
      await animal.save();
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

  async addWeightHistory(animalId: string, weightObj: weightData) {
    const animal = await this.animalModel.findById(animalId).exec();

    if (!animal) {
      throw new Error(`Animal with ID ${animalId} not found`);
    }

    animal.weight_history.unshift(weightObj);
    return animal.save();
  }

  async addConsumptiontHistory(
    animalId: string,
    consumptiontObj: consumptionData,
  ) {
    const animal = await this.animalModel.findById(animalId).exec();

    if (!animal) {
      throw new Error(`Animal with ID ${animalId} not found`);
    }

    animal.consumption_history.unshift(consumptiontObj);
    return animal.save();
  }
}
