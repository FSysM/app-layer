import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ReviewFileConfirmDto {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsString()
  @IsNotEmpty()
  filename: string;

  @IsString()
  @IsNotEmpty()
  contentType: string;

  @IsOptional()
  @IsInt()
  size?: number;
}
