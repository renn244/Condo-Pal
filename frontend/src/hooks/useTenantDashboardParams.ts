import { useSearchParams } from "react-router-dom"

const useTenantDashboardParams = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // maintenanec tab
    const status = searchParams.get('status') || 'ALL';
    const priority = searchParams.get('priority') || 'ALL';
    const maintenancePage = parseInt(searchParams.get('maintenancePage') || '1');
    const maintenanceSearch = searchParams.get('maintenanceSearch') || '';

    // payment tab
    const paymentType = searchParams.get('paymentType') || 'ALL';
    const paymentStatus = searchParams.get('paymentStatus') || 'ALL';
    const paymentPage = parseInt(searchParams.get('paymentPage') || '1');
    const paymentSearch = searchParams.get('paymentSearch') || '';

    // maintenance
    const setStatus = (value: MaintenanceStatus | "ALL" ) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('status', value);
        setSearchParams(newParams);
    }

    const setPriority = (value: PriorityLevel | "ALL") => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('priority', value);
        setSearchParams(newParams);
    }

    // payment
    const setPaymentType = (value: CondoPaymentType | "ALL") => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('paymentType', value);
        if(value !== "GCASH") newParams.set('paymentStatus', "ALL");
        setSearchParams(newParams);
    }

    const setPaymentStatus = (value: GcashPaymentStatus | "ALL") => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('paymentStatus', value);
        setSearchParams(newParams);
    }

    // general
    const setPage = (type: 'maintenance' | 'payment', value: number) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set(`${type}Page`, value.toString());
        setSearchParams(newParams);
    }

    const setSearch = (type: 'maintenance' | 'payment', value: string) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set(`${type}Search`, value);
        setSearchParams(newParams);
    }

    return {
        setPage, setSearch, // general
        // maintenance
        status, priority, maintenancePage, maintenanceSearch,
        setStatus, setPriority,
        // payment
        paymentType, paymentStatus, paymentPage, paymentSearch,
        setPaymentType, setPaymentStatus,
    }
}

export default useTenantDashboardParams