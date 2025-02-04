import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { SetReferralDTO, GetReferralDTO, SetReferredDTO } from './user.dto.js';
import { Users } from './user.schema.js';

@Injectable()
export class UserService {

  constructor(
    @InjectModel('users')
    private UsersModal: Model<Users>,
  ) {}

  async setReferral(data: SetReferralDTO) {
    try {
      const user = await this.UsersModal.findOne({ walletAddress: data.walletAddress }).exec()
      if (user) {
        if (!user.referral){
          user.referral = data.referral
          user.save()
        }
        return user
      } else {
        const newUser = new this.UsersModal(data)
        newUser.save()
        return newUser
      }
    } catch (error) {
      console.error(error);
    }
  }

  async getReferral(data: GetReferralDTO) {
    try {
      const user = await this.UsersModal.findOne({ walletAddress: data.walletAddress }).exec()
      if (user) {
        return user.referral;
      } else {
        return ''
      }
    } catch (error) {
      console.error(error);
    }
  }

  async setReferred(data: SetReferredDTO) {
    try {
      const user = await this.UsersModal.findOne({ walletAddress: data.walletAddress }).exec()
      if (user) {
        if (!user.referred){
          user.referred = data.referred
          user.save()
        }
        return user
      } else {
        const newUser = new this.UsersModal(data)
        newUser.save()
        return newUser
      }
    } catch (error) {
      console.error(error);
    }
  }
}
