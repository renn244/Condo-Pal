import { cn } from "@/lib/utils"
import { format } from 'date-fns'
import { CalendarIcon } from "lucide-react"
import { UseFormReturn } from "react-hook-form"
import { Button } from "../ui/button"
import { Calendar } from "../ui/calendar"
import { FormControl } from "../ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { ScrollArea, ScrollBar } from "../ui/scroll-area"

type DateTimePickerProps<T> = {
    form: UseFormReturn<T | any, undefined>
    field: Extract<keyof T, string>,
}

/**
 * this datetime picker is used for shacn form component in shadcn with zod
 * @param form - form by useForm
 * @param field - Date
 * 
 * @returns <DateTimePicker />
 */
const DateTimePicker = <T,> ({
    form,
    field
}: DateTimePickerProps<T>) => {

    const value = form.getValues(field);

    const handleDateSelect = (date: Date | undefined) => {
        if(date) {
            form.setValue(field, date as any)
        }
    }

    const handleTimeChange = (type: "hour" | "minute" | "ampm", value: string) => {
        const currentDate = form.getValues(field) || new Date()
        let newDate = new Date(currentDate)
        
        if(type === 'hour') {
            const hour = parseInt(value, 10);
            newDate.setHours(newDate.getHours() >= 12 ? hour + 12 : hour);
        } else if (type === 'minute') {
            const minute = parseInt(value, 10);
            newDate.setMinutes(minute);
        } else if(type === 'ampm') {
            const hours = newDate.getHours();
            if(value === "AM" && hours >= 12) {
                newDate.setHours(hours - 12)
            } else if(value === "PM" && hours < 12) {
                newDate.setHours(hours + 12);
            }
        }

        form.setValue(field, newDate as any)
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <FormControl>
                    <Button variant={"outline"} 
                    className={cn("w-full pl-3 text-left font-normal",
                        !value && 'text-muted-foreground'
                    )}>
                        {value ? (
                            format(value, "MM/dd/yyyy hh:mm aa")
                        ) : (
                            <span>MM/DD/YYYY hh:mm aa</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <div className="sm:flex">
                    <Calendar 
                    mode="single"
                    selected={value}
                    onSelect={handleDateSelect}
                    />
                    <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                        <ScrollArea className="w-64 sm:w-auto">
                            <div className="flex sm:flex-col p-2">
                                {Array.from({ length: 12 }, (_, i) => i + 1)
                                .reverse()
                                .map((hour) => (
                                    <Button
                                    key={hour}
                                    size="icon"
                                    variant={
                                        value &&
                                        value.getHours() % 12 === hour % 12 ?
                                        "default" : "ghost"
                                    }
                                    className="sm:w-full shrink-0 aspect-square"
                                    onClick={() => handleTimeChange("hour", hour.toString())}>
                                        {hour}
                                    </Button>
                                ))}
                            </div>
                            <ScrollBar orientation="horizontal" className="sm:hidden" />
                        </ScrollArea>
                        <ScrollArea className="w-64 sm:w-auto">
                            <div className="flex sm:flex-col p-2">
                                {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                                    <Button
                                    key={minute}
                                    size="icon"
                                    variant={
                                        value &&
                                        value.getMinutes() === minute ?
                                        "default" : "ghost"
                                    }
                                    className="sm:w-full shrink-0 aspect-square"
                                    onClick={() => handleTimeChange("minute", minute.toString())}
                                    >
                                        {minute.toString().padStart(2, "0")}
                                    </Button>
                                ))}
                            </div>
                            <ScrollBar orientation="horizontal" className="sm:hidden" />
                        </ScrollArea>
                        <ScrollArea>
                            <div className="flex sm:flex-col p-2">
                                {['AM', 'PM'].map((ampm) => (
                                    <Button
                                    key={ampm}
                                    size="icon"
                                    variant={
                                        value &&
                                        ((ampm === "AM" && value.getHours() < 12) || (ampm === "PM" && value.getHours() >= 12))
                                        ? "default" : "ghost"
                                    }
                                    className="sm:w-full shrink-0 aspect-square"
                                    onClick={() => handleTimeChange("ampm", ampm)}>
                                        {ampm}
                                    </Button>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default DateTimePicker