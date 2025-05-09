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

type TimesheetFormProps = {
  name?: string;
  timeFrom?: Date;
  timeTo?: Date;
  onClose?: () => void;
};

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  timeFrom: z.date(),
  timeTo: z.date(),
});

export const TimesheetForm = ({ name, timeFrom, timeTo, onClose }: TimesheetFormProps) => {
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
      await axios.post("/api/timesheetitems", values);
      toast.success("Timesheet item created");
      if (onClose) onClose();
    } catch {
      toast.error("Something went wrong");
    }
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
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input disabled={isSubmitting} placeholder="your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DateTimePicker name="timeFrom" form={form} label="From" />
          <DateTimePicker name="timeTo" form={form} label="To" />
          <div className="flex justify-end items-center gap-x-2">
            <Button type="submit" disabled={!isValid || isSubmitting}>
              Save changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
