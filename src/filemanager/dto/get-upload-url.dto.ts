import { IsNotEmpty, IsString } from 'class-validator';

export class GetUploadUrlDto {
  @IsString()
  @IsNotEmpty()
  filename: string;

  @IsString()
  @IsNotEmpty()
  contentType: string;
}
