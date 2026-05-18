import { IsUUID } from 'class-validator';

export class ApproveSubmissionDto {
  @IsUUID()
  id: string;

  @IsUUID()
  opponentId: string;
}
