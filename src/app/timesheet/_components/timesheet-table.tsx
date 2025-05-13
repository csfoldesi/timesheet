"use client";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TimesheetItem } from "@prisma/client";
import { format, formatDistance } from "date-fns";
import { hu } from "date-fns/locale";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { TrashIcon } from "@radix-ui/react-icons";
import { useConfirm } from "@/app/hooks/use-confirm";
import axios from "axios";
import toast from "react-hot-toast";
import { useGroupContext } from "@/app/groups/[groupId]/_components/GroupContext";

type TimesheetTableProps = {
  groupId: string;
  data: TimesheetItem[];
};

export const TimesheetTable = ({ data }: TimesheetTableProps) => {
  const router = useRouter();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [DeleteDialog, confirmDelete] = useConfirm("Bejegyzés törlése", "Valóba törölni szeretnéd ezt a bejegyzést?");
  const { selectedView } = useGroupContext();

  const filteredData = selectedView === "own" ? data.filter((item) => item.userId === user?.id) : data;

  const deleteItem = async (id: string) => {
    if (!(await confirmDelete())) return;

    try {
      setIsLoading(true);
      await axios.delete(`/api/timesheetitems/${id}`);
      toast.success("A bejegyzés törölve lett");
      router.refresh();
    } catch {
      toast.error("Hiba történt");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto">
      <DeleteDialog />

      <div className="rounded-md border m-6">
        <Table>
          <TableHeader className="bg-slate-100 dark:bg-slate-800">
            <TableRow>
              <TableHead className="font-bold">Név</TableHead>
              <TableHead className="font-bold">Érkezés</TableHead>
              <TableHead className="font-bold">Távozás</TableHead>
              <TableHead className="font-bold">Időtartam</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{format(item.timeFrom, "yyyy. MM. dd. HH:mm")}</TableCell>
                <TableCell>{format(item.timeTo, "yyyy. MM. dd. HH:mm")}</TableCell>
                <TableCell>{formatDistance(item.timeTo, item.timeFrom, { locale: hu })}</TableCell>
                <TableCell>
                  {item.userId === user?.id && (
                    <Button variant="ghost" title="Delete" onClick={() => deleteItem(item.id)} disabled={isLoading}>
                      <TrashIcon className="h-8 w-8 text-red-600" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
