import { useState } from 'react';
import { format } from 'date-fns';
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/utils/utils';

export function DatePicker({
  defaultDate,
  callBack,
}: {
  defaultDate?: Date;
  callBack?: (input: Date) => void;
}) {
  const [date, setDate] = useState<Date>(defaultDate);
  const [month, setMonth] = useState<Date>(new Date(2000, 0));

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (callBack) {
      callBack(new Date(selectedDate));
    }
  };

  const goToPreviousYear = (e: React.MouseEvent) => {
    e.preventDefault();
    const newMonth = new Date(month.getFullYear() - 1, month.getMonth());
    setMonth(newMonth);
  };

  const goToNextYear = (e: React.MouseEvent) => {
    e.preventDefault();
    const newMonth = new Date(month.getFullYear() + 1, month.getMonth());
    setMonth(newMonth);
  };

  const goToPreviousMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    const newMonth = new Date(month.getFullYear(), month.getMonth() - 1);
    setMonth(newMonth);
  };

  const goToNextMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    const newMonth = new Date(month.getFullYear(), month.getMonth() + 1);
    setMonth(newMonth);
  };

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="birthdate"
            variant="outline"
            className={cn(
              'w-full md:w-[280px] justify-start text-left font-normal',
              !date && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, 'PPP') : <span>Pick your birth date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="relative">
            <div className="flex items-center justify-between p-3 border-b border-border">
              <button
                onClick={goToPreviousYear}
                className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
                type="button"
              >
                <ChevronsLeft className="h-4 w-4" />
              </button>
              <button
                onClick={goToPreviousMonth}
                className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
                type="button"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="text-sm font-medium">
                {format(month, 'MMMM yyyy')}
              </div>
              <button
                onClick={goToNextMonth}
                className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
                type="button"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                onClick={goToNextYear}
                className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
                type="button"
              >
                <ChevronsRight className="h-4 w-4" />
              </button>
            </div>
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              month={month}
              onMonthChange={setMonth}
              disabled={(date) =>
                date > new Date() || date < new Date('1900-01-01')
              }
              className="pointer-events-auto"
              components={{
                IconLeft: () => null,
                IconRight: () => null,
              }}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
