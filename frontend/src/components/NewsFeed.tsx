import { useQuery } from "@tanstack/react-query";
import { Newspaper } from "lucide-react";
import { QUERIES } from "@/api/queries.ts";
import { Badge } from "@/components/ui/badge.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Separator } from "@/components/ui/separator.tsx";

export default function NewsFeed() {
  const { data: news } = useQuery(QUERIES.allNews);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Newspaper className="size-4 text-primary" />
          Siste nytt
        </CardTitle>
      </CardHeader>
      <CardContent>
        {news?.map((post, idx) => (
          <div key={post.uuid}>
            <article className="py-4 space-y-2">
              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Header */}
              <h3 className="font-semibold leading-snug">{post.header}</h3>

              {/* Content */}
              <p className="text-sm leading-relaxed">{post.content}</p>

              {/* Date */}
              <p className="text-xs text-muted-foreground/70">
                {(() => {
                  const d = new Date(post.date);
                  const day = String(d.getDate()).padStart(2, "0");
                  const month = d.toLocaleDateString("nb-NO", {
                    month: "long",
                  });
                  const year = d.getFullYear();
                  return `${day}. ${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;
                })()}
              </p>
            </article>

            {idx < news.length - 1 && <Separator />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
