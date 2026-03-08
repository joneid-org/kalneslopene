// Mock data for the race results application

export interface Race {
  id: string;
  name: string;
  date: string;
  location: string;
  distance: string;
  participants: number;
  imageUrl: string;
  week: number;
  weatherConditions?: string;
  highlights?: string;
}

export interface Result {
  id: string;
  raceId: string;
  runnerId: string;
  runnerName: string;
  time: string;
  position: number;
  ageGroup: string;
  gender: "M" | "F";
}

export interface Runner {
  id: string;
  name: string;
  email: string;
  ageGroup: string;
  gender: "M" | "F";
}

export interface Photo {
  id: string;
  raceId: string;
  url: string;
  caption: string;
}

export const races: Race[] = [
  // 2026 Races
  {
    id: "race-1",
    name: "Thursday Evening Run",
    date: "2026-02-12",
    location: "City Park Loop",
    distance: "5km",
    participants: 45,
    week: 7,
    weatherConditions: "Clear skies, 18°C",
    highlights:
      "Great turnout this week! Sarah Johnson set a new personal best.",
    imageUrl:
      "https://images.unsplash.com/photo-1692170226404-969b6e5cde95?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJhdGhvbiUyMHJ1bm5lcnMlMjByYWNlJTIwZmluaXNoJTIwbGluZXxlbnwxfHx8fDE3NzEwNzIzNjl8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "race-2",
    name: "Thursday Evening Run",
    date: "2026-02-05",
    location: "City Park Loop",
    distance: "5km",
    participants: 42,
    week: 6,
    weatherConditions: "Partly cloudy, 16°C",
    highlights:
      "Michael Chen took first place with an impressive time. Welcome to our 3 new runners!",
    imageUrl:
      "https://images.unsplash.com/photo-1731991027003-386ac5ae9c72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFpbCUyMHJ1bm5pbmclMjByYWNlJTIwbW91bnRhaW5zfGVufDF8fHx8MTc3MTA3MjM2OXww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "race-3",
    name: "Thursday Evening Run",
    date: "2026-01-29",
    location: "City Park Loop",
    distance: "5km",
    participants: 38,
    week: 5,
    weatherConditions: "Light rain, 14°C",
    highlights:
      "Despite the rain, everyone showed up! Tough conditions made for challenging times.",
    imageUrl:
      "https://images.unsplash.com/photo-1769867628770-10a544d2a02c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHw1ayUyMHJhY2UlMjBwYXJ0aWNpcGFudHN8ZW58MXx8fHwxNzcxMDcyMzcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "race-4",
    name: "Thursday Evening Run",
    date: "2026-01-22",
    location: "City Park Loop",
    distance: "5km",
    participants: 51,
    week: 4,
    weatherConditions: "Sunny, 20°C",
    highlights:
      "Record attendance! Perfect weather brought out the best in everyone.",
    imageUrl:
      "https://images.unsplash.com/photo-1745818016652-a890846ed361?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwbWFyYXRob24lMjBydW5uZXJzJTIwY3Jvd2R8ZW58MXx8fHwxNzcxMDcyMzcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
  },

  // 2025 Races
  {
    id: "race-5",
    name: "Thursday Evening Run",
    date: "2025-12-18",
    location: "City Park Loop",
    distance: "5km",
    participants: 47,
    week: 51,
    weatherConditions: "Cold, 8°C",
    highlights: "Last race of 2025! Great year everyone.",
    imageUrl:
      "https://images.unsplash.com/photo-1657460684508-7c8fa5ba748b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydW5uaW5nJTIwcmFjZSUyMHN0YXJ0JTIwbGluZXxlbnwxfHx8fDE3NzEwNzIzNzB8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "race-6",
    name: "Thursday Evening Run",
    date: "2025-12-11",
    location: "City Park Loop",
    distance: "5km",
    participants: 44,
    week: 50,
    weatherConditions: "Overcast, 12°C",
    highlights: "Holiday season is here but runners keep showing up!",
    imageUrl:
      "https://images.unsplash.com/photo-1766970096331-78c8af007a3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydW5uZXJzJTIwY3Jvc3NpbmclMjBmaW5pc2glMjBsaW5lfGVufDF8fHx8MTc3MTA3MjM3MHww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "race-7",
    name: "Thursday Evening Run",
    date: "2025-11-20",
    location: "City Park Loop",
    distance: "5km",
    participants: 49,
    week: 47,
    weatherConditions: "Clear, 15°C",
    highlights: "Perfect autumn running weather!",
    imageUrl:
      "https://images.unsplash.com/photo-1692170226404-969b6e5cde95?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJhdGhvbiUyMHJ1bm5lcnMlMjByYWNlJTIwZmluaXNoJTIwbGluZXxlbnwxfHx8fDE3NzEwNzIzNjl8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "race-8",
    name: "Thursday Evening Run",
    date: "2025-06-12",
    location: "City Park Loop",
    distance: "5km",
    participants: 52,
    week: 24,
    weatherConditions: "Warm, 24°C",
    highlights: "Summer is here! Record turnout for June.",
    imageUrl:
      "https://images.unsplash.com/photo-1731991027003-386ac5ae9c72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFpbCUyMHJ1bm5pbmclMjByYWNlJTIwbW91bnRhaW5zfGVufDF8fHx8MTc3MTA3MjM2OXww&ixlib=rb-4.1.0&q=80&w=1080",
  },

  // 2024 Races
  {
    id: "race-9",
    name: "Thursday Evening Run",
    date: "2024-12-19",
    location: "City Park Loop",
    distance: "5km",
    participants: 41,
    week: 51,
    weatherConditions: "Chilly, 6°C",
    highlights: "Year end celebration run!",
    imageUrl:
      "https://images.unsplash.com/photo-1769867628770-10a544d2a02c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHw1ayUyMHJhY2UlMjBwYXJ0aWNpcGFudHN8ZW58MXx8fHwxNzcxMDcyMzcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "race-10",
    name: "Thursday Evening Run",
    date: "2024-07-18",
    location: "City Park Loop",
    distance: "5km",
    participants: 48,
    week: 29,
    weatherConditions: "Hot, 28°C",
    highlights: "Hottest race of the year! Everyone stayed hydrated.",
    imageUrl:
      "https://images.unsplash.com/photo-1745818016652-a890846ed361?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwbWFyYXRob24lMjBydW5uZXJzJTIwY3Jvd2R8ZW58MXx8fHwxNzcxMDcyMzcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "race-11",
    name: "Thursday Evening Run",
    date: "2024-03-14",
    location: "City Park Loop",
    distance: "5km",
    participants: 39,
    week: 11,
    weatherConditions: "Spring weather, 17°C",
    highlights: "Spring has sprung! Beautiful conditions for running.",
    imageUrl:
      "https://images.unsplash.com/photo-1657460684508-7c8fa5ba748b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydW5uaW5nJTIwcmFjZSUyMHN0YXJ0JTIwbGluZXxlbnwxfHx8fDE3NzEwNzIzNzB8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

export const results: Result[] = [
  // Week 7 (Feb 13, 2026)
  {
    id: "r1",
    raceId: "race-1",
    runnerId: "runner-1",
    runnerName: "Sarah Johnson",
    time: "22:15",
    position: 1,
    ageGroup: "30-39",
    gender: "F",
  },
  {
    id: "r2",
    raceId: "race-1",
    runnerId: "runner-2",
    runnerName: "Michael Chen",
    time: "19:45",
    position: 1,
    ageGroup: "30-39",
    gender: "M",
  },
  {
    id: "r3",
    raceId: "race-1",
    runnerId: "runner-3",
    runnerName: "Emily Rodriguez",
    time: "23:10",
    position: 2,
    ageGroup: "25-29",
    gender: "F",
  },
  {
    id: "r4",
    raceId: "race-1",
    runnerId: "runner-4",
    runnerName: "David Thompson",
    time: "20:30",
    position: 2,
    ageGroup: "40-49",
    gender: "M",
  },
  {
    id: "r5",
    raceId: "race-1",
    runnerId: "runner-5",
    runnerName: "Lisa Martinez",
    time: "24:05",
    position: 3,
    ageGroup: "30-39",
    gender: "F",
  },
  {
    id: "r6",
    raceId: "race-1",
    runnerId: "runner-6",
    runnerName: "James Wilson",
    time: "21:15",
    position: 3,
    ageGroup: "25-29",
    gender: "M",
  },

  // Week 6 (Feb 6, 2026)
  {
    id: "r7",
    raceId: "race-2",
    runnerId: "runner-2",
    runnerName: "Michael Chen",
    time: "19:30",
    position: 1,
    ageGroup: "30-39",
    gender: "M",
  },
  {
    id: "r8",
    raceId: "race-2",
    runnerId: "runner-1",
    runnerName: "Sarah Johnson",
    time: "22:45",
    position: 1,
    ageGroup: "30-39",
    gender: "F",
  },
  {
    id: "r9",
    raceId: "race-2",
    runnerId: "runner-4",
    runnerName: "David Thompson",
    time: "20:15",
    position: 2,
    ageGroup: "40-49",
    gender: "M",
  },
  {
    id: "r10",
    raceId: "race-2",
    runnerId: "runner-3",
    runnerName: "Emily Rodriguez",
    time: "23:25",
    position: 2,
    ageGroup: "25-29",
    gender: "F",
  },

  // Week 5 (Jan 30, 2026)
  {
    id: "r11",
    raceId: "race-3",
    runnerId: "runner-2",
    runnerName: "Michael Chen",
    time: "20:55",
    position: 1,
    ageGroup: "30-39",
    gender: "M",
  },
  {
    id: "r12",
    raceId: "race-3",
    runnerId: "runner-1",
    runnerName: "Sarah Johnson",
    time: "24:20",
    position: 1,
    ageGroup: "30-39",
    gender: "F",
  },
  {
    id: "r13",
    raceId: "race-3",
    runnerId: "runner-6",
    runnerName: "James Wilson",
    time: "21:40",
    position: 2,
    ageGroup: "25-29",
    gender: "M",
  },

  // Week 4 (Jan 23, 2026)
  {
    id: "r14",
    raceId: "race-4",
    runnerId: "runner-1",
    runnerName: "Sarah Johnson",
    time: "22:35",
    position: 1,
    ageGroup: "30-39",
    gender: "F",
  },
  {
    id: "r15",
    raceId: "race-4",
    runnerId: "runner-4",
    runnerName: "David Thompson",
    time: "19:50",
    position: 1,
    ageGroup: "40-49",
    gender: "M",
  },
  {
    id: "r16",
    raceId: "race-4",
    runnerId: "runner-3",
    runnerName: "Emily Rodriguez",
    time: "23:15",
    position: 2,
    ageGroup: "25-29",
    gender: "F",
  },
  {
    id: "r17",
    raceId: "race-4",
    runnerId: "runner-2",
    runnerName: "Michael Chen",
    time: "20:05",
    position: 2,
    ageGroup: "30-39",
    gender: "M",
  },

  // Week 3 (Jan 16, 2026)
  {
    id: "r18",
    raceId: "race-5",
    runnerId: "runner-2",
    runnerName: "Michael Chen",
    time: "19:40",
    position: 1,
    ageGroup: "30-39",
    gender: "M",
  },
  {
    id: "r19",
    raceId: "race-5",
    runnerId: "runner-1",
    runnerName: "Sarah Johnson",
    time: "22:50",
    position: 1,
    ageGroup: "30-39",
    gender: "F",
  },
  {
    id: "r20",
    raceId: "race-5",
    runnerId: "runner-3",
    runnerName: "Emily Rodriguez",
    time: "23:00",
    position: 2,
    ageGroup: "25-29",
    gender: "F",
  },

  // Week 2 (Jan 9, 2026)
  {
    id: "r21",
    raceId: "race-6",
    runnerId: "runner-2",
    runnerName: "Michael Chen",
    time: "20:10",
    position: 1,
    ageGroup: "30-39",
    gender: "M",
  },
  {
    id: "r22",
    raceId: "race-6",
    runnerId: "runner-1",
    runnerName: "Sarah Johnson",
    time: "23:20",
    position: 1,
    ageGroup: "30-39",
    gender: "F",
  },
  {
    id: "r23",
    raceId: "race-6",
    runnerId: "runner-4",
    runnerName: "David Thompson",
    time: "20:45",
    position: 2,
    ageGroup: "40-49",
    gender: "M",
  },
];

export const photos: Photo[] = [
  {
    id: "p1",
    raceId: "race-1",
    url: "https://images.unsplash.com/photo-1692170226404-969b6e5cde95?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJhdGhvbiUyMHJ1bm5lcnMlMjByYWNlJTIwZmluaXNoJTIwbGluZXxlbnwxfHx8fDE3NzEwNzIzNjl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    caption: "Marathon finish line celebration",
  },
  {
    id: "p2",
    raceId: "race-1",
    url: "https://images.unsplash.com/photo-1766970096331-78c8af007a3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydW5uZXJzJTIwY3Jvc3NpbmclMjBmaW5pc2glMjBsaW5lfGVufDF8fHx8MTc3MTA3MjM3MHww&ixlib=rb-4.1.0&q=80&w=1080",
    caption: "Runners crossing the finish line",
  },
  {
    id: "p3",
    raceId: "race-1",
    url: "https://images.unsplash.com/photo-1731991027003-386ac5ae9c72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFpbCUyMHJ1bm5pbmclMjByYWNlJTIwbW91bnRhaW5zfGVufDF8fHx8MTc3MTA3MjM2OXww&ixlib=rb-4.1.0&q=80&w=1080",
    caption: "Mountain trail scenic views",
  },
  {
    id: "p4",
    raceId: "race-1",
    url: "https://images.unsplash.com/photo-1769867628770-10a544d2a02c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHw1ayUyMHJhY2UlMjBwYXJ0aWNpcGFudHN8ZW58MXx8fHwxNzcxMDcyMzcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    caption: "5K participants starting strong",
  },
  {
    id: "p5",
    raceId: "race-1",
    url: "https://images.unsplash.com/photo-1745818016652-a890846ed361?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwbWFyYXRob24lMjBydW5uZXJzJTIwY3Jvd2R8ZW58MXx8fHwxNzcxMDcyMzcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    caption: "Half marathon crowd",
  },
  {
    id: "p6",
    raceId: "race-1",
    url: "https://images.unsplash.com/photo-1657460684508-7c8fa5ba748b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydW5uaW5nJTIwcmFjZSUyMHN0YXJ0JTIwbGluZXxlbnwxfHx8fDE3NzEwNzIzNzB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    caption: "Race start excitement",
  },
];

// Current logged-in runner (for demo purposes)
export const currentRunner: Runner = {
  id: "runner-1",
  name: "Sarah Johnson",
  email: "sarah.johnson@email.com",
  ageGroup: "30-39",
  gender: "F",
};

// Helper functions
export const getRaceResults = (raceId: string) => {
  return results
    .filter((r) => r.raceId === raceId)
    .sort((a, b) => a.position - b.position);
};

export const getRunnerResults = (runnerId: string) => {
  return results.filter((r) => r.runnerId === runnerId);
};

export const getRunnerResultsByName = (runnerName: string) => {
  return results.filter(
    (r) => r.runnerName.toLowerCase() === runnerName.toLowerCase(),
  );
};

export const getAllUniqueRunners = () => {
  const uniqueRunners = new Map<string, { id: string; name: string }>();
  results.forEach((result) => {
    if (!uniqueRunners.has(result.runnerId)) {
      uniqueRunners.set(result.runnerId, {
        id: result.runnerId,
        name: result.runnerName,
      });
    }
  });
  return Array.from(uniqueRunners.values()).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
};

export const getRacePhotos = (raceId: string) => {
  return photos.filter((p) => p.raceId === raceId);
};

export const getRunnerStats = (runnerId: string) => {
  const runnerResults = getRunnerResults(runnerId);
  const racesCompleted = runnerResults.length;
  const bestTime = runnerResults.reduce((best, current) => {
    // For comparison purposes, convert times to seconds
    return current.position < best.position ? current : best;
  }, runnerResults[0]);

  return {
    racesCompleted,
    bestResult: bestTime,
    totalDistance: runnerResults.reduce((total, result) => {
      const race = races.find((r) => r.id === result.raceId);
      const distance = parseFloat(race?.distance || "0");
      return total + distance;
    }, 0),
  };
};

export const getOverallStats = () => {
  const uniqueRunners = getAllUniqueRunners();
  const totalRaces = races.length;

  // Get fastest overall time (convert time strings to comparable format)
  const timeToSeconds = (time: string) => {
    const parts = time.split(":");
    if (parts.length === 2) {
      return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    }
    return 0;
  };

  const fastestResult = results.reduce((fastest, current) => {
    if (!fastest) return current;
    return timeToSeconds(current.time) < timeToSeconds(fastest.time)
      ? current
      : fastest;
  }, results[0]);

  // Calculate average participation
  const avgParticipation =
    races.reduce((sum, race) => sum + race.participants, 0) / races.length;

  return {
    totalRunners: uniqueRunners.length,
    totalRaces,
    fastestTime: fastestResult,
    avgParticipation: Math.round(avgParticipation),
  };
};

// Get all unique years from races
export const getAvailableYears = (): number[] => {
  const years = new Set<number>();
  races.forEach((race) => {
    const year = new Date(race.date).getFullYear();
    years.add(year);
  });
  return Array.from(years).sort((a, b) => b - a); // Sort descending
};

// Get races by year
export const getRacesByYear = (year: number): Race[] => {
  return races
    .filter((race) => {
      const raceYear = new Date(race.date).getFullYear();
      return raceYear === year;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort by date descending
};

// Get the latest race
export const getLatestRace = (): Race => {
  return races.reduce((latest, current) => {
    return new Date(current.date) > new Date(latest.date) ? current : latest;
  }, races[0]);
};

// Get photos by year
export const getPhotosByYear = (year: number): Photo[] => {
  const racesInYear = getRacesByYear(year);
  const raceIds = racesInYear.map((r) => r.id);
  return photos.filter((photo) => raceIds.includes(photo.raceId));
};
