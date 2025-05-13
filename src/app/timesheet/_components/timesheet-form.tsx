"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import toast from "react-hot-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/date-time-picker";
import { add } from "date-fns";

type TimesheetFormProps = {
  groupId: string;
  name?: string;
  timeFrom?: Date;
  timeTo?: Date;
  onClose?: () => void;
};

const formSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    timeFrom: z.date(),
    timeTo: z.date(),
  })
  .refine((data) => data.timeTo > data.timeFrom, {
    message: "End time must be after start time",
    path: ["timeTo"], // This will attach the error to the timeTo field
  });

export const TimesheetForm = ({ groupId, name, timeFrom, timeTo, onClose }: TimesheetFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name,
      timeFrom,
      timeTo,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post("/api/timesheetitems", { ...values, groupId });
      toast.success("Timesheet item created");
      if (onClose) onClose();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const onCancel = () => {
    if (onClose) onClose();
  };

  const timeFromChange = () => {
    const timeFromValue = form.getValues("timeFrom");
    const timeToValue = add(timeFromValue, { minutes: 60 });
    form.setValue("timeTo", timeToValue);
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Név</FormLabel>
                <FormControl>
                  <Input disabled={isSubmitting} placeholder="neved" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DateTimePicker name="timeFrom" form={form} label="Érkezés" onChange={timeFromChange} />
          <DateTimePicker name="timeTo" form={form} label="Távozás" />
          <div className="flex justify-end items-center gap-x-2">
            <Button type="button" onClick={onCancel} variant="outline">
              Mégse
            </Button>
            <Button type="submit" disabled={!isValid || isSubmitting}>
              Mentés
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
