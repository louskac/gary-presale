import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionController } from './transaction.controller.js';
import { TransactionService } from './transactino.service.js';
import { TransactionsSchema } from './transaction.schema.js';
import { UsersSchema } from '../user/user.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'transactions', schema: TransactionsSchema }]),
    MongooseModule.forFeature([{ name: 'users', schema: UsersSchema }]),
  ],
  controllers: [TransactionController],
  providers: [
    TransactionService,
  ],
})
export class TransactionModule {}
