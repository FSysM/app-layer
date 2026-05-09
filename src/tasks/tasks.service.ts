import { Injectable } from '@nestjs/common';

@Injectable()
export class TasksService {
    async getTasks() {
        return 'Tasks retrieved successfully';
    }
}
