"use client";

import { RadioButtonOption } from "@/components/radio-button-switch";
import { createContext, ReactNode, useContext, useState } from "react";

export const groupViewOptions: RadioButtonOption[] = [
  { value: "own", label: "Saját" },
  { value: "all", label: "Összes" },
];

interface IGroupContext {
  selectedView: string;
  setSelectedView: (value: string) => void;
}

const GroupContext = createContext<IGroupContext | undefined>(undefined);

export const GroupProvider = ({ children }: { children: ReactNode }) => {
  const [selectedView, setSelectedView] = useState<string>("own");

  return <GroupContext.Provider value={{ selectedView, setSelectedView }}>{children}</GroupContext.Provider>;
};

export const useGroupContext = () => {
  const context = useContext(GroupContext);
  if (!context) {
    throw new Error("useGroupContext must be used within a GroupProvider");
  }
  return context;
};
