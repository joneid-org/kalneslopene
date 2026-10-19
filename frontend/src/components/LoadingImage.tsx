import { Loader2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils.ts";

type Props = {
  src: string;
  alt: string;
  className?: string;
};

export function LoadingImage({ src, alt, className }: Props) {
  const [loadedSrc, setLoadedSrc] = useState<string>();
  const isLoading = loadedSrc !== src;

  return (
    <>
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoadedSrc(src)}
        onError={() => setLoadedSrc(src)}
        className={cn(
          "transition-[transform,opacity] duration-300",
          className,
          isLoading && "opacity-0",
        )}
      />
      {isLoading && (
        <div
          role="status"
          aria-label="Laster bilde"
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      )}
    </>
  );
}
