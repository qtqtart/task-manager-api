import { EnvironmentService } from '@app/environment/environment.service';

import {
  DeleteObjectCommand,
  GetObjectAclCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';

@Injectable()
export class S3Service {
  private readonly client: S3Client;

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

    return `${this.environmentService.get('S3_ENDPOINT')}/${this.environmentService.get('S3_BUCKET')}/${key}`;
  }

  public async remove(key: string) {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.environmentService.get('S3_BUCKET'),
        Key: key,
      }),
    );
  }
}
