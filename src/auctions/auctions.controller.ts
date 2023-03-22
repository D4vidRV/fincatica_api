import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Optional,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuctionsService } from './auctions.service';

@Controller('auctions')
export class AuctionsController {
  constructor(private readonly auctionsService: AuctionsService) {}

  @Get()
  getAllAuctionNames() {
    return this.auctionsService.getAllAuctionNames();
  }

  @Get('/last_prices')
  @UseGuards(AuthGuard())
  getLastAuctionPricesByName(
    @Optional() @Query('auction_name') auction_name?: string,
  ) {
    return this.auctionsService.getLastAuctionPricesByName(auction_name);
  }

  @Get('/years_by_auction')
  getYearsByAuction(@Query('auction_name') auction_name?: string) {
    return this.auctionsService.getYearsByAuction(auction_name);
  }

  @Get('/months_by_name_and_year')
  @UseGuards(AuthGuard())
  getMonthsByNameAndYear(
    @Query('auction_name') auction_name?: string,
    @Query('year') year?: number,
  ) {
    return this.auctionsService.getMonthsByNameAndYear(auction_name, year);
  }

  @Get('/auctions_by_name_and_date')
  @UseGuards(AuthGuard())
  getAuctionDatesByNameYearMonth(
    @Query('auction_name') auction_name?: string,
    @Query('year') year?: number,
    @Query('month') month?: number,
  ) {
    return this.auctionsService.getAuctionDatesByNameYearMonth(
      auction_name,
      year,
      month,
    );
  }

  @Get('/prices_by_name_and_auction')
  @UseGuards(AuthGuard())
  findPricesByNameAndAuction(
    @Query('auction_name') auction_name?: string,
    @Query('date') date?: Date,
  ) {
    return this.auctionsService.findPricesByNameAndAuction(auction_name, date);
  }
}
