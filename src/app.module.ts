import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { PrismaModule } from './prisma/prisma.module';
import { HealthController } from './health/health.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { SubmissionsModule } from './submissions/submissions.module';
import { ReviewsModule } from './reviews/reviews.module';
import { FileManagerModule } from './filemanager/filemanager.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, expandVariables: true }),
    EventEmitterModule.forRoot({ global: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    AssignmentsModule,
    SubmissionsModule,
    ReviewsModule,
    FileManagerModule,
    NotificationsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
