"use client";

import { CopyText } from "@/components/copy-text";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

type InviteProps = {
  joinUrl: string;
};

export const Invite = ({ joinUrl }: InviteProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={false}>
          Meghívó
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full !max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Meghívó</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <div className="flex gap-4 py-4 overflow-hidden flex-col">
          <div className="flex-1">A következő link segítségével lehet csatlakozni a csoporthoz</div>
          <div className="space-y-2 max-w-[100%]">
            <CopyText
              text={joinUrl}
              className="rounded-md border bg-muted px-3 py-2 font-mono text-sm"
              iconClassName="cursor-pointer"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
