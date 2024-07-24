"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ActionTooltip } from "@/components/action-tooltip";

interface UserItemProps {
  id: string;
  imageUrl: string;
  name: string;
  isAdmin: boolean;
}

export function UserItem({ id, imageUrl, name, isAdmin }: UserItemProps) {
  return (
    <ActionTooltip side="left" align="center" label={name}>
      <div className="group relative flex items-center">
        <div
          className={cn(
            "relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] transition-all overflow-hidden bg-violet-800",
            isAdmin ? "border-2 border-red-500" : "border-2 border-green-500"
          )}
        >
          <Image
            fill
            src={imageUrl}
            alt="User"
            className="transition-transform transform group-hover:scale-110 group-hover:rotate-3"
          />
        </div>
        <span className="ml-3 text-primary">{name}</span>
      </div>
    </ActionTooltip>
  );
}

