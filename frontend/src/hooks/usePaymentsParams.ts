import { useSearchParams } from "react-router-dom"


const usePaymentsParams = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search') || "";
    const status = searchParams.get('status') || "ALL"; // GCASH Status
    const paymentType = searchParams.get('paymentType') || "ALL";

    const setPage = (value: number) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('page', value.toString());
        setSearchParams(newParams);
    }

    const setSearch = (value: string) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('search', value);
        setSearchParams(newParams);
    }

    const setStatus = (value: GcashPaymentStatus | "ALL") => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('status', value);
        setSearchParams(newParams);
    }

    const setPaymentType = (value: CondoPaymentType | "ALL") => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('paymentType', value);
        // so that when switch out from gcash we won't need to filter out gcash Status
        if(value !== "GCASH") newParams.set('status', "ALL");
        setSearchParams(newParams);
    }

    return {
        page, search, status, paymentType,
        setPage, setSearch, setStatus, setPaymentType
    }
}

export default usePaymentsParams