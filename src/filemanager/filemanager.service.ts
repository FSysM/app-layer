import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';

@Injectable()
export class FileManagerService {
  private readonly s3: S3Client;
  private readonly bucket: string;

  constructor(config: ConfigService) {
    const useSSL = config.get<string>('MINIO_USE_SSL') === 'true';
    const endpoint = config.getOrThrow<string>('MINIO_ENDPOINT');
    const port = config.getOrThrow<string>('MINIO_PORT');

    this.s3 = new S3Client({
      endpoint: `${useSSL ? 'https' : 'http'}://${endpoint}:${port}`,
      region: 'us-east-1',
      credentials: {
        accessKeyId: config.getOrThrow<string>('MINIO_ROOT_USER'),
        secretAccessKey: config.getOrThrow<string>('MINIO_ROOT_PASSWORD'),
      },
      forcePathStyle: true,
    });

    this.bucket = config.getOrThrow<string>('MINIO_BUCKET_NAME');
  }

  async getUploadUrl(filename: string, contentType: string) {
    const key = `${randomUUID()}/${filename}`;
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType,
    });
    const uploadUrl = await getSignedUrl(this.s3, command, { expiresIn: 900 });
    return { uploadUrl, key };
  }

  async deleteFile(key: string) {
    await this.s3.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
  }
}
