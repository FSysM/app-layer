import { Injectable } from '@nestjs/common';

@Injectable()
export class ReviewsService {
    async getReviews() {
        return 'Reviews retrieved successfully';
    }
}
