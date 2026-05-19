import { IsNotEmpty, IsString } from 'class-validator';

export class ReviewFileUploadUrlDto {
  @IsString()
  @IsNotEmpty()
  filename: string;

  @IsString()
  @IsNotEmpty()
  contentType: string;
}
