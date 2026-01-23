import type { Rule, Participant, VersesData } from '@/hooks/useLeaderboardData';
import type { GamesData } from '@/hooks/useGamesData';

/**
 * Get point value for a rule by activityType
 */
function getRulePointsByActivityType(rules: Rule[], activityType: string): number {
  return rules.find(r => r.activityType === activityType)?.points ?? 0;
}

/**
 * Get point value for a rule by matching description pattern (fallback)
 */
function getRulePointsByPattern(rules: Rule[], pattern: string): number {
  return rules.find(r => r.description.toLowerCase().includes(pattern.toLowerCase()))?.points ?? 0;
}

/**
 * Expand a verse range (e.g., "Mt 6:9-13") to individual verses
 */
function expandVerseRange(ref: string): string[] {
  const match = ref.trim().match(/^([1-3]?\s?[A-Za-zÀ-ÿ]+)\s+(\d+):(\d+)-(\d+)$/);
  if (!match) return [ref];
  const [, book, chapter, startVerse, endVerse] = match;
  const start = parseInt(startVerse, 10);
  const end = parseInt(endVerse, 10);
  if (start > end) return [ref];
  const verses: string[] = [];
  for (let v = start; v <= end; v++) {
    verses.push(`${book} ${chapter}:${v}`);
  }
  return verses;
}

/**
 * Calculate total points for a participant based on their activity records.
 * Points are derived from rules.json values, making them configurable.
 *
 * This function is generic and works with any activity types defined in the config.
 */
export function calculateParticipantPoints(
  participant: Participant,
  rules: Rule[],
  versesData?: VersesData,
  selectedVersion: string = 'NVI',
  gamesData?: GamesData
): number {
  // Start with baseline points (frozen from before tracking system)
  let total = participant.startPoints ?? 0;

  // Attendance points - use activityType from rules
  participant.attendance?.forEach(a => {
    // First try to get points by activityType match
    const pointsByType = getRulePointsByActivityType(rules, a.type);
    if (pointsByType !== 0) {
      total += pointsByType;
    } else {
      // Fallback to pattern matching for backward compatibility
      if (a.type === 'embaixada') {
        total += getRulePointsByPattern(rules, 'embaixada');
      } else if (a.type === 'igreja') {
        total += getRulePointsByPattern(rules, 'compromissos');
      } else {
        // Generic activity type - try to match by type name
        total += getRulePointsByPattern(rules, a.type);
      }
    }
  });

  // Visitor points
  const visitorPts = getRulePointsByPattern(rules, 'visitante');
  total += (participant.visitors?.length ?? 0) * visitorPts;

  // Verse points - use word count from verses.json (only if feature is enabled)
  if (participant.memorizedVerses && participant.memorizedVerses.length > 0) {
    const smallVersePts = getRulePointsByPattern(rules, '<20') || 25;
    const largeVersePts = getRulePointsByPattern(rules, '>=20') || 35;

    participant.memorizedVerses.forEach(ref => {
      // Expand ranges (e.g., "Mt 6:9-13") to individual verses
      const expandedRefs = expandVerseRange(ref);
      expandedRefs.forEach(singleRef => {
        const wordCount = versesData?.verses[singleRef]?.[selectedVersion]?.wordCount;
        // If we have word count data, use it; otherwise default to small verse points
        if (wordCount !== undefined) {
          total += wordCount >= 20 ? largeVersePts : smallVersePts;
        } else {
          total += smallVersePts;
        }
      });
    });
  }

  // Candidato progress (Royal Ambassadors specific, but handles gracefully if not present)
  if (participant.candidatoProgress) {
    const prereqPts = getRulePointsByPattern(rules, 'pre-requisitos');
    const manualPts = getRulePointsByPattern(rules, 'tarefa manual');
    if (participant.candidatoProgress.prerequisites) total += prereqPts;
    total += (participant.candidatoProgress.manualTasks ?? 0) * manualPts;
  }

  // Discipline penalties (stored per record with specific point values)
  participant.disciplines?.forEach(d => {
    total += d.points;  // negative values
  });

  // Game points - sum all results for this participant
  gamesData?.games?.forEach(game => {
    game.results
      .filter(r => r.participantId === participant.id)
      .forEach(r => {
        total += r.points;
      });
  });

  return total;
}
