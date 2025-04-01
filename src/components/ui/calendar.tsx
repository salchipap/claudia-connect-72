
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 pointer-events-auto", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center mb-2",
        caption_label: "text-base font-medium text-claudia-white",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-[#24D266]/20 border-[#24D266]/30 p-0 text-claudia-white hover:bg-[#24D266]/30 hover:text-claudia-white"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-claudia-white font-medium rounded-md w-9 font-normal text-[0.9rem] py-1",
        row: "flex w-full mt-2",
        cell: "relative h-10 w-10 text-center text-sm p-0 [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-[#1a2a30]/70 [&:has([aria-selected])]:bg-[#1a2a30] first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-10 w-10 p-0 font-normal text-claudia-white hover:bg-[#24D266]/20 aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-[#24D266] text-[#142126] hover:bg-[#24D266]/90 hover:text-[#142126] focus:bg-[#24D266] focus:text-[#142126]",
        day_today: "bg-[#24D266]/20 text-claudia-white",
        day_outside:
          "day-outside text-claudia-white/30 opacity-50 aria-selected:bg-[#1a2a30]/50 aria-selected:text-claudia-white/30 aria-selected:opacity-30",
        day_disabled: "text-claudia-white/30 opacity-50",
        day_range_middle:
          "aria-selected:bg-[#1a2a30] aria-selected:text-claudia-white",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ..._props }) => <ChevronLeft className="h-5 w-5" />,
        IconRight: ({ ..._props }) => <ChevronRight className="h-5 w-5" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
