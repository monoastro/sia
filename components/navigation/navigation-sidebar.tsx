//import  {currentProfile}  
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NavigationItem } from "@/components/navigation/navigation-item";
//import { ModeToggle } from "@/components/mode-toggle";
import { tabs } from "@/lib/data";
import React from "react";

export const Sidebar : React.FC = () => {
  return (
    <div className="space-y-4 flex flex-col items-center h-full text-primary w-full py-3" style={{ backgroundColor: 'rgba(22, 31, 115, 1)' }}>
        <NavigationItem
          id="10"
          name="dashboard"
          imageUrl="/static/emma.svg"
        />
      <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
      <ScrollArea className="flex-1 w-full">
        {tabs.map((tab) => (
          <div key={tab.id} className="mb-4"> 
            <NavigationItem
              id={tab.id}
              name={tab.name}
              imageUrl={tab.imageUrl}
            />
          </div>
        ))}
      </ScrollArea>
    </div>
  );
};
