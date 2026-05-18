import { IsString, IsEnum, IsOptional, IsUUID } from 'class-validator';

export class UpdateReviewDto {
  @IsUUID()
  id: string;

  @IsEnum(['A', 'B', 'C', 'D', 'E', 'F'])
  grade: string;

  @IsOptional()
  @IsString()
  comment?: string;
}
