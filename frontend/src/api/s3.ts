import { kyClient } from "@/api/queryClient.ts";

/**
 * Request a presigned PUT URL for a static course-map image (admin only).
 * The object is stored under the `static/` prefix in the bucket, so the file
 * can be overwritten in place. The endpoint returns the URL as plain text.
 */
export function requestStaticPresignedUrl(fileName: string) {
  return kyClient
    .get("/api/s3/presigned-url", {
      searchParams: { fileName: `static/${fileName}` },
    })
    .text();
}

/**
 * Cache-Control sent on immutable photo uploads. Must match exactly what the
 * backend signs into the presigned URL (`IMMUTABLE_CACHE_CONTROL`), or MinIO
 * rejects the PUT with a signature mismatch.
 */
export const IMMUTABLE_CACHE_CONTROL = "public, max-age=31536000, immutable";

/** PUT a file directly to a presigned S3 URL, reporting upload progress. */
export function uploadToS3(
  file: File,
  url: string,
  onProgress?: (percent: number) => void,
  cacheControl?: string,
) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    if (cacheControl) xhr.setRequestHeader("Cache-Control", cacheControl);

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) return;
      const percent = Math.round((event.loaded / event.total) * 100);
      onProgress?.(percent);
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    };

    xhr.onerror = () => reject(new Error("Upload failed"));
    xhr.send(file);
  });
}
