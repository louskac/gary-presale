import { Injectable } from '@nestjs/common';
import { Transactions } from './transaction.schema.js';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AddTransactionDTO } from './transaction.dto.js';
import { Users } from '@src/user/user.schema.js';
import { ethers } from 'ethers';
import { erc20Abi } from 'viem';

@Injectable()
export class TransactionService {
  public ChainInfo = {
    "Ethereum": {
      "RPC": "https://eth-mainnet.g.alchemy.com/v2/dNMADuse_UiHTjTasg3_E2ezx8IpNcxF",
      "USDT": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      "USDC": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      "decimals": 6
    },
    "BNB Smart Chain": {
      "RPC": "https://bnb-mainnet.g.alchemy.com/v2/dNMADuse_UiHTjTasg3_E2ezx8IpNcxF",
      "USDT": "0x55d398326f99059fF775485246999027B3197955",
      "USDC": "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
      "decimals": 18
    },
    "Polygon": {
      "RPC": "https://polygon-mainnet.g.alchemy.com/v2/vbBKw_KLTIW6P9CvewSXZrgbaAlhcg9r",
      "USDT": "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
      "USDC": "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
      "decimals": 6
    },
  }

  constructor(
    @InjectModel('transactions')
    private TransactionModal: Model<Transactions>,
    @InjectModel('users')
    private UsersModal: Model<Users>,
  ) {}

  async addTransaction(data: AddTransactionDTO) {
    console.log("legend, transaction data = ", data)
    try {
      const transaction = new this.TransactionModal(data)
      transaction.createdAt = Date.now()
      transaction.save()

      const userInfo = await this.UsersModal.findOne({ walletAddress: data.walletAddress }).exec()
      if (userInfo) {
        if (userInfo.referred) {
          const referralUser = await this.UsersModal.findOne({ referral: userInfo.referred }).exec()
          if (referralUser) {
            const walletAddress = referralUser.walletAddress
            const privateKey = process.env.PRIVATE_KEY

            try {
              const provider = new ethers.JsonRpcProvider(this.ChainInfo[data.chain].RPC);
              const wallet = new ethers.Wallet(privateKey, provider);
              
              if (data.token === "ETH" || data.token === "BNB" || data.token === "POL") {
                const tx = {
                  to: walletAddress,
                  value: ethers.parseUnits(data.amount.toString(), 18 - 1)
                }
                console.log("Sending ETH...");
                const transaction = await wallet.sendTransaction(tx);
                await transaction.wait();
                console.log(`Transaction successful! Hash: ${transaction.hash}`);
              } else {
                const amount = ethers.parseUnits(data.amount.toString(), this.ChainInfo[data.chain].decimals - 1)
                console.log(`Sending ${amount} tokens...`);
                const contract = new ethers.Contract(this.ChainInfo[data.chain][data.token], erc20Abi, wallet);
                const tx = await contract.transfer(walletAddress, amount);
                await tx.wait()
                console.log(`Transaction successful! Hash: ${tx.hash}`);
              }
            } catch (error) {
              console.log(`Sending referral reward was filed. error = `, error);
            }
          }
        }
      }

      return transaction
    } catch (error) {
      console.error(error);
    }
  }
}
