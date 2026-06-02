import { Module } from '@nestjs/common';
import { FileManagerService } from './filemanager.service';
import { FileManagerController } from './filemanager.controller';

@Module({
  controllers: [FileManagerController],
  providers: [FileManagerService],
  exports: [FileManagerService],
})
export class FileManagerModule {}
