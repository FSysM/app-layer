import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class FileUploadUrlDto {
  @IsEnum(['TEXT', 'FILES'])
  folder: string;

  @IsString()
  @IsNotEmpty()
  filename: string;

  @IsString()
  @IsNotEmpty()
  contentType: string;
}
