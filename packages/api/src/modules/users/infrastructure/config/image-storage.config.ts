export interface ImageStorageConfig {
  endpoint: string;
  region: string;
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
  forcePathStyle: boolean;
}

const REQUIRED_ENV_VARS = [
  'S3_ENDPOINT',
  'S3_BUCKET',
  'S3_ACCESS_KEY_ID',
  'S3_SECRET_ACCESS_KEY',
] as const;

export function loadImageStorageConfig(): ImageStorageConfig {
  const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);

  if (missing.length) {
    throw new Error(
      `Missing required image storage environment variable(s): ${missing.join(', ')}`,
    );
  }

  return {
    endpoint: process.env.S3_ENDPOINT as string,
    region: process.env.S3_REGION ?? 'auto',
    bucket: process.env.S3_BUCKET as string,
    accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
  };
}
