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
} from '@nestjs/common';
import { AuctionsService } from './auctions.service';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';

@Controller('auctions')
export class AuctionsController {
  constructor(private readonly auctionsService: AuctionsService) {}

  @Post()
  create(@Body() createAuctionDto: CreateAuctionDto) {
    return this.auctionsService.create(createAuctionDto);
  }

  @Get()
  getAllAuctionNames() {
    return this.auctionsService.getAllAuctionNames();
  }

  @Get('/last_prices')
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
  getMonthsByNameAndYear(
    @Query('auction_name') auction_name?: string,
    @Query('year') year?: number,
  ) {
    return this.auctionsService.getMonthsByNameAndYear(auction_name, year);
  }

  @Get('/auctions_by_name_and_date')
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
  findPricesByNameAndAuction(
    @Query('auction_name') auction_name?: string,
    @Query('date') date?: Date,
  ) {
    return this.auctionsService.findPricesByNameAndAuction(auction_name, date);
  }
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.auctionsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuctionDto: UpdateAuctionDto) {
  //   return this.auctionsService.update(+id, updateAuctionDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.auctionsService.remove(+id);
  // }
}
