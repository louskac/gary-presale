import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class AddTransactionDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly walletAddress: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly chain: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly token: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly amount: string;
}