import { kyClient } from "@/api/queryClient.ts";
import type { S3FileDto } from "@/model/DTO.ts";

export function requestPresignedUrls(raceUuid: string, fileNames: string[]) {
  return kyClient
    .post(`/api/races/${raceUuid}/photos`, {
      json: fileNames,
    })
    .json<{ [key in string]: { uploadUrl: string; s3File: S3FileDto } }>();
}

export function confirmUploadedFile(fileUuid: string) {
  return kyClient
    .patch(`/api/s3/files/${fileUuid}/confirm-upload`)
    .json<S3FileDto>();
}

export function deleteS3Files(fileUuids: string[]) {
  return kyClient.delete("/api/s3/files", { json: fileUuids }).json<void>();
}
