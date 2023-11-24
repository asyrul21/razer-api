import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateItemDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  description: string;
}
