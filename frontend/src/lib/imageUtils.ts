const MAX_DIMENSION = 2048;
const WEBP_QUALITY = 0.8;

function toWebpFileName(name: string): string {
  return `${name.replace(/\.[^/.]+$/, "")}.webp`;
}

function scaledSize(width: number, height: number, maxDimension: number) {
  const longEdge = Math.max(width, height);
  if (longEdge <= maxDimension) return { width, height };
  const ratio = maxDimension / longEdge;
  return {
    width: Math.round(width * ratio),
    height: Math.round(height * ratio),
  };
}

/**
 * Resizes an image so its longest edge is at most `maxDimension` px and
 * re-encodes it as WebP. Returns the original file untouched if it is not a
 * raster image or if the browser cannot produce a WebP blob.
 */
export async function convertImageToWebp(
  file: File,
  {
    maxDimension = MAX_DIMENSION,
    quality = WEBP_QUALITY,
  }: { maxDimension?: number; quality?: number } = {},
): Promise<File> {
  if (!file.type.startsWith("image/")) return file;

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return file;
  }

  try {
    const { width, height } = scaledSize(
      bitmap.width,
      bitmap.height,
      maxDimension,
    );
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", quality),
    );
    if (!blob) return file;

    return new File([blob], toWebpFileName(file.name), {
      type: "image/webp",
      lastModified: file.lastModified,
    });
  } finally {
    bitmap.close();
  }
}
