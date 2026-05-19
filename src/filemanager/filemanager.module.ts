import { Module } from '@nestjs/common';
import { FileManagerController } from './filemanager.controller';
import { FileManagerService } from './filemanager.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FileManagerController],
  providers: [FileManagerService],
  exports: [FileManagerService],
})
export class FileManagerModule {}
