import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';
import { Auction } from './entities/auction.entity';

@Injectable()
export class AuctionsService {
  constructor(
    @InjectModel(Auction.name)
    private readonly auctionModel: Model<Auction>,
  ) {}

  create(createAuctionDto: CreateAuctionDto) {
    return 'This action adds a new auction';
  }

  async getAllAuctionNames() {
    const auctionNames = await this.auctionModel.find().select('name').exec();

    return { auctionNames };
  }

  async getLastAuctionPricesByName(auctionName: string) {
    const auctionPrices = await this.auctionModel.aggregate([
      { $match: { name: auctionName } },
      {
        $project: {
          prices: {
            $filter: {
              input: '$prices',
              as: 'price',
              cond: { $eq: ['$$price.date', '$last_auction'] },
            },
          },
          _id: 0,
        },
      },
    ]);

    return auctionPrices[0];
  }

  async getYearsByAuction(auctionName: string) {
    const auctionYears = await this.auctionModel.aggregate([
      { $match: { name: auctionName } },
      { $unwind: '$prices' },
      { $group: { _id: { $year: '$prices.date' } } },
      { $group: { _id: null, years: { $addToSet: '$_id' } } },
      { $project: { _id: 0, years: 1 } },
      { $unwind: '$years' },
      { $sort: { years: 1 } },
      { $group: { _id: null, years: { $push: '$years' } } },
      { $project: { _id: 0, years: 1 } },
    ]);

    return auctionYears[0];
  }

  async getMonthsByNameAndYear(auctionName: string, year: number) {
    const result = await this.auctionModel.aggregate([
      { $match: { name: auctionName } },
      { $unwind: '$prices' },
      { $match: { $expr: { $eq: [{ $year: '$prices.date' }, year] } } },
      { $group: { _id: { $month: '$prices.date' } } },
      { $group: { _id: null, months: { $addToSet: '$_id' } } },
      { $project: { _id: 0, months: 1 } },
      { $unwind: '$months' },
      { $sort: { months: 1 } },
      { $group: { _id: null, months: { $push: '$months' } } },
      { $project: { _id: 0, months: 1 } },
    ]);

    return result[0];
  }

  async getAuctionDatesByNameYearMonth(
    name: string,
    year: number,
    month: number,
  ) {
    const auction = await this.auctionModel.findOne({ name }).exec();
    if (!auction) {
      throw new Error(`No se encontró subasta con el nombre ${name}`);
    }

    const filteredPrices = auction.prices.filter((price) => {
      const priceDate = new Date(price.date);
      return (
        priceDate.getFullYear() === year && priceDate.getUTCMonth() === month - 1
      );
    });

    const dateSet = new Set<string>();

    filteredPrices.forEach((price) => {
      dateSet.add(price.date.toISOString().substring(0, 10));
    });

    const result = {
      dates: Array.from(dateSet),
    };
    return result;
  }

  async findPricesByNameAndAuction(auctionName: string, date: Date) {
    const auction = await this.auctionModel.findOne({ name: auctionName });
    if (!auction) {
      throw new Error(`No se encontró subasta con el nombre ${auctionName}`); // No se encontró la subasta con el nombre proporcionado
    }
    const prices = auction.prices.filter(
      (price) => price.date.getTime() === date.getTime(),
    );
    return { prices };
  }
}
