"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Group } from "@prisma/client";
import axios from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
});

type GroupFormProps = {
  initData?: Group;
  onClose?: () => void;
};

export const GroupForm = ({ initData, onClose }: GroupFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initData?.name || "",
    },
  });
  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (initData?.id) {
        await axios.patch(`/api/groups/${initData.id}`, values);
        toast.success("A csoport Módosítva lett");
      } else {
        await axios.post("/api/groups", values);
        toast.success("A csoport sikeresen létrejött");
      }
      if (onClose) onClose();
    } catch {
      toast.error("Hiba történt");
    }
  };

  const onCancel = () => {
    if (onClose) onClose();
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
                <FormLabel>Csoport neve</FormLabel>
                <FormControl>
                  <Input disabled={isSubmitting} placeholder="csoport neve" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
