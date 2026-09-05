import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';

const b2Client = new S3Client({
  region: 'us-east-005',
  endpoint: process.env.B2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.B2_KEY_ID,
    secretAccessKey: process.env.B2_APPLICATION_KEY,
  },
});

const BUCKET_NAME = process.env.B2_BUCKET_NAME;

function normalizeKey(key) {
  return String(key || '').replace(/^\/+/, '');
}

export async function uploadToB2(key, body, contentType) {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: normalizeKey(key),
    Body: body,
    ContentType: contentType || 'application/octet-stream',
  });

  return b2Client.send(command);
}

export async function getFromB2(key, options = {}) {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: normalizeKey(key),
    Range: options.range,
  });

  return b2Client.send(command);
}

export async function deleteFromB2(key) {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: normalizeKey(key),
  });

  return b2Client.send(command);
}

export async function listB2Files(prefix = '') {
  const command = new ListObjectsV2Command({
    Bucket: BUCKET_NAME,
    Prefix: normalizeKey(prefix),
  });

  return b2Client.send(command);
}