export type ImageFormat = 'jpeg' | 'png';

const IMAGE_SIGNATURES: Record<ImageFormat, Buffer> = {
  jpeg: Buffer.from([0xff, 0xd8, 0xff]),
  png: Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
};

export function detectImageFormat(data: Buffer): ImageFormat | null {
  for (const format of Object.keys(IMAGE_SIGNATURES) as ImageFormat[]) {
    const signature = IMAGE_SIGNATURES[format];
    if (data.subarray(0, signature.length).equals(signature)) {
      return format;
    }
  }

  return null;
}
