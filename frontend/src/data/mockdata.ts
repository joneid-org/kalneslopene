export interface Photo {
  id: string;
  raceId: string;
  url: string;
  caption: string;
  photographer?: string;
}

export const photos: Photo[] = [
  {
    id: "p1",
    raceId: "b1000000-0000-0000-0000-000000000028",
    url: "https://images.unsplash.com/photo-1692170226404-969b6e5cde95?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJhdGhvbiUyMHJ1bm5lcnMlMjByYWNlJTIwZmluaXNoJTIwbGluZXxlbnwxfHx8fDE3NzEwNzIzNjl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    caption: "Marathon finish line celebration",
    photographer: "Ola Nordmann",
  },
  {
    id: "p2",
    raceId: "b1000000-0000-0000-0000-000000000028",
    url: "https://images.unsplash.com/photo-1766970096331-78c8af007a3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydW5uZXJzJTIwY3Jvc3NpbmclMjBmaW5pc2glMjBsaW5lfGVufDF8fHx8MTc3MTA3MjM3MHww&ixlib=rb-4.1.0&q=80&w=1080",
    caption: "Runners crossing the finish line",
    photographer: "Ola Nordmann",
  },
  {
    id: "p3",
    raceId: "b1000000-0000-0000-0000-000000000028",
    url: "https://images.unsplash.com/photo-1731991027003-386ac5ae9c72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFpbCUyMHJ1bm5pbmclMjByYWNlJTIwbW91bnRhaW5zfGVufDF8fHx8MTc3MTA3MjM2OXww&ixlib=rb-4.1.0&q=80&w=1080",
    caption: "Mountain trail scenic views",
    photographer: "Ola Nordmann",
  },
  {
    id: "p4",
    raceId: "b1000000-0000-0000-0000-000000000028",
    url: "https://images.unsplash.com/photo-1769867628770-10a544d2a02c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHw1ayUyMHJhY2UlMjBwYXJ0aWNpcGFudHN8ZW58MXx8fHwxNzcxMDcyMzcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    caption: "5K participants starting strong",
    photographer: "Ola Nordmann",
  },
  {
    id: "p5",
    raceId: "b1000000-0000-0000-0000-000000000028",
    url: "https://images.unsplash.com/photo-1745818016652-a890846ed361?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwbWFyYXRob24lMjBydW5uZXJzJTIwY3Jvd2R8ZW58MXx8fHwxNzcxMDcyMzcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    caption: "Half marathon crowd",
    photographer: "Ola Nordmann",
  },
  {
    id: "p6",
    raceId: "b1000000-0000-0000-0000-000000000028",
    url: "https://images.unsplash.com/photo-1657460684508-7c8fa5ba748b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydW5uaW5nJTIwcmFjZSUyMHN0YXJ0JTIwbGluZXxlbnwxfHx8fDE3NzEwNzIzNzB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    caption: "Race start excitement",
    photographer: "Ola Nordmann",
  },
];
