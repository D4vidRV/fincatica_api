import { Module } from '@nestjs/common';
import { AuctionsService } from './auctions.service';
import { AuctionsController } from './auctions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Auction, AuctionSchema } from './entities/auction.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [AuctionsController],
  providers: [AuctionsService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Auction.name,
        schema: AuctionSchema,
      },
    ]),
    AuthModule,
  ],
})
export class AuctionsModule {}
