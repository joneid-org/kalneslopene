// import {ActivityIcon} from "lucide-react";
// import {Badge} from "@/components/ui/badge.tsx";
// import {Card, CardContent, CardHeader, CardTitle,} from "@/components/ui/card.tsx";
//
// export default function RunnerHistoryTable() {
//   return (
//     <Card>
//       <CardHeader className="pb-2">
//         <CardTitle className="text-base flex items-center gap-2">
//           <ActivityIcon className="size-4 text-primary" />
//           Løpshistorikk
//           {runnerYear && (
//             <Badge variant="secondary" className="ml-1">
//               {runnerYear}
//             </Badge>
//           )}
//         </CardTitle>
//       </CardHeader>
//       <CardContent className="p-0">
//         {stats.raceHistory.length === 0 ? (
//           <p className="text-sm text-muted-foreground px-6 py-4">
//             Ingen løp registrert for valgt sesong.
//           </p>
//         ) : (
//           <ul className="divide-y divide-border">
//             {stats.raceHistory.map(({ race, result }) => (
//               <li
//                 key={result.id}
//                 className="flex items-center justify-between px-6 py-3 gap-4"
//               >
//                 <div className="min-w-0">
//                   <p className="text-sm font-medium">
//                     {new Date(race.date).toLocaleDateString("nb-NO", {
//                       weekday: "short",
//                       day: "numeric",
//                       month: "short",
//                       year: "numeric",
//                     })}
//                   </p>
//                   <p className="text-xs text-muted-foreground">
//                     Uke {race.week} · {race.location}
//                   </p>
//                 </div>
//                 <div className="flex items-center gap-3 shrink-0">
//                   <span className="text-sm tabular-nums font-mono">
//                     {result.time}
//                   </span>
//                   <Badge
//                     variant={result.position === 1 ? "default" : "secondary"}
//                     className="w-10 justify-center"
//                   >
//                     #{result.position}
//                   </Badge>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         )}
//       </CardContent>
//     </Card>
//   );
// }
