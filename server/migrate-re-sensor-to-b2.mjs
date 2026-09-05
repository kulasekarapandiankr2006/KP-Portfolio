import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const root = path.resolve('server/data/storage/projects/re-sensor-iq');
const client = new S3Client({
  region: 'us-east-005',
  endpoint: process.env.B2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.B2_KEY_ID,
    secretAccessKey: process.env.B2_APPLICATION_KEY,
  },
});

const bucket = process.env.B2_BUCKET_NAME;

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

const files = walk(root);

for (const file of files) {
  const relative = path.relative(root, file).replace(/\\/g, '/');
  const key = `projects/re-sensor-iq/${relative}`;

  await client.send(new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: fs.createReadStream(file),
    ContentType: 'application/octet-stream',
  }));

  console.log(`UPLOADED: ${key}`);
}

console.log(`DONE: ${files.length} files uploaded`);
