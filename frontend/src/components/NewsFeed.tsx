import { useQuery } from "@tanstack/react-query";
import { QUERIES } from "@/api/queries.ts";
import { Badge } from "@/components/ui/badge.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { toDateString } from "@/lib/utils.ts";

export default function NewsFeed() {
  const { data: newsfeeds } = useQuery(QUERIES.newsfeed.getAllNewsFeeds);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Siste nytt</CardTitle>
      </CardHeader>
      <CardContent>
        {newsfeeds?.map((post, idx) => (
          <div key={post.uuid}>
            <article className="py-4 space-y-2">
              <div className="flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <h3 className="font-semibold leading-snug">{post.header}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {post.content}
              </p>
              <p className="text-xs text-muted-foreground/70">
                {toDateString(post.date)}
              </p>
            </article>

            {idx < newsfeeds.length - 1 && <Separator />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
