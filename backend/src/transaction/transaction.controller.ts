import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { TransactionService } from './transactino.service.js';
import { AddTransactionDTO } from './transaction.dto.js';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {
  }
  
  @Post('/addTransaction')
  async addTransaction(@Res() res, @Body() params: AddTransactionDTO) {
    const data = await this.transactionService.addTransaction(params);
    return res.status(HttpStatus.OK).json({ status: 'ok', data });
  }
}
