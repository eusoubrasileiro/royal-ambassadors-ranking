import { format, parseISO, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Participant, AttendanceRecord } from '@/hooks/useLeaderboardData';

// Points per attendance
export const ATTENDANCE_POINTS = 10;

/**
 * Get all attendance records for a specific date across all participants
 */
export function getAttendanceByDate(
  participants: Participant[],
  date: Date
): { participant: Participant; record: AttendanceRecord }[] {
  const results: { participant: Participant; record: AttendanceRecord }[] = [];

  participants.forEach(participant => {
    participant.attendance?.forEach(record => {
      if (isSameDay(parseISO(record.date), date)) {
        results.push({ participant, record });
      }
    });
  });

  return results;
}

/**
 * Get all dates where a specific participant has attendance
 */
export function getParticipantAttendanceDates(participant: Participant): Date[] {
  return (participant.attendance || []).map(record => parseISO(record.date));
}

/**
 * Get participant's attendance grouped by activity type
 */
export function getParticipantAttendanceByType(
  participant: Participant
): Record<string, AttendanceRecord[]> {
  const byType: Record<string, AttendanceRecord[]> = {};

  participant.attendance?.forEach(record => {
    if (!byType[record.type]) {
      byType[record.type] = [];
    }
    byType[record.type].push(record);
  });

  return byType;
}

/**
 * Format a date in Portuguese with weekday
 * e.g., "25 de Janeiro (Sábado)"
 */
export function formatDatePt(date: Date): string {
  const day = format(date, 'd', { locale: ptBR });
  const month = format(date, 'MMMM', { locale: ptBR });
  const weekday = format(date, 'EEEE', { locale: ptBR });

  // Capitalize first letter of month and weekday
  const monthCapitalized = month.charAt(0).toUpperCase() + month.slice(1);
  const weekdayCapitalized = weekday.charAt(0).toUpperCase() + weekday.slice(1);

  return `${day} de ${monthCapitalized} (${weekdayCapitalized})`;
}

/**
 * Format month and year in Portuguese
 * e.g., "Janeiro 2026"
 */
export function formatMonthYearPt(date: Date): string {
  const month = format(date, 'MMMM', { locale: ptBR });
  const year = format(date, 'yyyy');

  // Capitalize first letter of month
  const monthCapitalized = month.charAt(0).toUpperCase() + month.slice(1);

  return `${monthCapitalized} ${year}`;
}

/**
 * Get all unique dates with attendance for calendar highlighting
 */
export function getAllAttendanceDates(participants: Participant[]): Date[] {
  const dateSet = new Set<string>();

  participants.forEach(participant => {
    participant.attendance?.forEach(record => {
      dateSet.add(record.date);
    });
  });

  return Array.from(dateSet).map(d => parseISO(d));
}

/**
 * Get attendance dates grouped by activity type for calendar markers
 */
export function getAttendanceDatesByType(
  participants: Participant[]
): Record<string, Date[]> {
  const byType: Record<string, Set<string>> = {};

  participants.forEach(participant => {
    participant.attendance?.forEach(record => {
      if (!byType[record.type]) {
        byType[record.type] = new Set();
      }
      byType[record.type].add(record.date);
    });
  });

  const result: Record<string, Date[]> = {};
  Object.entries(byType).forEach(([type, dates]) => {
    result[type] = Array.from(dates).map(d => parseISO(d));
  });

  return result;
}

/**
 * Get calendar modifiers for react-day-picker based on attendance data
 */
export function getCalendarModifiers(
  participants: Participant[],
  activityTypes: string[]
): Record<string, Date[]> {
  const datesByType = getAttendanceDatesByType(participants);

  const modifiers: Record<string, Date[]> = {};

  activityTypes.forEach(type => {
    modifiers[type] = datesByType[type] || [];
  });

  return modifiers;
}

/**
 * Get attendance count by activity type for a specific date
 */
export function getAttendanceCountByDate(
  participants: Participant[],
  date: Date
): Record<string, number> {
  const counts: Record<string, number> = {};

  participants.forEach(participant => {
    participant.attendance?.forEach(record => {
      if (isSameDay(parseISO(record.date), date)) {
        if (!counts[record.type]) {
          counts[record.type] = 0;
        }
        counts[record.type]++;
      }
    });
  });

  return counts;
}

/**
 * Get total attendance count for a participant
 */
export function getTotalAttendanceCount(participant: Participant): number {
  return participant.attendance?.length || 0;
}

/**
 * Get total attendance points for a participant
 */
export function getTotalAttendancePoints(participant: Participant): number {
  return getTotalAttendanceCount(participant) * ATTENDANCE_POINTS;
}

/**
 * Get activity type display info (label, color class)
 */
export function getActivityTypeInfo(type: string): { label: string; colorClass: string; bgClass: string } {
  const typeMap: Record<string, { label: string; colorClass: string; bgClass: string }> = {
    embaixada: { label: 'Embaixada', colorClass: 'text-amber-500', bgClass: 'bg-amber-500' },
    igreja: { label: 'Igreja', colorClass: 'text-blue-500', bgClass: 'bg-blue-500' },
    pg: { label: 'PG', colorClass: 'text-emerald-500', bgClass: 'bg-emerald-500' },
  };

  return typeMap[type] || {
    label: type.charAt(0).toUpperCase() + type.slice(1),
    colorClass: 'text-gray-500',
    bgClass: 'bg-gray-500'
  };
}
