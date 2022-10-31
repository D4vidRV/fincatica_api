import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Num extends Document {
  @Prop({
    unique: true,
  })
  num: Number;

  @Prop({
    default: false,
  })
  inUse: boolean;

  @Prop({
    default: true,
  })
  status: boolean;
}

export const NumSchema = SchemaFactory.createForClass(Num);
