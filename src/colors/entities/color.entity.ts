import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Color extends Document {
  @Prop({
    unique: true,
    required: true,
    type: String,
  })
  name: string;

  @Prop({
    default: true,
  })
  status: boolean;
}

export const ColorSchema = SchemaFactory.createForClass(Color);
