import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export type FileFolder = 'REVIEWS' | 'TEXT' | 'FILES';

export interface FileRecord {
  id: string;
  key: string;
  filename: string;
  contentType: string;
  size: number | null;
  folder: FileFolder;
  submissionId: string;
  reviewId: string | null;
  uploadedById: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class FileManagerService {
  private readonly baseUrl: string;

  constructor(config: ConfigService) {
    this.baseUrl = config.getOrThrow<string>('FILE_MANAGER_URL');
  }

  private async call<T>(path: string, method: string, body?: unknown): Promise<T> {
    const init: RequestInit = { method };
    if (body !== undefined) {
      init.headers = { 'Content-Type': 'application/json' };
      init.body = JSON.stringify(body);
    }

    const res = await fetch(`${this.baseUrl}${path}`, init);

    if (!res.ok) {
      const data = await res.json().catch(() => ({ message: 'File manager error' }));
      const message = (data as any).message ?? 'File manager error';
      if (res.status === 404) throw new NotFoundException(message);
      if (res.status === 403) throw new ForbiddenException(message);
      throw new InternalServerErrorException(message);
    }

    return res.json() as Promise<T>;
  }

  getUploadUrl(submissionId: string, folder: FileFolder, filename: string, contentType: string) {
    return this.call<{ uploadUrl: string; key: string }>('/files/upload-url', 'POST', {
      submissionId,
      folder,
      filename,
      contentType,
    });
  }

  confirmUpload(data: {
    key: string;
    filename: string;
    contentType: string;
    folder: FileFolder;
    submissionId: string;
    reviewId?: string;
    uploadedById: string;
    size?: number;
  }) {
    return this.call<FileRecord>('/files/confirm', 'POST', data);
  }

  deleteFile(fileId: string, userId: string) {
    return this.call<FileRecord>(`/files/${fileId}`, 'DELETE', { userId });
  }

  listSubmissionFiles(submissionId: string) {
    return this.call<FileRecord[]>(`/files/submission/${submissionId}`, 'GET');
  }

  listReviewFiles(reviewId: string) {
    return this.call<FileRecord[]>(`/files/review/${reviewId}`, 'GET');
  }
}
