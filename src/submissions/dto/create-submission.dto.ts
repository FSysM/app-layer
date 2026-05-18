import { IsString, IsNotEmpty, IsEnum, IsOptional, IsUUID } from 'class-validator';

export class CreateSubmissionDto {
  @IsUUID()
  assignmentId: string;

  @IsString()
  @IsNotEmpty()
  topic: string;

  @IsEnum(['bc', 'mgr', 'phd', 'other'])
  type: string;

  @IsEnum(['PRF', 'CHEM'])
  faculty: string;

  @IsEnum(['Informatics', 'Mathematics', 'Physics', 'Chemistry'])
  department: string;

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
