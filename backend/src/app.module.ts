import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { DB_URL } from './constant.js';
import { TransactionModule } from './transaction/transaction.module.js';
import { UserModule } from './user/user.module.js';

@Module({
  imports: [
    MongooseModule.forRoot(DB_URL),
    TransactionModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule {}
