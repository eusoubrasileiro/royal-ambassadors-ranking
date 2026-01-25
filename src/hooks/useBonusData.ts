import { useQuery } from "@tanstack/react-query";

export interface BonusResult {
  participantId: number;
  points: number;
}

export interface BonusChallenge {
  id: number;
  name: string;
  date: string;
  description?: string;
  icon?: string;
  results: BonusResult[];
}

export interface BonusData {
  updatedAt: string;
  challenges: BonusChallenge[];
}

/**
 * Hook to fetch bonus data from the bonus.json file
 */
export const useBonusData = () => {
  return useQuery<BonusData>({
    queryKey: ["bonus"],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.BASE_URL}data/bonus.json`);

      if (!response.ok) {
        throw new Error("Failed to fetch bonus data");
      }

      return response.json();
    },
    // Cache for 1 hour
    staleTime: 1000 * 60 * 60,
  });
};
