import { useQuery } from "@tanstack/react-query";

export interface GameRule {
  position: number;
  label: string;
  points: number;
}

export interface GameResult {
  participantId: number;
  position: number;
  points: number;
}

export interface Game {
  id: number;
  name: string;
  date: string;
  description?: string;
  icon?: string;
  rules?: GameRule[];
  results: GameResult[];
}

export interface GamesData {
  updatedAt: string;
  defaultRules: GameRule[];
  games: Game[];
}

/**
 * Hook to fetch games data from the games.json file
 */
export const useGamesData = () => {
  return useQuery<GamesData>({
    queryKey: ["games"],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.BASE_URL}data/games.json`);

      if (!response.ok) {
        throw new Error("Failed to fetch games data");
      }

      return response.json();
    },
    // Cache for 1 hour
    staleTime: 1000 * 60 * 60,
  });
};
