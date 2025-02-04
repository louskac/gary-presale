import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Transactions {
  @Prop({ type: String, default: '' })
  walletAddress: string;

  @Prop({ type: String, default: '' })
  chain: string;

  @Prop({ type: String, default: '' })
  token: string;

  @Prop({ type: String, default: '' })
  amount: string;

  @Prop({ type: Number, default: 0 })
  createdAt: number;
}

export type TransactionsDocument = Transactions & Document;
export const TransactionsSchema = SchemaFactory.createForClass(Transactions);