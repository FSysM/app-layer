import { IsString, IsNotEmpty, IsEnum, IsOptional, IsUUID } from 'class-validator';

export class UpdateSubmissionDto {
  @IsUUID()
  id: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  topic?: string;

  @IsOptional()
  @IsEnum(['bc', 'mgr', 'phd', 'other'])
  type?: string;

  @IsOptional()
  @IsEnum(['PRF', 'CHEM'])
  faculty?: string;

  @IsOptional()
  @IsEnum(['Informatics', 'Mathematics', 'Physics', 'Chemistry'])
  department?: string;

  @IsOptional()
  @IsString()
  annotation?: string;

  @IsOptional()
  @IsString()
  literature?: string;

  @IsOptional()
  @IsString()
  fileUrl?: string;
}
