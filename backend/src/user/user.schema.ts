import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Users {
  @Prop({ type: String, default: '' })
  walletAddress: string;

  @Prop({ type: String, default: '' })
  referral: string;

  @Prop({ type: String, default: '' })
  referred: string;
}

export type UsersDocument = Users & Document;
export const UsersSchema = SchemaFactory.createForClass(Users);