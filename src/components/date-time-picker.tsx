"use client";

import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { Controller, FieldValues, Path, PathValue, UseFormReturn } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { FormControl, FormDescription, FormItem, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useState } from "react";

type DateTimePickerProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  name: Path<T>;
};

export function DateTimePicker<T extends FieldValues>({ form, name }: DateTimePickerProps<T>) {
  const [open, setOpen] = useState(false);

  function handleDateSelect(date: Date | undefined) {
    if (date) {
      const currentDate = form.getValues(name) || new Date();
      const newDate = new Date(date);
      newDate.setHours(currentDate.getHours());
      newDate.setMinutes(currentDate.getMinutes());
      form.setValue(name, newDate as PathValue<T, typeof name>);
    }
  }

  function handleTimeChange(type: "hour" | "minute", value: string) {
    const currentDate = form.getValues(name) || new Date();
    const newDate = new Date(currentDate);

    if (type === "hour") {
      const hour = parseInt(value, 10);
      newDate.setHours(hour);
    } else if (type === "minute") {
      newDate.setMinutes(parseInt(value, 10));
    }

    form.setValue(name, newDate as PathValue<T, typeof name>);
  }

  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                  {field.value ? format(field.value, "yyyy-MM-dd HH:mm") : <span>YYYY-MM-DD HH:mm</span>}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <div className="flex flex-col">
                <div className="sm:flex">
                  <Calendar mode="single" selected={field.value} onSelect={handleDateSelect} initialFocus />
                  <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                    <ScrollArea className="w-64 sm:w-auto">
                      <div className="flex sm:flex-col p-2">
                        {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                          <Button
                            key={hour}
                            size="icon"
                            variant={field.value && field.value.getHours() === hour ? "default" : "ghost"}
                            className="sm:w-full shrink-0 aspect-square"
                            onClick={() => handleTimeChange("hour", hour.toString())}>
                            {hour}
                          </Button>
                        ))}
                      </div>
                      <ScrollBar orientation="horizontal" className="sm:hidden" />
                    </ScrollArea>
                    <ScrollArea className="w-64 sm:w-auto">
                      <div className="flex sm:flex-col p-2">
                        {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                          <Button
                            key={minute}
                            size="icon"
                            variant={field.value && field.value.getMinutes() === minute ? "default" : "ghost"}
                            className="sm:w-full shrink-0 aspect-square"
                            onClick={() => handleTimeChange("minute", minute.toString())}>
                            {minute.toString().padStart(2, "0")}
                          </Button>
                        ))}
                      </div>
                      <ScrollBar orientation="horizontal" className="sm:hidden" />
                    </ScrollArea>
                  </div>
                </div>
                <div className="m-3">
                  <Button onClick={() => setOpen(false)}>Ok</Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <FormDescription />
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
