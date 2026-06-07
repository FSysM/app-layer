import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from './prisma/prisma.module';
import { KafkaModule } from './kafka/kafka.module';
import { HealthController } from './health/health.controller';
import { AuthModule } from './auth/auth.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { SubmissionsModule } from './submissions/submissions.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, expandVariables: true }),
    PrismaModule,
    KafkaModule,
    AuthModule,
    AssignmentsModule,
    SubmissionsModule,
    ReviewsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
