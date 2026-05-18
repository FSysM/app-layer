import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';

export class CreateAssignmentDto {
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
}
