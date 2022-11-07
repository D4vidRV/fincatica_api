import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  lastname: string;

  @Prop({ type: String, required: true, select: false })
  password: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({
    type: String,
    required: true,
    enum: ['admin', 'user'],
    default: 'user',
  })
  rol: string;

  @Prop({ type: Boolean, required: true, default: true })
  status: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
