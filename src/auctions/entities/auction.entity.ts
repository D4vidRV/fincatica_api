import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export interface IPrice {
  animaltype: string;
  weightRange: string;
  maxPrice: string;
  minPrice: string;
  averagePrice: string;
  date: Date;
}

@Schema()
export class Auction extends Document {
  @Prop({ type: String })
  name: string;

  @Prop({ type: Date })
  last_auction: Date;

  @Prop({ type: [Object] })
  prices: IPrice[];
}

export const AuctionSchema = SchemaFactory.createForClass(Auction);
