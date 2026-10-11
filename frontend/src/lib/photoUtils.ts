const MAX_DIMENSION = 2048;
const WEBP_QUALITY = 0.8;

const EXTENSIONS: Record<string, string> = {
  "image/webp": "webp",
  "image/jpeg": "jpg",
};

export class UnsupportedImageError extends Error {
  readonly fileName: string;

  constructor(fileName: string) {
    super(
      `Kunne ikke lese «${fileName}». HEIC-bilder fra iPhone støttes ikke i denne nettleseren – eksporter som JPEG først.`,
    );
    this.name = "UnsupportedImageError";
    this.fileName = fileName;
  }
}

function withExtension(name: string, extension: string): string {
  return `${name.replace(/\.[^/.]+$/, "")}.${extension}`;
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

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number,
): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

/**
 * Resizes an image so its longest edge is at most `maxDimension` px and
 * re-encodes it as WebP, or as JPEG in browsers that cannot encode WebP
 * (they silently return PNG instead). Throws `UnsupportedImageError` if the
 * browser cannot decode the file, e.g. HEIC outside Safari.
 */
export async function convertImageToWebp(
  file: File,
  {
    maxDimension = MAX_DIMENSION,
    quality = WEBP_QUALITY,
  }: { maxDimension?: number; quality?: number } = {},
): Promise<File> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new UnsupportedImageError(file.name);
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
    if (!ctx) throw new UnsupportedImageError(file.name);
    ctx.drawImage(bitmap, 0, 0, width, height);

    let blob = await canvasToBlob(canvas, "image/webp", quality);
    if (blob?.type !== "image/webp") {
      // JPEG has no alpha channel, so transparent areas would turn black.
      ctx.globalCompositeOperation = "destination-over";
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, width, height);
      blob = await canvasToBlob(canvas, "image/jpeg", quality);
    }
    if (!blob || !(blob.type in EXTENSIONS)) {
      throw new UnsupportedImageError(file.name);
    }

    return new File([blob], withExtension(file.name, EXTENSIONS[blob.type]), {
      type: blob.type,
      lastModified: file.lastModified,
    });
  } finally {
    bitmap.close();
  }
}
