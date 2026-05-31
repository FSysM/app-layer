import { Injectable, Inject, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { KAFKA_CLIENT } from './kafka.module';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaService.name);

  constructor(@Inject(KAFKA_CLIENT) private readonly client: ClientKafka) {}

  async onModuleInit() {
    await this.client.connect();
    this.logger.log('Kafka producer connected');
  }

  async onModuleDestroy() {
    await this.client.close();
  }

  emit(topic: string, payload: object): void {
    this.client.emit(topic, payload).subscribe({
      error: (err) => this.logger.error(`Failed to emit to topic "${topic}"`, err),
    });
  }
}
