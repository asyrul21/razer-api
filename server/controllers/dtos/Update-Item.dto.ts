import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateItemDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  price: number;
}
