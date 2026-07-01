import type { StatusLog } from "@/lib/types";
import { getStatusLabel, getStatusColor } from "@/lib/utils";

interface StatusTimelineProps {
  logs: StatusLog[];
  currentStatus: string;
  allStatuses: string[];
}

export default function StatusTimeline({ logs, currentStatus, allStatuses }: StatusTimelineProps) {
  const currentIndex = allStatuses.indexOf(currentStatus);

  return (
    <div className="space-y-3">
      {allStatuses.map((status, idx) => {
        const log = logs.find((l) => l.status === status);
        const isPast = idx <= currentIndex;
        const isCurrent = idx === currentIndex;

        return (
          <div key={status} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={`w-3 h-3 rounded-full border-2 ${
                  isPast
                    ? "bg-blue-600 border-blue-600"
                    : "bg-white border-slate-300"
                } ${isCurrent ? "ring-2 ring-blue-200" : ""}`}
              />
              {idx < allStatuses.length - 1 && (
                <div
                  className={`w-0.5 h-8 ${isPast ? "bg-blue-600" : "bg-slate-200"}`}
                />
              )}
            </div>
            <div className="pb-3">
              <p className={`text-sm font-medium ${isPast ? "text-slate-900" : "text-slate-400"}`}>
                {getStatusLabel(status)}
              </p>
              {log && (
                <div className="mt-0.5 space-y-0.5">
                  <p className="text-xs text-slate-500">
                    {new Date(log.createdAt).toLocaleString("en-IN", {
                      day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                    })}
                  </p>
                  {log.note && <p className="text-xs text-slate-600 italic">&ldquo;{log.note}&rdquo;</p>}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
