import { useSearchParams } from "react-router-dom"

const useMaintenanceParams = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'ALL';
    const priority = searchParams.get('priority') || 'ALL';

    const setSearch = (value: string) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('search', value);
        setSearchParams(newParams);
    }

    const setPage = (value: number) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('page', value.toString());
        setSearchParams(newParams);
    }

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

    return {
        page, search, status, priority,
        setSearch, setPage, setStatus, setPriority
    }
}

export default useMaintenanceParams