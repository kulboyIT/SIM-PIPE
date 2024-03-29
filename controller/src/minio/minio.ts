import { Client as MinioClient } from 'minio';
import { URL } from 'node:url';

import {
  minioAccessKey,
  minioBucketName,
  minioRegion,
  minioSecretKey,
  minioUrl,
} from '../config.js';

if (!minioAccessKey) {
  throw new Error('MINIO_ACCESS_KEY is not set');
}
if (!minioSecretKey) {
  throw new Error('MINIO_SECRET_KEY is not set');
}

const parsedUrl = new URL(minioUrl);
const minioClient = new MinioClient({
  endPoint: parsedUrl.hostname,
  port: Number.parseInt(parsedUrl.port, 10) ?? (parsedUrl.protocol === 'https:' ? 443 : 80),
  useSSL: parsedUrl.protocol === 'https:',
  accessKey: minioAccessKey,
  secretKey: minioSecretKey,
  region: minioRegion,
});

export async function computePresignedPutUrl(objectName: string): Promise<string> {
  const expire = 60 * 60 * 24 * 7; // 7 days
  return await minioClient.presignedPutObject(minioBucketName, objectName, expire);
}

export async function computePresignedGetUrl(objectName: string): Promise<string> {
  // One hour
  const expire = 3600;
  return await minioClient.presignedGetObject(minioBucketName, objectName, expire);
}
