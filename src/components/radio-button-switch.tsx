"use client";

import { useState } from "react";
import { RadioGroup } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface RadioButtonOption {
  value: string;
  label: string;
}

interface RadioButtonSwitchProps {
  options: RadioButtonOption[];
  defaultValue: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function RadioButtonSwitch({ options, defaultValue, onChange, className }: RadioButtonSwitchProps) {
  const [selected, setSelected] = useState<string>(defaultValue);

  const handleValueChange = (value: string) => {
    setSelected(value);
    onChange?.(value);
  };

  return (
    <RadioGroup value={selected} onValueChange={handleValueChange} className={cn("flex", className)}>
      <div className="inline-flex rounded-md shadow-sm">
        {options.map((option, index) => {
          const isSelected = selected === option.value;
          const isFirst = index === 0;
          const isLast = index === options.length - 1;

          return (
            <Button
              key={option.value}
              type="button"
              variant={isSelected ? "default" : "outline"}
              className={cn(
                "relative",
                isSelected ? "z-10" : "",
                !isFirst && "rounded-l-none ml-[-1px]",
                !isLast && "rounded-r-none",
                !isSelected && "hover:bg-background"
              )}
              onClick={() => handleValueChange(option.value)}>
              {option.label}
            </Button>
          );
        })}
      </div>
    </RadioGroup>
  );
}
