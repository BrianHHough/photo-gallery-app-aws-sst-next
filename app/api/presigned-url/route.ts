// TESTING
import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';

const s3 = new S3Client({ region: process.env.AWS_REGION });
const BUCKET_NAME = process.env.BucketName;

export async function GET(req: NextRequest) {
  try {
    const command = new PutObjectCommand({
      ACL: 'public-read',
      Key: crypto.randomUUID(),
      Bucket: BUCKET_NAME!,
    });
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

    return NextResponse.json({ url }, { status: 200 });
  } catch (error) {
    console.error('Error creating presigned URL', error);
    return NextResponse.json({ message: 'Failed to create presigned URL', error }, { status: 500 });
  }
}

export function handler(req: NextRequest) {
  if (req.method === 'GET') {
    return GET(req);
  } else {
    return NextResponse.json({ message: `Method ${req.method} Not Allowed` }, { status: 405 });
  }
}

export default handler;
