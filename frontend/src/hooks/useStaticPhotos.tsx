import { useCallback, useState } from "react";
import { requestStaticPresignedUrl, uploadToS3 } from "@/api/s3.ts";
import { useApplicationContext } from "@/context/ApplicationContext.tsx";
import { convertImageToWebp } from "@/lib/photoUtils.ts";

export function useStaticPhotos() {
  const { s3BaseUrl } = useApplicationContext();
  const [photoVersions, setPhotoVersions] = useState<Record<string, number>>(
    {},
  );

  function resolvePhotoUrl(fileName: string, fallback: string): string;
  function resolvePhotoUrl(
    fileName: string | undefined,
    fallback: string | undefined,
  ): string | undefined;
  function resolvePhotoUrl(
    fileName: string | undefined,
    fallback: string | undefined,
  ): string | undefined {
    if (!s3BaseUrl) return fallback;
    if (!fileName) return undefined;
    const base = `${s3BaseUrl}/static/${fileName}`;
    const version = photoVersions[fileName];
    return version
      ? `${base}${base.includes("?") ? "&" : "?"}v=${version}`
      : base;
  }

  const handleReplacePhoto = useCallback(
    async (fileName: string, file: File) => {
      const webpFile = await convertImageToWebp(file);
      const uploadUrl = await requestStaticPresignedUrl(fileName);
      await uploadToS3(webpFile, uploadUrl);
      setPhotoVersions((prev) => ({ ...prev, [fileName]: Date.now() }));
    },
    [],
  );

  return { resolvePhotoUrl, handleReplacePhoto };
}
