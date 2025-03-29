import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import useDebounceValue from '@/hooks/useDebounceValue';
import useViewCondoParams from '@/hooks/useViewCondoParams';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

const MaintenanceHeader = () => {
    const { status, priority, maintenanceSearch,  setStatus, setPriority, setSearch } = useViewCondoParams();

    const [inputSearch, setInputSearch] = useState<string>(maintenanceSearch || "");
    const debounceValue = useDebounceValue(inputSearch, 500);

    // Sync local state with external maintenanceSearch changes // like Look in the pending maintenance requests
    useEffect(() => {
        setInputSearch(maintenanceSearch || "");
    }, [maintenanceSearch]);

    useEffect(() => {
        if(debounceValue === undefined) return
        setSearch('maintenance', debounceValue)
    }, [debounceValue])

    return (
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                placeholder="Search maintenance requests..."
                className="pl-10"
                value={inputSearch}
                onChange={(e) => setInputSearch(e.target.value)}
                />
            </div>
            <div className="flex gap-2">
                <Select
                value={status}
                onValueChange={(value) => setStatus(value as MaintenanceStatus | "ALL")}
                >
                <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="ALL">All Status</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="CANCELED">Canceled</SelectItem>
                </SelectContent>
                </Select>
                <Select
                value={priority}
                onValueChange={(value) => setPriority(value as PriorityLevel | "ALL")}
                >
                <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="ALL">All Priority</SelectItem>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                </SelectContent>
                </Select>
            </div>
        </div>
    )
}

export default MaintenanceHeader