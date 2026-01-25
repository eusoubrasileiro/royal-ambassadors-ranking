import { Participant } from '@/types/config';

/**
 * Get participant name by ID from the participants array
 */
export const getParticipantName = (
  participants: Participant[] | undefined,
  participantId: number
): string => {
  const participant = participants?.find(p => p.id === participantId);
  return participant?.name || `Participante #${participantId}`;
};
