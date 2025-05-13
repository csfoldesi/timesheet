"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { GroupForm } from "./group-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Group } from "@prisma/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PenIcon, TrashIcon } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useConfirm } from "@/app/hooks/use-confirm";
import toast from "react-hot-toast";
import axios from "axios";
import Link from "next/link";

type GroupsProps = {
  groups: Group[];
};

export const Groups = ({ groups }: GroupsProps) => {
  const router = useRouter();
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editedGroup, setEditedGroup] = useState<Group | undefined>();
  const [DeleteDialog, confirmDelete] = useConfirm("Delete item", "Are you sure you want to delete this item?");

  const onModalFormClose = () => {
    setOpen(false);
    setEditedGroup(undefined);
    router.refresh();
  };

  const deleteItem = async (id: string) => {
    if (!(await confirmDelete())) return;

    try {
      setIsLoading(true);
      await axios.delete(`/api/groups/${id}`);
      toast.success("Group deleted");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const onEdit = (group: Group) => {
    setEditedGroup(group);
    setOpen(true);
  };

  return (
    <div className="flex flex-col gap-4 max-w-[800px] rounded-lg border bg-card text-card-foreground shadow-sm">
      <DeleteDialog />

      <div className="flex items-center justify-end gap-x-2 pt-6 pr-6">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" disabled={false}>
              Új csoport
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Új csoport</DialogTitle>
              <DialogDescription>Új csoport létrehozása</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <GroupForm onClose={onModalFormClose} initData={editedGroup} />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border m-6">
        <Table>
          <TableHeader className="bg-slate-100 dark:bg-slate-800">
            <TableRow>
              <TableHead className="font-bold">Csoport</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groups.map((group) => (
              <TableRow key={group.id}>
                <TableCell className="font-medium">
                  <Link href={`/groups/${group.id}`}>{group.name}</Link>
                </TableCell>
                <TableCell className="text-right">
                  {group.ownerId === user?.id && (
                    <>
                      <Button variant="ghost" title="Edit" onClick={() => onEdit(group)} disabled={isLoading}>
                        <PenIcon className="h-8 w-8" />
                      </Button>
                      <Button variant="ghost" title="Delete" onClick={() => deleteItem(group.id)} disabled={isLoading}>
                        <TrashIcon className="h-8 w-8 text-red-600" />
                      </Button>
                    </>
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
