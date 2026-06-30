"use client";

import { Fragment } from "react";
import { CheckCircle2, Circle, Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimelineEvent {
  _id: string;
  title: string;
  description?: string;
  location?: string;
  eventDate: string;
  status: string;
  sequence: number;
}

interface Props {
  events: TimelineEvent[];
}

function resolveCurrentIndex(sorted: TimelineEvent[]): number {
  const now = new Date();
  let last = -1;
  sorted.forEach((ev, i) => {
    const d = new Date(ev.eventDate);
    if (!isNaN(d.getTime()) && d <= now) last = i;
  });
  // If no past event, show first as current
  return last === -1 ? 0 : last;
}

export function TrackingTimeline({ events }: Props) {
  if (events.length === 0) return null;

  const sorted = [...events].sort((a, b) => a.sequence - b.sequence);
  const currentIdx = resolveCurrentIndex(sorted);

  return (
    <div className="rounded-xl border bg-card p-6">
      <h2 className="text-base font-semibold mb-6">Tracking History</h2>
      <div className="space-y-0">
        {sorted.map((event, i) => {
          const isCompleted = i < currentIdx;
          const isCurrent = i === currentIdx;
          const isUpcoming = i > currentIdx;
          const isLast = i === sorted.length - 1;

          return (
            <Fragment key={event._id}>
              <div className="flex gap-4">
                {/* Icon column */}
                <div className="flex flex-col items-center">
                  <div className="relative flex-shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="h-6 w-6 text-primary" />
                    ) : isCurrent ? (
                      <div className="relative">
                        <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                          <div className="h-2.5 w-2.5 rounded-full bg-primary-foreground" />
                        </div>
                        <div className="absolute inset-0 rounded-full bg-primary/25 animate-ping" />
                      </div>
                    ) : (
                      <Circle className="h-6 w-6 text-muted-foreground/30" />
                    )}
                  </div>
                  {/* Connector */}
                  {!isLast && (
                    <div
                      className={cn(
                        "w-0.5 flex-1 my-1.5",
                        isCompleted ? "bg-primary" : "bg-border"
                      )}
                      style={{ minHeight: "28px" }}
                    />
                  )}
                </div>

                {/* Content */}
                <div className={cn("pb-6 flex-1 min-w-0", isLast && "pb-0", isUpcoming && "opacity-45")}>
                  <div className="flex flex-wrap items-center gap-2 mb-0.5">
                    <p className={cn("font-medium text-sm leading-none", isCurrent && "text-primary")}>
                      {event.title}
                    </p>
                    {isCurrent && (
                      <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide">
                        Current
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {event.eventDate}
                    </span>
                    {event.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {event.location}
                      </span>
                    )}
                  </div>

                  {event.description && (
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {event.description}
                    </p>
                  )}
                </div>
              </div>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
