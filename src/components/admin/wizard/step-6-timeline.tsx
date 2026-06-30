"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TimelineEventFormData, SHIPMENT_STATUSES } from "@/types/wizard";
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  CalendarClock,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  location: z.string(),
  eventDate: z.string().min(1, "Date is required"),
  status: z.string().min(1, "Status is required"),
});

type EventFormValues = z.infer<typeof eventSchema>;

interface Props {
  data: TimelineEventFormData[];
  onComplete: (data: TimelineEventFormData[]) => void;
  onBack: () => void;
}

export function Step6Timeline({ data, onComplete, onBack }: Props) {
  const [events, setEvents] = useState<TimelineEventFormData[]>(data);
  const [adding, setAdding] = useState(false);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      eventDate: "",
      status: "In Transit",
    },
  });

  function addEvent(values: EventFormValues) {
    setEvents((prev) => [
      ...prev,
      {
        ...values,
        id: crypto.randomUUID(),
        sequence: prev.length + 1,
      },
    ]);
    form.reset({
      title: "",
      description: "",
      location: "",
      eventDate: "",
      status: "In Transit",
    });
    setAdding(false);
  }

  function remove(id: string) {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }

  function moveUp(index: number) {
    if (index === 0) return;
    setEvents((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next.map((e, i) => ({ ...e, sequence: i + 1 }));
    });
  }

  function moveDown(index: number) {
    setEvents((prev) => {
      if (index === prev.length - 1) return prev;
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next.map((e, i) => ({ ...e, sequence: i + 1 }));
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Timeline Events</h2>
        <p className="text-sm text-muted-foreground">
          Add shipment history events in chronological order.{" "}
          <span className="font-medium">This step is optional.</span>
        </p>
      </div>

      {events.length > 0 ? (
        <div className="space-y-2">
          {events.map((ev, index) => (
            <div
              key={ev.id}
              className="flex items-start gap-3 rounded-lg border px-3 py-2.5"
            >
              <div className="flex-none mt-0.5">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                  {index + 1}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{ev.title}</p>
                <p className="text-xs text-muted-foreground">
                  {ev.eventDate}
                  {ev.location ? ` · ${ev.location}` : ""}
                  {" · "}
                  <span className="font-medium">{ev.status}</span>
                </p>
                {ev.description && (
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                    {ev.description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => moveUp(index)}
                  disabled={index === 0}
                >
                  <ChevronUp className="h-3 w-3" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => moveDown(index)}
                  disabled={index === events.length - 1}
                >
                  <ChevronDown className="h-3 w-3" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive hover:text-destructive"
                  onClick={() => remove(ev.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !adding && (
          <div className="rounded-lg border border-dashed py-10 text-center">
            <CalendarClock className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              No events yet. Add the first timeline event below.
            </p>
          </div>
        )
      )}

      {adding ? (
        <div className="rounded-lg border bg-muted/30 p-4 space-y-4">
          <p className="text-sm font-medium">New Timeline Event</p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(addEvent)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Title</FormLabel>
                      <Input placeholder="Package picked up" {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="eventDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date & Time</FormLabel>
                      <Input type="datetime-local" {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={(val) => field.onChange(val ?? "")}
                      >
                        <SelectTrigger
                          className={fieldState.error ? "border-destructive" : ""}
                        >
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {SHIPMENT_STATUSES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Location{" "}
                        <span className="text-muted-foreground">(optional)</span>
                      </FormLabel>
                      <Input placeholder="London, UK" {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>
                        Description{" "}
                        <span className="text-muted-foreground">(optional)</span>
                      </FormLabel>
                      <Textarea
                        placeholder="Additional details..."
                        rows={2}
                        {...field}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" size="sm">
                  Add Event
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    form.reset();
                    setAdding(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => setAdding(true)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Timeline Event
        </Button>
      )}

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button onClick={() => onComplete(events)}>
          Next <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
