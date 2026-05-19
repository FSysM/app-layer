import { Module } from '@nestjs/common';
import { FileManagerController } from './filemanager.controller';
import { FileManagerService } from './filemanager.service';

@Module({
  controllers: [FileManagerController],
  providers: [FileManagerService],
  exports: [FileManagerService],
})
export class FileManagerModule {}
