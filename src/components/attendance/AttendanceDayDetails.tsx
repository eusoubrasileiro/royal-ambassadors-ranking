import { CalendarDays, Users } from 'lucide-react';
import type { Participant, AttendanceRecord } from '@/hooks/useLeaderboardData';
import {
  formatDatePt,
  getAttendanceByDate,
  getActivityTypeInfo,
  ATTENDANCE_POINTS
} from '@/lib/attendanceUtils';

interface AttendanceDayDetailsProps {
  selectedDate: Date | undefined;
  participants: Participant[];
  selectedParticipantId?: number | null;
}

interface GroupedAttendance {
  type: string;
  participants: { participant: Participant; record: AttendanceRecord }[];
}

export function AttendanceDayDetails({
  selectedDate,
  participants,
  selectedParticipantId
}: AttendanceDayDetailsProps) {
  if (!selectedDate) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center">
        <CalendarDays className="w-12 h-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Selecione uma data
        </h3>
        <p className="text-sm text-muted-foreground">
          Clique em um dia no calendario para ver os detalhes de presenca
        </p>
      </div>
    );
  }

  // Get attendance for the selected date
  let attendance = getAttendanceByDate(participants, selectedDate);

  // If a participant is selected, filter to show only their attendance
  if (selectedParticipantId) {
    attendance = attendance.filter(a => a.participant.id === selectedParticipantId);
  }

  // Group attendance by activity type
  const groupedByType: GroupedAttendance[] = [];
  const typeMap = new Map<string, { participant: Participant; record: AttendanceRecord }[]>();

  attendance.forEach(item => {
    const existing = typeMap.get(item.record.type);
    if (existing) {
      existing.push(item);
    } else {
      typeMap.set(item.record.type, [item]);
    }
  });

  typeMap.forEach((items, type) => {
    groupedByType.push({ type, participants: items });
  });

  // Sort by type name
  groupedByType.sort((a, b) => a.type.localeCompare(b.type));

  const totalAttendances = attendance.length;
  const totalPoints = totalAttendances * ATTENDANCE_POINTS;

  return (
    <div className="h-full flex flex-col">
      {/* Header with date */}
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold text-foreground">
          {formatDatePt(selectedDate)}
        </h3>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {groupedByType.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <Users className="w-10 h-10 text-muted-foreground mb-3" />
            <p className="text-muted-foreground">
              Nenhuma presenca registrada
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {groupedByType.map(group => {
              const typeInfo = getActivityTypeInfo(group.type);
              const uniqueParticipants = Array.from(
                new Map(group.participants.map(p => [p.participant.id, p.participant])).values()
              );

              return (
                <div
                  key={group.type}
                  className="card-royal p-4"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-3 h-3 rounded-full ${typeInfo.bgClass}`} />
                    <h4 className={`font-semibold ${typeInfo.colorClass}`}>
                      {typeInfo.label}
                    </h4>
                    <span className="text-sm text-muted-foreground">
                      ({uniqueParticipants.length})
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {uniqueParticipants.map(participant => (
                      <span
                        key={participant.id}
                        className="px-3 py-1 rounded-full bg-muted text-sm text-foreground"
                      >
                        {participant.name}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer with totals */}
      {totalAttendances > 0 && (
        <div className="p-4 border-t bg-muted/30">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Total: {totalAttendances} presenca{totalAttendances !== 1 ? 's' : ''}
            </span>
            <span className="font-semibold text-accent">
              +{totalPoints} pontos
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
