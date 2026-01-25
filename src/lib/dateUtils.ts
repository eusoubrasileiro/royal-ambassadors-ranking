/**
 * Format a date string to short Portuguese format (e.g., "25 jan. 2026")
 */
export const formatDateShort = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};
