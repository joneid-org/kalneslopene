import { Badge } from "@/components/ui/badge.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Separator } from "@/components/ui/separator.tsx";

export type NewsPost = {
  id: string;
  tags: string[];
  header: string;
  subheader: string;
  content: string;
  date: string;
};

const mockPosts: NewsPost[] = [
  {
    id: "1",
    tags: ["Løpsresultat", "Uke 7"],
    header: "Ny rekord på Kalneset!",
    subheader: "Sarah Johnson løp inn til ny løyperekord under torsdag kveld",
    content:
      "Med 48 deltakere og perfekte forhold leverte Sarah Johnson en imponerende prestasjon og satte ny løyperekord med tiden 21:34. Gratulerer til alle som deltok – det var en fantastisk kveld for løping!",
    date: "12. februar 2026",
  },
  {
    id: "2",
    tags: ["Informasjon", "Sesong 2026"],
    header: "Sesongen 2026 er i gang",
    subheader: "Vi starter opp igjen med ukentlige torsdagsløp fra uke 7",
    content:
      "Etter en kort vinterpause er vi klare for en ny sesong. Løpene går som vanlig hver torsdag fra klokken 18:00 ved Kalneset. Ingen forhåndspåmelding – møt opp og løp! Vi håper å se mange kjente og nye fjes denne sesongen.",
    date: "5. februar 2026",
  },
  {
    id: "3",
    tags: ["Frivillig", "Hjelp søkes"],
    header: "Vi trenger flere frivillige",
    subheader: "Har du lyst til å bidra i arrangementet? Ta kontakt!",
    content:
      "For å kunne gjennomføre torsdagsløpet på best mulig måte trenger vi hjelp fra frivillige til tidtaking, registrering og generell praktisk hjelp. Arbeidet tar omtrent en time per uke og er veldig givende. Send oss en e-post om du er interessert.",
    date: "29. januar 2026",
  },
];

export default function NewsFeed() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Siste nytt</CardTitle>
      </CardHeader>
      <CardContent>
        {mockPosts.map((post, idx) => (
          <div key={post.id}>
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

              {/* Subheader */}
              <p className="text-sm font-medium text-muted-foreground">
                {post.subheader}
              </p>

              {/* Content */}
              <p className="text-sm text-muted-foreground leading-relaxed">
                {post.content}
              </p>

              {/* Date */}
              <p className="text-xs text-muted-foreground/70">{post.date}</p>
            </article>

            {idx < mockPosts.length - 1 && <Separator />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
