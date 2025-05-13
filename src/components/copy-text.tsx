"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface CopyTextProps {
  text: string;
  className?: string;
  iconClassName?: string;
  displayText?: string;
  showFeedback?: boolean;
  feedbackDuration?: number;
}

export function CopyText({
  text,
  className,
  iconClassName,
  displayText,
  showFeedback = true,
  feedbackDuration = 2000,
}: CopyTextProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);

      if (showFeedback) {
        setTimeout(() => {
          setCopied(false);
        }, feedbackDuration);
      }
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  return (
    <div className={cn("flex items-center gap-2 w-full overflow-hidden", className)}>
      <span className="truncate min-w-0 flex-1">{displayText || text}</span>
      <Button
        variant="ghost"
        size="icon"
        className={cn("h-8 w-8 flex-shrink-0", iconClassName)}
        onClick={handleCopy}
        aria-label={copied ? "Copied" : "Copy to clipboard"}>
        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  );
}
