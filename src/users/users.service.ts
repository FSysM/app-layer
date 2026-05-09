import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
    async getUser() {
        return 'User retrieved successfully';
    }
}
