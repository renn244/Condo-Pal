import { useSearchParams } from "react-router-dom"

const useTenantDashboardParams = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // maintenanec tab
    const status = searchParams.get('status') || 'ALL';
    const priority = searchParams.get('priority') || 'ALL';
    const maintenancePage = parseInt(searchParams.get('maintenancePage') || '1');
    const maintenanceSearch = searchParams.get('maintenanceSearch') || '';

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
    }
}

export default useTenantDashboardParams