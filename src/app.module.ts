import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [ConfigModule.forRoot(), PrismaModule, AuthModule, UsersModule, TasksModule, ReviewsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
