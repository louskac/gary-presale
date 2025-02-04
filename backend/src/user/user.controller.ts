import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { UserService } from './user.service.js';
import { SetReferralDTO, GetReferralDTO, SetReferredDTO } from './user.dto.js';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Post('/setReferral')
  async setReferral(@Res() res, @Body() params: SetReferralDTO) {
    const data = await this.userService.setReferral(params);
    return res.status(HttpStatus.OK).json({ status: 'ok', data });
  }

  @Post('/getReferral')
  async getReferral(@Res() res, @Body() params: GetReferralDTO) {
    const data = await this.userService.getReferral(params);
    return res.status(HttpStatus.OK).json({ status: 'ok', data });
  }

  @Post('/setReferred')
  async setReferred(@Res() res, @Body() params: SetReferredDTO) {
    const data = await this.userService.setReferred(params);
    return res.status(HttpStatus.OK).json({ status: 'ok', data });
  }
}
