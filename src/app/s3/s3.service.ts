import { EnvironmentService } from '@app/environment/environment.service';

import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';

@Injectable()
export class S3Service {
  private readonly client: S3Client;
  private readonly imageUrlPrefix: string;

  public constructor(private readonly environmentService: EnvironmentService) {
    this.client = new S3Client({
      forcePathStyle: true,
      endpoint: environmentService.get('S3_ENDPOINT'),
      region: environmentService.get('S3_REGION'),
      credentials: {
        accessKeyId: environmentService.get('S3_ACCESS_KEY_ID'),
        secretAccessKey: environmentService.get('S3_SECRET_ACCESS_KEY'),
      },
    });

    this.imageUrlPrefix = `${this.environmentService.get('S3_ENDPOINT')}/${this.environmentService.get('S3_BUCKET')}`;
  }

  public async upload(buffer: Buffer, key: string, mimetype: string) {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.environmentService.get('S3_BUCKET'),
        Key: key,
        Body: buffer,
        ContentType: mimetype,
        ACL: 'public-read',
      }),
    );
  }

  public async remove(key: string) {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.environmentService.get('S3_BUCKET'),
        Key: key,
      }),
    );
  }

  public keyToImageUrl(key: string) {
    if (!key) return null;
    return `${this.imageUrlPrefix}/${key}`;
  }

  public imageUrlToKey(imageUrl: string) {
    if (!imageUrl) return null;
    if (!imageUrl.startsWith(this.imageUrlPrefix)) return null;
    return imageUrl.slice(this.imageUrlPrefix.length + 1);
  }
}
