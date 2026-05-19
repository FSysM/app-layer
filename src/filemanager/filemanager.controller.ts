import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { FileManagerService } from './filemanager.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('files')
@UseGuards(JwtAuthGuard)
export class FileManagerController {
  constructor(private readonly fileManagerService: FileManagerService) {}

  @Get(':fileId/download-url')
  getDownloadUrl(@Param('fileId') fileId: string) {
    return this.fileManagerService.getDownloadUrl(fileId);
  }
}
