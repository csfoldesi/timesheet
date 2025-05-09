"use client";

import { Button } from "@/components/ui/button";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TimesheetItem } from "@prisma/client";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { add, format, formatDistance } from "date-fns";
import { hu } from "date-fns/locale";
import { TimesheetForm } from "./timesheet-form";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { TrashIcon } from "@radix-ui/react-icons";
import { useConfirm } from "@/app/hooks/use-confirm";
import axios from "axios";
import toast from "react-hot-toast";

type TimesheetTableProps = {
  data: TimesheetItem[];
};

export const TimesheetTable = ({ data }: TimesheetTableProps) => {
  const router = useRouter();
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [DeleteDialog, confirmDelete] = useConfirm("Delete item", "Are you sure you want to delete this item?");

  const name = user?.lastName + " " + user?.firstName;
  const timeFrom = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - (now.getMinutes() % 5));
    return now;
  };
  const timeTo = () => add(timeFrom(), { minutes: 60 });

  const onModalFormClose = () => {
    setOpen(false);
    router.refresh();
  };

  const deleteItem = async (id: string) => {
    if (!(await confirmDelete())) return;

    try {
      setIsLoading(true);
      await axios.delete(`/api/timesheetitems/${id}`);
      toast.success("Timesheet item deleted");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DeleteDialog />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>From</TableHead>
            <TableHead>To</TableHead>
            <TableHead>Spend time</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{format(item.timeFrom, "yyyy. MM. dd. HH:mm")}</TableCell>
              <TableCell>{format(item.timeTo, "yyyy. MM. dd. HH:mm")}</TableCell>
              <TableCell>{formatDistance(item.timeTo, item.timeFrom, { locale: hu })}</TableCell>
              <TableCell>
                <Button variant="ghost" title="Delete" onClick={() => deleteItem(item.id)} disabled={isLoading}>
                  <TrashIcon className="h-8 w-8 text-red-600" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" disabled={isLoading}>
            New entry
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>New entry</DialogTitle>
            <DialogDescription>Add a new entry to your timesheet</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <TimesheetForm name={name} timeFrom={timeFrom()} timeTo={timeTo()} onClose={onModalFormClose} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
