import { Body, Controller, Delete, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { FileManagerService } from './filemanager.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUploadUrlDto } from './dto/get-upload-url.dto';
import { DeleteFileDto } from './dto/delete-file.dto';

@Controller('files')
@UseGuards(JwtAuthGuard)
export class FileManagerController {
  constructor(private readonly fileManagerService: FileManagerService) {}

  @Post('upload-url')
  getUploadUrl(@Body() dto: GetUploadUrlDto) {
    return this.fileManagerService.getUploadUrl(dto.filename, dto.contentType);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteFile(@Body() dto: DeleteFileDto) {
    return this.fileManagerService.deleteFile(dto.key);
  }
}
