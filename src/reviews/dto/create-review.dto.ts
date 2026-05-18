import { IsString, IsEnum, IsOptional, IsUUID } from 'class-validator';

export class CreateReviewDto {
  @IsUUID()
  submissionId: string;

  @IsEnum(['A', 'B', 'C', 'D', 'E', 'F'])
  grade: string;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsEnum(['SUPERVISOR', 'OPPONENT'])
  type: string;
}
