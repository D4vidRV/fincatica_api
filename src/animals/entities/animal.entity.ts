import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema()
export class Animal extends Document {
  @Prop({ type: Number, required: true })
  internal_number: number;
  @Prop({ required: true, unique: true, type: String })
  unique_number: string;
  @Prop({ required: true, type: String, enum: ['M', 'H'] })
  gender: string;
  @Prop({ type: String, required: true })
  color: string;
  @Prop({ type: String })
  image_path: string;
  @Prop({ type: Date, required: true })
  entry_date: Date;
  @Prop({ type: Number, required: true })
  entry_weight: number;
  @Prop({ type: Number, required: true })
  entry_price: number;
  @Prop({ type: Date })
  departure_date: Date;
  // weight history
  @Prop([{ date: Date, weight: Number }])
  weight_history: { date: Date; weight: number }[];
  // consumption history
  @Prop([{ date: Date, price: Number, description: String }])
  consumption_history: { date: Date; price: number; description: string }[];
  @Prop({ type: Number })
  departure_weight: number;
  @Prop({ type: Number })
  departure_price: number;
  @Prop({ type: Boolean, default: true })
  status: boolean;
}
export const AnimalSchema = SchemaFactory.createForClass(Animal);
