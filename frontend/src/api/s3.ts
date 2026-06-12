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

/** PUT a file directly to a presigned S3 URL, reporting upload progress. */
export function uploadToS3(
  file: File,
  url: string,
  onProgress?: (percent: number) => void,
) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);

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
