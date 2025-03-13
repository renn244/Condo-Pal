import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import useDebounceValue from "@/hooks/useDebounceValue"
import usePaymentsParams from "@/hooks/usePaymentsParams"
import { Search } from "lucide-react"
import { useEffect, useState } from "react"

const PaymentsHeader = () => {
    const { 
        search, paymentType, status,
        setSearch, setPaymentType, setStatus
    } = usePaymentsParams();

    const [searchInput, setSearchInput] = useState(search || "");
    const debounceSearch = useDebounceValue(searchInput, 500);
    
    useEffect(() => {
        if(debounceSearch === undefined) return
        setSearch(debounceSearch);
    }, [debounceSearch])

    return (
       <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by condo, tenant, or reference..."
                className="pl-10"
                />
            </div>

            <div className="flex gap-2">
                <Select value={paymentType} onValueChange={setPaymentType}>
                    <SelectTrigger className="w-[160px]">
                        <SelectValue className="Payment Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Payment Type</SelectLabel>
                            <SelectItem value="ALL">ALL Type</SelectItem>
                            <SelectItem value="GCASH">Gcash</SelectItem>
                            <SelectItem value="MANUAL">Manual</SelectItem>
                            <SelectItem value="PAYMONGO">Paymongo</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>

                {paymentType === "GCASH" && (
                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger className="w-[160px]">
                            <SelectValue className="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Gcash Status</SelectLabel>
                                <SelectItem value="ALL">ALL Status</SelectItem>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="APPROVED">Approved</SelectItem>
                                <SelectItem value="REJECTED">Rejected</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                )}
            </div>
        </div>
    )
}

export default PaymentsHeader