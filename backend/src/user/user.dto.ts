import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class SetReferralDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly walletAddress: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly referral: string;
}

export class GetReferralDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly walletAddress: string;
}

export class SetReferredDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly walletAddress: string;
  
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly referred: string;
}