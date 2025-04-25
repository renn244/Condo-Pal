import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import useDebounceValue from "@/hooks/useDebounceValue"
import { Search } from "lucide-react"
import { useEffect, useState } from "react"

type ExpenseHeaderProps = {
    search: string,
    setSearch: (value: string) => void,
    expenseRecurrence: string,
    setExpenseRecurrence: (value: Recurrence | "ALL") => void,
    expenseCategory: string,
    setExpenseCategory: (value: ExpenseCategory | "ALL") => void,

    expenseIsRecurring: boolean,
    setExpenseIsRecurring: (value: boolean) => void,
}

const ExpenseHeader = ({
    search, setSearch,
    expenseRecurrence, setExpenseRecurrence,
    expenseCategory, setExpenseCategory,
    expenseIsRecurring, setExpenseIsRecurring
}: ExpenseHeaderProps) => {
    const [inputSearch, setInputSearch] = useState<string>(search || "")
    const debounceValue = useDebounceValue(inputSearch, 500);

    useEffect(() => {
        if (debounceValue === undefined) return
        setSearch(debounceValue)
    }, [debounceValue])

    return (
        <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input value={inputSearch} onChange={(e) => setInputSearch(e.target.value)} 
                placeholder="Search expense..." className="pl-10 w-full" />
            </div>
            <div className="flex gap-2">
                <div className="flex items-center gap-2">
                    <Label>isRecurring</Label>
                    <Checkbox checked={expenseIsRecurring} onCheckedChange={setExpenseIsRecurring} />
                </div>

                {expenseIsRecurring &&(
                    <Select value={expenseRecurrence} onValueChange={setExpenseRecurrence}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Recurrence" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">ALL Recurrence</SelectItem>
                            <SelectItem value="MONTHLY">Monthly</SelectItem>
                            <SelectItem value="QUERTERLY">Querterly</SelectItem>
                            <SelectItem value="YEARLY">Yearly</SelectItem>
                        </SelectContent>
                    </Select>
                )}

                <Select value={expenseCategory} onValueChange={setExpenseCategory}>
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Category" /> 
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Category</SelectItem>
                        <SelectItem value="UTILITY">Utility</SelectItem>
                        <SelectItem value="ASSOCIATION">Association</SelectItem>
                        <SelectItem value="CLEANING">Cleaning</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}

export default ExpenseHeader