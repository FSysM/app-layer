import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class FileConfirmDto {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsString()
  @IsNotEmpty()
  filename: string;

  @IsString()
  @IsNotEmpty()
  contentType: string;

  @IsEnum(['TEXT', 'FILES'])
  folder: string;

  @IsOptional()
  @IsInt()
  size?: number;
}
