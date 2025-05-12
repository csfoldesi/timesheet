"use client";

import { TimesheetForm } from "@/app/timesheet/_components/timesheet-form";
import { RadioButtonSwitch } from "@/components/radio-button-switch";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useUser } from "@clerk/nextjs";
import { add } from "date-fns";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { groupViewOptions, useGroupContext } from "./GroupContext";
import { InfoIcon } from "lucide-react";
import Link from "next/link";

type GroupHeaderProps = {
  groupId: string;
};

export const GroupHeader = ({ groupId }: GroupHeaderProps) => {
  const router = useRouter();
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const { selectedView, setSelectedView } = useGroupContext();

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

  return (
    <div className="flex items-center gap-x-2">
      <RadioButtonSwitch options={groupViewOptions} defaultValue={selectedView} onChange={setSelectedView} />
      <div className="flex-1" />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="default" disabled={false}>
            Új bejegyzés
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Új bejegyzés</DialogTitle>
            <DialogDescription>Új bejegyzés hozzáadása</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <TimesheetForm
              groupId={groupId}
              name={name}
              timeFrom={timeFrom()}
              timeTo={timeTo()}
              onClose={onModalFormClose}
            />
          </div>
        </DialogContent>
      </Dialog>
      <Link href={`/groups/${groupId}/info`}>
        <Button variant="outline">
          <InfoIcon />
        </Button>
      </Link>
    </div>
  );
};
